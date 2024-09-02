import { PrismaClient } from "@prisma/client";
import dados from "./dados.json" assert { type: "json" };
import { createCanvas } from "canvas";
import wc from "node-wordcloud";
import fs from "fs";
import stopwords from "./stopwords.json" assert { type: "json" };

const prisma = new PrismaClient();

init();

async function init() {
  const chars = await prisma.characters.findMany();

  const WordCloud = wc();
  const texts = Object.entries(
    chars
      .map((char) => char.summary)
      .join("\n")
      .toLowerCase()
      .split(/\n| /)
      .map((word) => word.replace(/[^a-z0-9]/gi, ""))
      .filter((word) => !stopwords.includes(word))
      .filter((word) => !/^\d+$/.test(word))
      .reduce((s, i) => {
        s[i] = (s[i] ?? 0) + 1;
        return s;
      }, {})
  ).filter(([, count]) => count > 0);

  const canvas = createCanvas(2000, 2000);

  const wordcloud = WordCloud(canvas, { list: texts });

  wordcloud.draw();
  const buffer = canvas.toBuffer();
  fs.writeFileSync("wordcloud.png", buffer);
}
