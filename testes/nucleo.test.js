import test from 'node:test'
import assert from 'node:assert/strict'

import { vazio, vao, cheio, poe, ehPerfeito, ehComposto, areaFecha, semSobreposicao, desenha, mdc, ehPrimitivo } from '../js/nucleo.js'
import { ladrilhamentos, perfeitos } from '../js/busca.js'
import { contaPorGrade, fibonacci, recorrenciaDaFaixa3, confere, canonica, distintos } from '../js/juiz.js'

test('o vao e o mais baixo e, no empate, o mais a esquerda', () => {
  assert.deepEqual(vao(Int32Array.from([2, 1, 1, 3])), { coluna: 1, largura: 2, altura: 1 })
  assert.deepEqual(vao(vazio(4)), { coluna: 0, largura: 4, altura: 0 })
})

test('por um quadrado sobe so as colunas dele, e nao mexe no original', () => {
  const h = vazio(5)
  const n = poe(h, 1, 3)
  assert.deepEqual([...n], [0, 3, 3, 3, 0])
  assert.deepEqual([...h], [0, 0, 0, 0, 0])
})

test('cheio so quando todas as colunas chegam na altura', () => {
  assert.equal(cheio(Int32Array.from([3, 3, 3]), 3), true)
  assert.equal(cheio(Int32Array.from([3, 2, 3]), 3), false)
})

test('perfeito e todos os lados diferentes', () => {
  assert.equal(ehPerfeito([1, 4, 7]), true)
  assert.equal(ehPerfeito([1, 4, 4]), false)
})

test('um quadrado sozinho NAO faz o ladrilhamento ser composto', () => {
  // A primeira versao contava o quadrado unico como "sub-retangulo" e acusava
  // todo ladrilhamento de dois ou mais quadrados. O 32x33 classico saia composto.
  assert.equal(ehComposto([{ x: 0, y: 0, lado: 1 }], 1, 1), false)
  assert.equal(ehComposto([{ x: 0, y: 0, lado: 2 }, { x: 2, y: 0, lado: 1 }, { x: 2, y: 1, lado: 1 }], 3, 2), true)
})

test('o composto montado a mao: os dois 1x1 empilhados formam um 1x2', () => {
  const q = [{ x: 0, y: 0, lado: 2 }, { x: 2, y: 0, lado: 1 }, { x: 2, y: 1, lado: 1 }]
  assert.equal(areaFecha(q, 3, 2), true)
  assert.equal(semSobreposicao(q), true)
  assert.equal(ehComposto(q, 3, 2), true)
})

test('area que nao fecha e sobreposicao sao acusadas', () => {
  assert.equal(areaFecha([{ x: 0, y: 0, lado: 1 }], 2, 1), false)
  assert.equal(semSobreposicao([{ x: 0, y: 0, lado: 2 }, { x: 1, y: 1, lado: 1 }]), false)
  assert.equal(confere([{ x: 0, y: 0, lado: 2 }], 1, 1).ok, false)
})

test('primitivo e largura e altura primos entre si', () => {
  assert.equal(mdc(32, 33), 1)
  assert.equal(ehPrimitivo(32, 33), true)
  assert.equal(ehPrimitivo(4, 6), false)
})

test('o quadrado n x n tem um perfeito so: ele mesmo', () => {
  for (const n of [1, 2, 3, 4, 5, 6]) assert.equal(perfeitos(n, n).quantos, 1, `${n}x${n}`)
})

test('a faixa 1 x n tem um ladrilhamento so', () => {
  for (let n = 1; n <= 8; n++) assert.equal(ladrilhamentos(n, 1, { guardarAte: 0 }).quantos, 1)
})

test('a faixa 2 x n e Fibonacci', () => {
  for (let n = 1; n <= 12; n++) assert.equal(ladrilhamentos(n, 2, { guardarAte: 0 }).quantos, fibonacci(n), `2x${n}`)
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(fibonacci), [1, 2, 3, 5, 8, 13])
})

test('a faixa 3 x n segue a recorrencia lida na coluna', () => {
  for (let n = 1; n <= 12; n++) assert.equal(ladrilhamentos(n, 3, { guardarAte: 0 }).quantos, recorrenciaDaFaixa3(n), `3x${n}`)
})

test('largura e altura trocadas dao a mesma contagem', () => {
  for (const [w, h] of [[3, 5], [4, 5], [2, 7]]) {
    assert.equal(ladrilhamentos(w, h, { guardarAte: 0 }).quantos, ladrilhamentos(h, w, { guardarAte: 0 }).quantos)
  }
})

test('horizonte e grade concordam, e abrem os mesmos nos', () => {
  for (const [w, h] of [[3, 3], [4, 4], [4, 5], [5, 5]]) {
    const a = ladrilhamentos(w, h, { guardarAte: 0 })
    const b = contaPorGrade(w, h)
    assert.equal(a.quantos, b.quantos, `${w}x${h}`)
    // Os nos iguais dizem que a grade e a mesma arvore em outra roupa. Por isso
    // os juizes que contam de verdade sao as formulas das faixas.
    assert.equal(a.nos, b.nos, `${w}x${h}`)
  }
})

test('todo ladrilhamento do 5x5 passa na conferencia', () => {
  const r = ladrilhamentos(5, 5, { guardarAte: Infinity })
  assert.equal(r.quantos, 472)
  for (const q of r.exemplos) assert.equal(confere(q, 5, 5).ok, true)
})

test('a poda de lado repetido nao perde perfeito nenhum', () => {
  for (const [w, h] of [[4, 4], [5, 6], [6, 6]]) {
    const todos = ladrilhamentos(w, h, { guardarAte: Infinity })
    const filtrados = todos.exemplos.filter((q) => ehPerfeito(q.map((s) => s.lado))).length
    assert.equal(perfeitos(w, h).quantos, filtrados, `${w}x${h}`)
  }
})

test('a forma canonica junta as quatro imagens', () => {
  const q = [{ x: 0, y: 0, lado: 2 }, { x: 2, y: 0, lado: 1 }, { x: 2, y: 1, lado: 1 }]
  const espelho = q.map((s) => ({ x: 3 - s.x - s.lado, y: s.y, lado: s.lado }))
  assert.equal(canonica(q, 3, 2), canonica(espelho, 3, 2))
  assert.equal(distintos([q, espelho], 3, 2), 1)
})

test('o desenho tem uma linha por fileira e uma letra por quadrado', () => {
  const t = desenha([{ x: 0, y: 0, lado: 2 }, { x: 2, y: 0, lado: 1 }, { x: 2, y: 1, lado: 1 }], 3, 2)
  assert.deepEqual(t.split('\n'), ['AAB', 'AAC'])
})
