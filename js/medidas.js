// As tabelas do README. Calculadas aqui, e em lugar nenhum mais.

import { ehComposto } from './nucleo.js'
import { ladrilhamentos, perfeitos, primeiroPerfeito } from './busca.js'
import { contaPorGrade, fibonacci, recorrenciaDaFaixa3, confere, distintos } from './juiz.js'

const guardadas = new Map()
function umaVez (chave, fn) {
  if (!guardadas.has(chave)) guardadas.set(chave, fn())
  return guardadas.get(chave)
}

/** Quantos ladrilhamentos cada retangulo pequeno tem, e quantos sao perfeitos. */
export function pequenos () {
  return umaVez('pequenos', () =>
    [[2, 2], [2, 3], [3, 3], [3, 4], [4, 4], [4, 5], [5, 5], [5, 6], [6, 6]].map(([w, h]) => {
      const t = ladrilhamentos(w, h, { guardarAte: 0 })
      const p = perfeitos(w, h)
      return { w, h, area: w * h, todos: t.quantos, nos: t.nos, perfeitos: p.quantos }
    })
  )
}

/** A faixa de altura 2 contra Fibonacci. */
export function faixa2 (ate = 12) {
  return umaVez(`f2:${ate}`, () => {
    const linhas = []
    for (let n = 1; n <= ate; n++) linhas.push({ n, medido: ladrilhamentos(n, 2, { guardarAte: 0 }).quantos, formula: fibonacci(n) })
    return linhas
  })
}

/** A faixa de altura 3 contra a recorrencia lida na coluna. */
export function faixa3 (ate = 12) {
  return umaVez(`f3:${ate}`, () => {
    const linhas = []
    for (let n = 1; n <= ate; n++) linhas.push({ n, medido: ladrilhamentos(n, 3, { guardarAte: 0 }).quantos, formula: recorrenciaDaFaixa3(n) })
    return linhas
  })
}

/** O menor retangulo nao quadrado com ladrilhamento perfeito. */
export function primeiro () {
  return umaVez('primeiro', () => {
    const r = primeiroPerfeito(36)
    const a = r.achado
    const todos = ladrilhamentos(a.w, a.h, { soPerfeitos: true, guardarAte: Infinity })
    const lados = a.exemplo.map((q) => q.lado).sort((x, y) => x - y)
    return {
      w: a.w,
      h: a.h,
      area: a.area,
      ordem: a.exemplo.length,
      lados,
      somaDosQuadrados: lados.reduce((s, l) => s + l * l, 0),
      ladrilhamentos: todos.quantos,
      distintos: distintos(todos.exemplos, a.w, a.h),
      simples: todos.exemplos.filter((q) => !ehComposto(q, a.w, a.h)).length,
      conferidos: todos.exemplos.filter((q) => confere(q, a.w, a.h).ok).length,
      retangulosVarridos: r.visitados.length,
      exemplo: a.exemplo
    }
  })
}

/** A busca da linha de horizonte contra a grade casa a casa. */
export function duelo () {
  return umaVez('duelo', () =>
    [[3, 3], [4, 4], [4, 5], [5, 5], [5, 6], [6, 6]].map(([w, h]) => {
      const a = ladrilhamentos(w, h, { guardarAte: 0 })
      const b = contaPorGrade(w, h)
      return { w, h, horizonte: a.quantos, grade: b.quantos, nosHorizonte: a.nos, nosGrade: b.nos, concordam: a.quantos === b.quantos }
    })
  )
}

/** O que a poda de lado repetido vale no 32x33. */
export function poda () {
  return umaVez('poda', () => {
    const com = perfeitos(33, 32)
    const sem = ladrilhamentos(33, 32, { teto: 30_000_000, guardarAte: 0 })
    return { nosComPoda: com.nos, semPodaTerminou: sem.completa, nosSemPoda: sem.nos, teto: 30_000_000 }
  })
}
