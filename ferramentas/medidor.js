#!/usr/bin/env node
// O medidor. Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js            todas
//   node ferramentas/medidor.js pequenos   ladrilhamentos dos retangulos pequenos
//   node ferramentas/medidor.js faixas     as faixas de altura 2 e 3 contra as formulas
//   node ferramentas/medidor.js primeiro   o menor retangulo perfeito
//   node ferramentas/medidor.js duelo      horizonte contra grade
//   node ferramentas/medidor.js poda       o que a poda de lado repetido vale

import { pequenos, faixa2, faixa3, primeiro, duelo, poda } from '../js/medidas.js'
import { desenha } from '../js/nucleo.js'

const n = (x) => x === null || x === undefined ? '-' : x.toLocaleString('pt-BR')
const pad = (s, w) => String(s).padStart(w)

function tPequenos () {
  console.log('\n== ladrilhamentos dos retangulos pequenos ==')
  for (const l of pequenos()) {
    console.log(`   ${pad(l.w + 'x' + l.h, 4)}  area ${pad(l.area, 2)}   ladrilhamentos ${pad(n(l.todos), 6)}   perfeitos ${l.perfeitos}`)
  }
  console.log('   Nos quadrados o unico perfeito e o trivial: um quadrado so, do tamanho todo.')
}

function tFaixas () {
  console.log('\n== a faixa 2 x n contra Fibonacci ==')
  console.log('   ' + faixa2().map((l) => `${l.medido}${l.medido === l.formula ? '' : '(!)'}`).join(', '))
  console.log('\n== a faixa 3 x n contra a recorrencia a(n) = a(n-1) + 2a(n-2) + a(n-3) ==')
  console.log('   ' + faixa3().map((l) => `${l.medido}${l.medido === l.formula ? '' : '(!)'}`).join(', '))
  console.log('   A recorrencia foi lida na coluna ate n=10 e escrita antes de medir n=11 e n=12.')
}

function tPrimeiro () {
  const p = primeiro()
  console.log('\n== o menor retangulo nao quadrado com ladrilhamento perfeito ==')
  console.log(`   ${p.w} x ${p.h}, area ${n(p.area)}, ordem ${p.ordem}`)
  console.log(`   lados: ${p.lados.join(', ')}   soma dos quadrados: ${n(p.somaDosQuadrados)}`)
  console.log(`   ${p.ladrilhamentos} ladrilhamentos perfeitos, ${p.distintos} distinto(s) a menos das 4 imagens, ${p.simples} simples`)
  console.log(`   ${p.retangulosVarridos} retangulos varridos antes, por area crescente`)
  console.log('')
  console.log(desenha(p.exemplo, p.w, p.h).split('\n').map((s) => '   ' + s).join('\n'))
}

function tDuelo () {
  console.log('\n== a linha de horizonte contra a grade casa a casa ==')
  for (const l of duelo()) {
    console.log(`   ${pad(l.w + 'x' + l.h, 4)}  horizonte ${pad(n(l.horizonte), 6)} (${pad(n(l.nosHorizonte), 6)} nos)   grade ${pad(n(l.grade), 6)} (${pad(n(l.nosGrade), 6)} nos)   ${l.concordam ? 'concordam' : 'DIVERGEM'}`)
  }
  console.log('   Os nos sao IGUAIS: a grade e outra representacao da mesma arvore, nao outra busca.')
}

function tPoda () {
  const r = poda()
  console.log('\n== o que a poda de lado repetido vale no 32 x 33 ==')
  console.log(`   com poda: ${n(r.nosComPoda)} nos`)
  console.log(`   sem poda: ${r.semPodaTerminou ? n(r.nosSemPoda) + ' nos' : 'passa de ' + n(r.teto) + ' nos sem terminar'}`)
}

const partes = { pequenos: tPequenos, faixas: tFaixas, primeiro: tPrimeiro, duelo: tDuelo, poda: tPoda }
const pedido = process.argv[2]
if (!pedido) for (const f of Object.values(partes)) f()
else if (partes[pedido]) partes[pedido]()
else { console.error(`nao conheco "${pedido}". conheco: ${Object.keys(partes).join(', ')}`); process.exit(1) }
