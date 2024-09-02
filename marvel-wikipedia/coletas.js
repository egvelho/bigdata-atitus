import slugify from "slugify";
import marvel from "./marvel.json" assert { type: "json" };
import fs from "fs";

const slugs = marvel.map((char) => slugify(char, "_"));

coletas();

async function coletas() {
  let dados = [];
  for (const index in slugs) {
    const slug = slugs[index];
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`
    );
    const responseJson = await response.json();

    if (responseJson.extract) {
      console.log(slug);
      dados.push({
        char: marvel[index],
        summary: responseJson.extract,
      });
    }
  }

  fs.writeFileSync("dados.json", JSON.stringify(dados, null, 2));
}
