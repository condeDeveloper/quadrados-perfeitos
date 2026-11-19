# Quadrados perfeitos

Retângulos ladrilhados por quadrados, varridos por área crescente, em JavaScript puro, sem dependência nenhuma.

Cobrir um retângulo com quadrados é fácil: quadradinhos de lado 1 resolvem qualquer um. O problema começa quando se exige que **todos os quadrados tenham tamanhos diferentes**. O ladrilhamento é então **perfeito**, e a pergunta é qual o menor retângulo em que isso é possível.

**Página:** <https://condedeveloper.github.io/quadrados-perfeitos/>

---

## Os quatro achados

**1. O menor é o 32 × 33, e não existe menor.** Varrendo por área crescente, o primeiro retângulo não quadrado com ladrilhamento perfeito é o **32 × 33**, com nove quadrados de lados 1, 4, 7, 8, 9, 10, 14, 15 e 18. Foram **618** retângulos varridos antes dele — e é essa ordem que transforma "achei um" em "não há menor".

**2. Os quatro ladrilhamentos dele são um só.** O 32 × 33 tem 4 ladrilhamentos perfeitos, e as quatro imagens do retângulo (espelhos e meia-volta) os reduzem a **1**. Ele é **simples**: nenhum subconjunto dos quadrados forma um retângulo menor.

**3. As faixas estreitas têm fórmula.** A faixa 2 × n tem exatamente **Fibonacci** ladrilhamentos, medido de n=1 a 12. A faixa 3 × n segue `a(n) = a(n−1) + 2a(n−2) + a(n−3)`, uma recorrência lida na coluna medida e escrita antes de medir n=11 e n=12 — as duas previsões bateram, **2.745** e **5.896**. É conjectura minha, medida até aqui, e não teorema citado.

**4. A poda de lado repetido é a diferença entre terminar e não terminar.** Cortando o ramo assim que um lado se repete, o 32 × 33 fecha em **729.963** nós. Sem o corte, a busca passa de **30 milhões** de nós sem terminar.

---

## Como a busca funciona

Em vez de guardar o retângulo casa a casa, guardo a **linha de horizonte**: a altura já preenchida de cada coluna. O próximo quadrado entra sempre no vão mais baixo e mais à esquerda.

Isso não é heurística, é forçado: aquela casa precisa ser coberta por alguém, e quem a cobre tem o canto inferior esquerdo exatamente ali. Então a varredura não perde ladrilhamento nenhum e não repete nenhum — cada um aparece numa ordem só.

---

## As tabelas

Todos os números saem de `node ferramentas/medidor.js` e estão presos em `testes/`.

### Os retângulos pequenos

| retângulo | ladrilhamentos | perfeitos |
| --- | --- | --- |
| 2 × 2 | 2 | 1 |
| 2 × 3 | 3 | 0 |
| 3 × 3 | 6 | 1 |
| 3 × 4 | 13 | 0 |
| 4 × 4 | 40 | 1 |
| 4 × 5 | 117 | 0 |
| 5 × 5 | 472 | 1 |
| 5 × 6 | 1.916 | 0 |
| 6 × 6 | 10.668 | 1 |

Nos quadrados o único perfeito é o trivial: um quadrado só, do tamanho todo.

### As faixas

| n | 2 × n | Fibonacci | 3 × n | recorrência |
| --- | --- | --- | --- | --- |
| 1 | 1 | 1 | 1 | 1 |
| 2 | 2 | 2 | 3 | 3 |
| 3 | 3 | 3 | 6 | 6 |
| 4 | 5 | 5 | 13 | 13 |
| 5 | 8 | 8 | 28 | 28 |
| 6 | 13 | 13 | 60 | 60 |
| 7 | 21 | 21 | 129 | 129 |
| 8 | 34 | 34 | 277 | 277 |
| 9 | 55 | 55 | 595 | 595 |
| 10 | 89 | 89 | 1.278 | 1.278 |
| 11 | 144 | 144 | **2.745** | 2.745 |
| 12 | 233 | 233 | **5.896** | 5.896 |

As duas linhas em negrito da faixa 3 × n eram **previsão** quando a recorrência foi escrita.

### O 32 × 33

```
lados: 1, 4, 7, 8, 9, 10, 14, 15, 18
1² + 4² + 7² + 8² + 9² + 10² + 14² + 15² + 18² = 1.056 = 32 × 33
4 ladrilhamentos perfeitos, 1 a menos das imagens, simples
```

---

## Os juízes

**As fórmulas das faixas** são o juiz de verdade: Fibonacci e a recorrência de altura 3 não buscam nada, e conferem 24 contagens.

**A conferência de cada ladrilhamento** — a soma das áreas fecha, nada se sobrepõe, nada sai da borda — roda nos 472 ladrilhamentos do 5 × 5 e nos 4 do 32 × 33.

**O detector de composto** tem controle negativo: um 3 × 2 montado à mão com um quadrado 2 × 2 e dois 1 × 1 empilhados **tem** de ser acusado, e é.

**A grade casa a casa** refaz a contagem com outra representação — e aqui mora uma das correções abaixo.

---

## O que as medidas me corrigiram

**Meu detector de composto acusava o 32 × 33.** O exemplo clássico de ladrilhamento *simples* saía composto, nos quatro. O motivo: um quadrado sozinho já é um retângulo, e eu aceitava "subconjunto de um quadrado" como sub-retângulo. Todo ladrilhamento de dois ou mais quadrados virava composto. Foi a contradição com o resultado conhecido que pegou, e agora o subconjunto precisa ter pelo menos dois quadrados.

**Achei que a grade fosse um segundo juiz.** Ela concorda em todas as linhas — e abre **exatamente os mesmos nós**, até o último: 66.822 no 6 × 6. Isso quer dizer que ela não é outra busca, é a mesma árvore em outra roupa: a primeira casa vazia em ordem de leitura é o vão mais baixo e mais à esquerda. Um juiz que nunca discorda merece desconfiança, e este não discordava porque não podia. Os juízes que contam são as fórmulas.

**Apostei numa recorrência antes de medir, e acertei.** A coluna da faixa 3 × n parecia ter padrão aos 10 termos. Escrevi a recorrência, previ 2.745 e 5.896, e só então medi. A aposta escrita antes da medida é o que transforma o acerto em evidência e não em coincidência.

**Mandei varrer de 30 a 45 e não terminou.** Queria uma tabela maior de retângulos perfeitos e pedi todos os primitivos entre 30 e 45. Passou de dez minutos sem passar do segundo. A tabela do README para no 32 × 33, que é o que foi medido; o resto fica de fora em vez de entrar com número que eu sei de ler em outro lugar.

---

## Como rodar

Node 20 ou mais novo. Sem dependência.

```bash
npm test                               # a suite inteira
npm run medir                          # todas as tabelas
node ferramentas/medidor.js primeiro   # o 32 x 33, desenhado
node ferramentas/medidor.js faixas     # Fibonacci e a recorrencia
```

## Os arquivos

- `js/nucleo.js` — linha de horizonte, perfeito, composto, conferências.
- `js/busca.js` — a varredura dos ladrilhamentos e o primeiro perfeito por área.
- `js/juiz.js` — a grade casa a casa, as fórmulas das faixas e a forma canônica.
- `js/medidas.js` — as tabelas do README, cada uma calculada uma vez só.
- `js/app.js` — a página.
- `ferramentas/medidor.js` — imprime as tabelas.
- `testes/` — 26 testes, com os números do README presos.

## Licença

MIT.
