import { plot } from "nodeplotlib";
import comments from "./comments.json" assert { type: "json" };

// Transforma o vetor de comentários em um vetor de likes.
// Depois, ordena o vetor pela quantidade de likes
const likes = comments.map(({ likes }) => likes).sort((a, b) => a - b);

// Crie um gráfico de disperção
// O eixo x (largura) são os índices
// O eixo y (altura) são os likes
const data = [
  {
    x: likes.map((like, index) => index),
    y: likes,
    type: "scatter",
  },
];

// Abre no navegador o gráfico criado
plot(data);
