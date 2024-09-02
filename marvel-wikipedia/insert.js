import { PrismaClient } from "@prisma/client";
import dados from "./dados.json" assert { type: "json" };

const prisma = new PrismaClient();

init();

async function init() {
  await prisma.characters.createMany({
    data: dados.map(({ char, summary }) => ({ char_name: char, summary })),
  });
}
