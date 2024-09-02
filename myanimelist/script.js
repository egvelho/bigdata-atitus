import jsdom from "jsdom";
import fs from "fs";
// JSDOM é uma biblioteca que serve para acessar o DOM de um documento HTML no Node
// Sem precisar de um navegador
const { JSDOM } = jsdom;

// Objeto que mapeia os meses para seus respectivos números (0-11)
const mapMonthToIndex = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

// Aqui é necessário criar uma função assíncrona
// Pois await só pode ser utilizado dentro de uma função async
async function init() {
  // Faz uma requisição HTTP para carregar a página
  // response é o objeto de resposta da requisição
  const response = await fetch(
    "https://myanimelist.net/anime/21/One_Piece/reviews"
  );

  // Aqui selecionamos somente o HTML carregado, como uma string
  const html = await response.text();
  // Inicia o JSDOM passando o HTML carregado
  const dom = new JSDOM(html);
  // Guarda o o objeto document em uma variável (para não precisar ficar repetindo código)
  const document = dom.window.document;
  // Seleciona todos os comentários pelo seletor em questão
  const comments = document.querySelectorAll(".review-element");

  // A estrutura de dados a seguir posui data, texto, username, likes

  // Aqui manipulamos o DOM para extrair as informações dos comentários
  // commentsList é um vetor de objetos
  let commentsList = [];
  for (const comment of comments) {
    // trim elimina os espaços do início e final da string, para eliminar sujeiras
    const username = comment.querySelector(".username").textContent.trim();
    const text = comment.querySelector(".text").textContent.trim();
    // textContent pega somente o texto interno de um elemento
    const updatedAt = comment.querySelector(".update_at").textContent;
    const updatedAtParts = updatedAt.split(" ");
    const month = mapMonthToIndex[updatedAtParts[0]];
    const day = +updatedAtParts[1].replace(",", "");
    const year = +updatedAtParts[2];
    const createdAt = new Date(year, month, day);
    const likes = +comment.querySelector(".num").textContent;
    const commentItem = {
      username,
      text,
      createdAt,
      likes,
    };
    commentsList.push(commentItem);
  }

  // Guardamos o vetor de objetos com as infos dos comentários no arquivo comments.json
  // JSON.stringify serve para serializar o objeto como uma string JSON
  // null é para pular o objeto de configuração
  // 2 é a identação do arquivo (2 espaços)
  fs.writeFileSync("comments.json", JSON.stringify(commentsList, null, 2));
}

// Inicializa a função assíncrona logo depois de invocá-la
init();
