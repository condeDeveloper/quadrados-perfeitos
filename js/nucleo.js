// Retangulos ladrilhados por quadrados.
//
// Um ladrilhamento de um retangulo w x h por quadrados e uma lista de quadrados
// que cobrem o retangulo inteiro sem sobrar nem sobrepor. Ele e:
//
//   PERFEITO  quando todos os quadrados tem tamanhos DIFERENTES entre si;
//   SIMPLES   quando nenhum subconjunto proprio dos quadrados forma por conta
//             propria um retangulo (um ladrilhamento composto e dois
//             ladrilhamentos menores colados, e nao conta como descoberta).
//
// A ORDEM do ladrilhamento e quantos quadrados ele usa.
//
// A busca e por LINHA DE HORIZONTE. Em vez de guardar o retangulo casa a casa,
// guardo a altura ja preenchida de cada coluna. O proximo quadrado entra
// sempre no vao mais baixo e mais a esquerda — e isso nao e heuristica, e
// forcado: aquela casa precisa ser coberta por alguem, e quem a cobre tem de ter
// o canto inferior esquerdo ali. Entao a varredura nao perde ladrilhamento
// nenhum, e nao repete nenhum: cada um aparece numa ordem so.

/** Um retangulo vazio: a linha de horizonte comeca toda em zero. */
export function vazio (largura) {
  return new Int32Array(largura)
}

/**
 * O vao mais baixo e mais a esquerda: devolve [coluna, largura do vao, altura].
 *
 * A largura do vao e quantas colunas seguidas tem a MESMA altura minima: e o
 * maior quadrado que cabe ali em largura.
 */
export function vao (horizonte) {
  let menor = Infinity
  let coluna = -1
  for (let c = 0; c < horizonte.length; c++) {
    if (horizonte[c] < menor) { menor = horizonte[c]; coluna = c }
  }
  if (coluna === -1) return null
  let larguraDoVao = 0
  for (let c = coluna; c < horizonte.length && horizonte[c] === menor; c++) larguraDoVao++
  return { coluna, largura: larguraDoVao, altura: menor }
}

/** O retangulo esta cheio? */
export function cheio (horizonte, altura) {
  for (let c = 0; c < horizonte.length; c++) if (horizonte[c] !== altura) return false
  return true
}

/** Poe um quadrado de lado `lado` na coluna `coluna`. Devolve o horizonte NOVO. */
export function poe (horizonte, coluna, lado) {
  const novo = Int32Array.from(horizonte)
  const base = horizonte[coluna]
  for (let c = coluna; c < coluna + lado; c++) novo[c] = base + lado
  return novo
}

/** Os tamanhos sao todos diferentes? */
export function ehPerfeito (lados) {
  return new Set(lados).size === lados.length
}

/**
 * O ladrilhamento e COMPOSTO: algum subconjunto proprio forma um retangulo?
 *
 * Procuro um retangulo interno alinhado: um par de linhas e um par de colunas
 * tais que todo quadrado ou esta inteiro dentro ou inteiro fora, e o que esta
 * dentro cobre a area toda. Um ladrilhamento composto e dois menores colados, e
 * a literatura so conta os SIMPLES como descoberta.
 */
export function ehComposto (quadrados, largura, altura) {
  const n = quadrados.length
  if (n < 2) return false
  // Os cortes possiveis sao as bordas dos quadrados.
  const xs = new Set([0, largura])
  const ys = new Set([0, altura])
  for (const q of quadrados) { xs.add(q.x); xs.add(q.x + q.lado); ys.add(q.y); ys.add(q.y + q.lado) }
  const listaX = [...xs].sort((a, b) => a - b)
  const listaY = [...ys].sort((a, b) => a - b)
  for (const x1 of listaX) {
    for (const x2 of listaX) {
      if (x2 <= x1) continue
      for (const y1 of listaY) {
        for (const y2 of listaY) {
          if (y2 <= y1) continue
          if (x1 === 0 && y1 === 0 && x2 === largura && y2 === altura) continue
          let area = 0
          let quantos = 0
          let partido = false
          for (const q of quadrados) {
            const dentro = q.x >= x1 && q.y >= y1 && q.x + q.lado <= x2 && q.y + q.lado <= y2
            const fora = q.x + q.lado <= x1 || q.x >= x2 || q.y + q.lado <= y1 || q.y >= y2
            if (dentro) { area += q.lado * q.lado; quantos++ } else if (!fora) { partido = true; break }
          }
          if (partido) continue
          // `quantos >= 2` nao e detalhe: UM quadrado sozinho ja e um
          // retangulo, entao com `quantos > 0` todo ladrilhamento de dois ou
          // mais quadrados virava "composto". A primeira versao acusava os
          // quatro ladrilhamentos do 32x33, que sao o exemplo classico de
          // SIMPLES — foi a contradicao com o resultado conhecido que pegou.
          if (quantos >= 2 && quantos < n && area === (x2 - x1) * (y2 - y1)) return true
        }
      }
    }
  }
  return false
}

/** A area tem de fechar: a soma dos quadrados e a area do retangulo. */
export function areaFecha (quadrados, largura, altura) {
  let soma = 0
  for (const q of quadrados) soma += q.lado * q.lado
  return soma === largura * altura
}

/** Nenhum par de quadrados se sobrepoe? */
export function semSobreposicao (quadrados) {
  for (let i = 0; i < quadrados.length; i++) {
    for (let j = i + 1; j < quadrados.length; j++) {
      const a = quadrados[i]
      const b = quadrados[j]
      const separados = a.x + a.lado <= b.x || b.x + b.lado <= a.x ||
                        a.y + a.lado <= b.y || b.y + b.lado <= a.y
      if (!separados) return false
    }
  }
  return true
}

/** Desenha o ladrilhamento em texto, uma letra por quadrado. */
export function desenha (quadrados, largura, altura) {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const tela = Array.from({ length: altura }, () => new Array(largura).fill('.'))
  quadrados.forEach((q, i) => {
    for (let y = q.y; y < q.y + q.lado; y++) {
      for (let x = q.x; x < q.x + q.lado; x++) tela[y][x] = letras[i % letras.length]
    }
  })
  return tela.map((l) => l.join('')).join('\n')
}

/** O maior divisor comum, para dizer se o retangulo e primitivo. */
export function mdc (a, b) {
  while (b) { const t = a % b; a = b; b = t }
  return a
}

/**
 * O retangulo e PRIMITIVO quando largura e altura sao primos entre si.
 *
 * Um ladrilhamento de 2w x 2h e o de w x h com tudo dobrado, entao so os
 * primitivos trazem informacao nova. A tabela mostra os dois para nao esconder
 * de onde vem a contagem.
 */
export function ehPrimitivo (largura, altura) {
  return mdc(largura, altura) === 1
}
