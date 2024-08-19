import { plot } from "nodeplotlib";
import comments from "./comments.json" assert { type: "json" };

const likes = comments.map(({ likes }) => likes).sort((a, b) => a - b);

const data = [
  {
    x: likes.map((like, index) => index),
    y: likes,
    type: "scatter",
  },
];

plot(data);
