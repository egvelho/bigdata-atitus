import puppeteer from "puppeteer";
import fs from "fs";

// Inicia uma instânci do puppeteer
const browser = await puppeteer.launch({
  headless: false, // Essa flag indica que a janela do chrome deve ficar visível
});

// Abre uma nova aba
const page = await browser.newPage();

// Faz a aba navegar para o endereço
await page.goto("https://www.youtube.com/watch?v=SGcstfDJNLY");
// Define o tamanho da janela
await page.setViewport({ width: 1366, height: 768 });
// Espera a página terminar de carregar
await page.waitForNavigation();

// Rola a página até o final para carregar os comentários
await page.evaluate(() => window.scrollBy(0, window.innerHeight));

// Espera os comentários carregarem para continuar (quanto existir algum elemento com essa classe)
await page.waitForSelector(".ytd-comment-view-model");

// Pega o HTML da página
// Todos os comandos que acessam o DOM precisam estar dentro da função page.evaluate
const body = await page.evaluate(() => document.body.innerHTML);

// Fecha o navegador
await browser.close();

// Escreve o HTML da página no arquivo body.html
fs.writeFileSync("body.html", body);
