// Os numeros do README, presos.

import test from 'node:test'
import assert from 'node:assert/strict'

import { pequenos, faixa2, faixa3, duelo } from '../js/medidas.js'

test('quantos ladrilhamentos cada retangulo pequeno tem', () => {
  const m = new Map(pequenos().map((l) => [`${l.w}x${l.h}`, l]))
  assert.equal(m.get('2x2').todos, 2)
  assert.equal(m.get('2x3').todos, 3)
  assert.equal(m.get('3x3').todos, 6)
  assert.equal(m.get('3x4').todos, 13)
  assert.equal(m.get('4x4').todos, 40)
  assert.equal(m.get('4x5').todos, 117)
  assert.equal(m.get('5x5').todos, 472)
  assert.equal(m.get('5x6').todos, 1916)
  assert.equal(m.get('6x6').todos, 10668)
})

test('nos pequenos, so os quadrados tem perfeito, e e o trivial', () => {
  for (const l of pequenos()) assert.equal(l.perfeitos, l.w === l.h ? 1 : 0, `${l.w}x${l.h}`)
})

test('a faixa 2 x n e Fibonacci nas 12 linhas', () => {
  const l = faixa2()
  assert.deepEqual(l.map((x) => x.medido), [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233])
  for (const x of l) assert.equal(x.medido, x.formula)
})

test('a faixa 3 x n e a recorrencia, inclusive nas duas linhas previstas', () => {
  const l = faixa3()
  assert.deepEqual(l.map((x) => x.medido), [1, 3, 6, 13, 28, 60, 129, 277, 595, 1278, 2745, 5896])
  for (const x of l) assert.equal(x.medido, x.formula)
  // As duas que eram previsao quando a recorrencia foi escrita.
  assert.equal(l[10].medido, 2745)
  assert.equal(l[11].medido, 5896)
})

test('horizonte e grade concordam em todas as linhas, com os mesmos nos', () => {
  for (const l of duelo()) {
    assert.equal(l.concordam, true)
    assert.equal(l.nosHorizonte, l.nosGrade)
  }
  assert.equal(duelo().find((l) => l.w === 6).nosHorizonte, 66822)
})
