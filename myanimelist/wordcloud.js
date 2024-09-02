// Canvas é uma biblioteca para criar um "quadro" de pixels
import { createCanvas } from "canvas";
import wc from "node-wordcloud";
import fs from "fs";
import comments from "./comments.json" assert { type: "json" };
// Carrega o dicionário de stopwords
// Stopwords são palavras recorrentes que só prejudicam a análise
// Um dicionário de stopwords é uma lista dessas palavras
import stopwords from "./stopwords.json" assert { type: "json" };

// Pega uma instância do programa para gerar a nuvem de palavras
const WordCloud = wc();
// Aqui transformamos o vetor de comentários em um vetor de tuplas
// Cada tupla possui uma palavra e sua frequência. Exemplo: ["hunter", 30]
const texts = Object.entries(
  // Transforma o objeto em um vetor de tuplas
  comments
    .map((comment) => comment.text) // Transforma o vetor de comentários em um vetor somente com os textos dos comentários
    .join("\n") // Junta todos os textos em uma grande string
    .toLowerCase() // Converte todo o texto para minúsculas
    .split(/\n| /) // Divide o texto em um vetor de palavras, quebrando o texto nas quebras de linha e espaços
    .map((word) => word.replace(/[^a-z0-9]/gi, "")) // Remove todos os caracteres das palavras que NÃO SEJAM letras e números
    .filter((word) => !stopwords.includes(word)) // Realiza a remoção de stopwords
    .filter((word) => !/^\d+$/.test(word)) // Remove todas as palavras que sejam somente números
    // Calcula a frequência das palavras, criando um objeto no formato { "hunter": 30, "analysis": 15 }
    .reduce((s, i) => {
      s[i] = (s[i] ?? 0) + 1;
      return s;
    }, {})
).filter(([, count]) => count > 2); // Seleciona somente as palavras cuja frequência seja maior do que dois

// Cria um canvas 500x500px
const canvas = createCanvas(500, 500);

// Cria a nuvem de palavras
const wordcloud = WordCloud(canvas, { list: texts });

// Plota a nuvem de palavras no canvas
wordcloud.draw();
// Buferiza o canvas (guarda ele na memória em um formato que pode ser passado para um arquivo)
const buffer = canvas.toBuffer();
// Salva a nuvem de palavras como uma imagem PNG
fs.writeFileSync("wordcloud.png", buffer);
