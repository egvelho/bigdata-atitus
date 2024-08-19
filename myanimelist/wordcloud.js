import { createCanvas } from "canvas";
import wc from "node-wordcloud";
import fs from "fs";
import comments from "./comments.json" assert { type: "json" };
import stopwords from "./stopwords.json" assert { type: "json" };

const WordCloud = wc();
const texts = Object.entries(
  comments
    .map((comment) => comment.text)
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
).filter(([, count]) => count > 2);

const canvas = createCanvas(500, 500);

const wordcloud = WordCloud(canvas, { list: texts });

wordcloud.draw();
const buffer = canvas.toBuffer();
fs.writeFileSync("wordcloud.png", buffer);
