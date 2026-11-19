// A varredura dos ladrilhamentos, pela linha de horizonte.
//
// O proximo quadrado entra sempre no vao mais baixo e mais a esquerda. Isso nao
// e escolha: aquela casa precisa ser coberta por ALGUEM, e quem a cobre tem o
// canto inferior esquerdo exatamente ali. Entao a busca nao perde ladrilhamento
// nenhum e nao repete nenhum — cada um aparece numa ordem so, e nao em todas as
// ordens em que os quadrados poderiam ter sido colocados.
//
// Essa e a diferenca entre varrer 2^area subconjuntos e varrer o que existe.

import { vazio, vao, cheio, poe, ehPerfeito, ehComposto, areaFecha, ehPrimitivo } from './nucleo.js'

/**
 * Todos os ladrilhamentos de largura x altura por quadrados.
 *
 * `soPerfeitos` corta o ramo assim que um lado se repete: economia grande e
 * sem perda, porque um ramo que ja repetiu nunca mais vira perfeito.
 *
 * `teto` limita os nos abertos. Quando ele e atingido, o resultado vem com
 * `completa: false` e a contagem NAO vale como contagem — e a tabela diz isso.
 */
export function ladrilhamentos (largura, altura, opcoes = {}) {
  const soPerfeitos = opcoes.soPerfeitos === true
  const teto = opcoes.teto || Infinity
  const guardarAte = opcoes.guardarAte === undefined ? 50 : opcoes.guardarAte

  const achados = []
  let quantos = 0
  let nos = 0
  let estourou = false

  const anda = (horizonte, postos, usados) => {
    if (estourou) return
    nos++
    if (nos > teto) { estourou = true; return }
    if (cheio(horizonte, altura)) {
      quantos++
      if (achados.length < guardarAte) achados.push(postos.map((q) => ({ ...q })))
      return
    }
    const v = vao(horizonte)
    const alturaQueSobra = altura - v.altura
    const maior = Math.min(v.largura, alturaQueSobra)
    // Do maior para o menor: o ramo largo aparece cedo e o corte morde antes.
    for (let lado = maior; lado >= 1; lado--) {
      if (soPerfeitos && usados.has(lado)) continue
      if (soPerfeitos) usados.add(lado)
      postos.push({ x: v.coluna, y: v.altura, lado })
      anda(poe(horizonte, v.coluna, lado), postos, usados)
      postos.pop()
      if (soPerfeitos) usados.delete(lado)
    }
  }

  anda(vazio(largura), [], new Set())
  return { largura, altura, quantos, nos, exemplos: achados, completa: !estourou }
}

/** So os perfeitos: todos os lados diferentes. */
export function perfeitos (largura, altura, opcoes = {}) {
  const r = ladrilhamentos(largura, altura, { ...opcoes, soPerfeitos: true })
  return { ...r, perfeitos: r.quantos }
}

/**
 * Os perfeitos SIMPLES: os que nao sao dois ladrilhamentos menores colados.
 *
 * O trivial (um quadrado so, no retangulo 1x1) e perfeito e simples por vacuo,
 * e entra na contagem. Os de ordem 1 em retangulo quadrado tambem — um
 * quadrado n x n e o ladrilhamento perfeito trivial dele mesmo.
 */
export function perfeitosSimples (largura, altura, opcoes = {}) {
  const r = ladrilhamentos(largura, altura, { ...opcoes, soPerfeitos: true, guardarAte: Infinity })
  if (!r.completa) return { ...r, simples: null, compostos: null }
  let simples = 0
  let compostos = 0
  const exemplos = []
  for (const q of r.exemplos) {
    if (ehComposto(q, largura, altura)) compostos++
    else { simples++; if (exemplos.length < 20) exemplos.push(q) }
  }
  return { ...r, simples, compostos, exemplosSimples: exemplos }
}

/**
 * Varre os retangulos ate um limite e acha o primeiro perfeito de ordem >= 2.
 *
 * A pergunta "qual o menor retangulo que se ladrilha com quadrados todos
 * diferentes?" so tem resposta forte se tudo abaixo foi varrido — e e isso que
 * a ordem da varredura garante: por area crescente.
 */
export function primeiroPerfeito (limite, opcoes = {}) {
  const ordemPorArea = []
  for (let w = 1; w <= limite; w++) {
    for (let h = w; h <= limite; h++) ordemPorArea.push([w, h])
  }
  ordemPorArea.sort((a, b) => (a[0] * a[1]) - (b[0] * b[1]))

  const visitados = []
  for (const [w, h] of ordemPorArea) {
    if (w === h) continue   // o quadrado tem o ladrilhamento trivial de ordem 1
    const r = perfeitos(w, h, opcoes)
    if (!r.completa) return { achado: null, parou: `${w}x${h}`, visitados }
    // Ordem 1 nao existe em retangulo nao quadrado, entao qualquer perfeito
    // aqui ja tem ordem 2 ou mais.
    visitados.push({ w, h, area: w * h, perfeitos: r.quantos })
    if (r.quantos > 0) {
      return { achado: { w, h, area: w * h, quantos: r.quantos, exemplo: r.exemplos[0] }, visitados }
    }
  }
  return { achado: null, parou: `nada ate ${limite}`, visitados }
}

/** A tabela de um retangulo: todos, perfeitos, simples. */
export function linha (largura, altura, opcoes = {}) {
  const todos = ladrilhamentos(largura, altura, { ...opcoes, guardarAte: 0 })
  const perf = perfeitosSimples(largura, altura, opcoes)
  return {
    largura, altura, area: largura * altura,
    primitivo: ehPrimitivo(largura, altura),
    todos: todos.completa ? todos.quantos : null,
    nosDeTodos: todos.nos,
    perfeitos: perf.completa ? perf.quantos : null,
    nosDePerfeitos: perf.nos,
    simples: perf.simples,
    compostos: perf.compostos,
    completa: todos.completa && perf.completa
  }
}

/** Distribuicao dos perfeitos por ordem (quantos quadrados usam). */
export function porOrdem (largura, altura) {
  const r = ladrilhamentos(largura, altura, { soPerfeitos: true, guardarAte: Infinity })
  const mapa = new Map()
  for (const q of r.exemplos) mapa.set(q.length, (mapa.get(q.length) || 0) + 1)
  return [...mapa.entries()].sort((a, b) => a[0] - b[0]).map(([ordem, quantos]) => ({ ordem, quantos }))
}

export { ehPerfeito, areaFecha, ehComposto, ehPrimitivo }
