import jsdom from "jsdom";
import fs from "fs";
const { JSDOM } = jsdom;

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

async function init() {
  const response = await fetch(
    "https://myanimelist.net/anime/21/One_Piece/reviews"
  );
  const html = await response.text();
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const comments = document.querySelectorAll(".review-element");
  //data, texto, username, likes

  let commentsList = [];
  for (const comment of comments) {
    const username = comment.querySelector(".username").textContent.trim();
    const text = comment.querySelector(".text").textContent.trim();
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

  fs.writeFileSync("comments.json", JSON.stringify(commentsList, null, 2));
}

init();
