// O juiz. Caminhos que nao passam pela linha de horizonte.
//
// 1. `contaPorGrade` — a mesma contagem com o retangulo guardado casa a casa,
//    numa grade de booleanos, enchendo a primeira casa vazia em ordem de
//    leitura. E outro codigo e outra representacao: se a linha de horizonte
//    tivesse um erro de vao, a grade nao repetiria o erro.
//
// 2. `fibonacci` e `recorrenciaDaFaixa3` — formulas fechadas para as faixas de
//    altura 2 e 3. A de altura 2 e Fibonacci (o primeiro quadrado da ponta e de
//    lado 1 ou de lado 2). A de altura 3 e uma recorrencia LIDA na coluna
//    medida e confirmada por previsao em duas linhas novas — o README diz isso
//    com essas palavras, e nao a apresenta como teorema citado.
//
// 3. `confere` — o que todo ladrilhamento tem de cumprir: a soma das areas
//    fecha com a area do retangulo, nada se sobrepoe, nada sai da borda.

import { areaFecha, semSobreposicao } from './nucleo.js'

/** Conta os ladrilhamentos pela grade casa a casa. So para retangulo pequeno. */
export function contaPorGrade (largura, altura, teto = 5_000_000) {
  const grade = Array.from({ length: altura }, () => new Uint8Array(largura))
  let quantos = 0
  let nos = 0
  let estourou = false

  const primeiraVazia = () => {
    for (let y = 0; y < altura; y++) {
      for (let x = 0; x < largura; x++) if (!grade[y][x]) return [x, y]
    }
    return null
  }

  const cabe = (x, y, lado) => {
    if (x + lado > largura || y + lado > altura) return false
    for (let j = y; j < y + lado; j++) {
      for (let i = x; i < x + lado; i++) if (grade[j][i]) return false
    }
    return true
  }

  const marca = (x, y, lado, v) => {
    for (let j = y; j < y + lado; j++) for (let i = x; i < x + lado; i++) grade[j][i] = v
  }

  const anda = () => {
    if (estourou) return
    nos++
    if (nos > teto) { estourou = true; return }
    const p = primeiraVazia()
    if (!p) { quantos++; return }
    const [x, y] = p
    for (let lado = 1; cabe(x, y, lado); lado++) {
      marca(x, y, lado, 1)
      anda()
      marca(x, y, lado, 0)
    }
  }

  anda()
  return { quantos, nos, completa: !estourou }
}

/** A faixa 2 x n: Fibonacci, com f(1) = 1 e f(2) = 2. */
export function fibonacci (n) {
  let a = 1
  let b = 2
  if (n === 1) return 1
  for (let i = 3; i <= n; i++) { const t = a + b; a = b; b = t }
  return b
}

/**
 * A faixa 3 x n pela recorrencia lida na medida:
 *     a(n) = a(n-1) + 2 a(n-2) + a(n-3),   a(0) = 1, a(1) = 1, a(2) = 3
 */
export function recorrenciaDaFaixa3 (n) {
  const a = [1, 1, 3]
  for (let i = 3; i <= n; i++) a.push(a[i - 1] + 2 * a[i - 2] + a[i - 3])
  return a[n]
}

/** Confere um ladrilhamento pela definicao. */
export function confere (quadrados, largura, altura) {
  const problemas = []
  if (!areaFecha(quadrados, largura, altura)) problemas.push('a soma das areas nao fecha')
  if (!semSobreposicao(quadrados)) problemas.push('ha quadrados sobrepostos')
  for (const q of quadrados) {
    if (q.x < 0 || q.y < 0 || q.x + q.lado > largura || q.y + q.lado > altura) {
      problemas.push(`quadrado ${q.lado} em (${q.x},${q.y}) sai da borda`)
      break
    }
  }
  return { ok: problemas.length === 0, problemas }
}

/**
 * As quatro imagens de um ladrilhamento de retangulo nao quadrado: identidade,
 * espelho horizontal, espelho vertical e meia-volta. A forma canonica e a menor
 * das quatro, e ela diz quantos ladrilhamentos sao REALMENTE diferentes.
 */
export function canonica (quadrados, largura, altura) {
  const imagens = [
    quadrados,
    quadrados.map((s) => ({ x: largura - s.x - s.lado, y: s.y, lado: s.lado })),
    quadrados.map((s) => ({ x: s.x, y: altura - s.y - s.lado, lado: s.lado })),
    quadrados.map((s) => ({ x: largura - s.x - s.lado, y: altura - s.y - s.lado, lado: s.lado }))
  ]
  return imagens.map((im) => im.map((s) => `${s.x},${s.y},${s.lado}`).sort().join(';')).sort()[0]
}

export function distintos (lista, largura, altura) {
  return new Set(lista.map((q) => canonica(q, largura, altura))).size
}
