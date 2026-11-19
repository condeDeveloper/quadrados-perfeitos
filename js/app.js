// A pagina: o retangulo desenhado, os ladrilhamentos um por um.

import { ladrilhamentos } from './busca.js'

const elW = document.getElementById('largura')
const elH = document.getElementById('altura')
const elDesenho = document.getElementById('desenho')
const elTexto = document.getElementById('texto')
const elPerfeitos = document.getElementById('soPerfeitos')

const CORES = ['#a52a45', '#4ec9a8', '#e0b64a', '#6f8ddb', '#c77dd6', '#d4536f', '#7fb069', '#e07a5f', '#81b29a', '#f2cc8f']

let lista = []
let indice = 0
let w = 0
let h = 0

function varre () {
  w = Number(elW.value)
  h = Number(elH.value)
  const so = elPerfeitos.checked
  elTexto.textContent = 'varrendo...'
  setTimeout(() => {
    const antes = performance.now()
    const r = ladrilhamentos(w, h, { soPerfeitos: so, guardarAte: 500, teto: 5_000_000 })
    const ms = Math.round(performance.now() - antes)
    lista = r.exemplos
    indice = 0
    if (!r.completa) {
      elTexto.textContent = `Passou de 5 milhoes de nos sem terminar. Marque "so perfeitos" ou escolha um retangulo menor.`
      elDesenho.innerHTML = ''
      return
    }
    desenha(`${r.quantos.toLocaleString('pt-BR')} ladrilhamento${r.quantos === 1 ? '' : 's'}${so ? ' perfeito' + (r.quantos === 1 ? '' : 's') : ''} de ${w} x ${h}, em ${ms} ms.`)
  }, 10)
}

function desenha (nota) {
  if (lista.length === 0) {
    elDesenho.innerHTML = ''
    elTexto.textContent = `${nota} Nenhum para desenhar.`
    return
  }
  const q = lista[indice]
  const escala = Math.max(4, Math.floor(420 / Math.max(w, h)))
  const partes = q.map((s, i) => {
    const cor = CORES[i % CORES.length]
    const x = s.x * escala
    const y = (h - s.y - s.lado) * escala
    const t = s.lado * escala
    const rotulo = t >= 18 ? `<text x="${x + t / 2}" y="${y + t / 2 + 5}" text-anchor="middle" fill="#14101c" font-size="${Math.min(16, t / 2)}">${s.lado}</text>` : ''
    return `<rect x="${x}" y="${y}" width="${t}" height="${t}" fill="${cor}" stroke="#14101c" stroke-width="1.5"/>${rotulo}`
  })
  elDesenho.innerHTML = `<svg viewBox="0 0 ${w * escala} ${h * escala}" width="${w * escala}" height="${h * escala}" role="img" aria-label="retangulo ladrilhado">${partes.join('')}</svg>`
  const lados = q.map((s) => s.lado).sort((a, b) => a - b)
  elTexto.innerHTML = `${nota}<br>Mostrando ${indice + 1} de ${lista.length}${lista.length === 500 ? ' (os primeiros 500)' : ''}: ${q.length} quadrados, lados ${lados.join(', ')}.`
}

document.getElementById('varrer').addEventListener('click', varre)
document.getElementById('proximo').addEventListener('click', () => {
  if (!lista.length) return
  indice = (indice + 1) % lista.length
  desenha('')
})
document.getElementById('classico').addEventListener('click', () => {
  elW.value = '33'
  elH.value = '32'
  elPerfeitos.checked = true
  varre()
})

varre()
