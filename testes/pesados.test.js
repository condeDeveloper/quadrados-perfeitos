// Os casos caros: o 32x33 e a poda medida nele.

import test from 'node:test'
import assert from 'node:assert/strict'

import { primeiro, poda } from '../js/medidas.js'

test('o menor retangulo perfeito e o 32x33, de ordem 9', { timeout: 300000 }, () => {
  const p = primeiro()
  assert.equal(p.w, 32)
  assert.equal(p.h, 33)
  assert.equal(p.area, 1056)
  assert.equal(p.ordem, 9)
  assert.deepEqual(p.lados, [1, 4, 7, 8, 9, 10, 14, 15, 18])
  assert.equal(p.somaDosQuadrados, 1056)
  assert.equal(p.retangulosVarridos, 618)
})

test('o 32x33 tem 4 ladrilhamentos perfeitos, que sao 1 so a menos das imagens', { timeout: 300000 }, () => {
  const p = primeiro()
  assert.equal(p.ladrilhamentos, 4)
  assert.equal(p.distintos, 1)
  assert.equal(p.simples, 4)
  assert.equal(p.conferidos, 4)
})

test('sem a poda de lado repetido o 32x33 nao termina em 30 milhoes de nos', { timeout: 600000 }, () => {
  const r = poda()
  assert.equal(r.nosComPoda, 729963)
  assert.equal(r.semPodaTerminou, false)
  assert.ok(r.nosSemPoda > 30_000_000)
  assert.ok(r.nosSemPoda / r.nosComPoda > 41)
})
