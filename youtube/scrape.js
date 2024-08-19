import puppeteer from "puppeteer";
import fs from "fs";

const browser = await puppeteer.launch({
  headless: false,
});
const page = await browser.newPage();

await page.goto("https://www.youtube.com/watch?v=SGcstfDJNLY");
await page.setViewport({ width: 1366, height: 768 });
await page.waitForNavigation();

await page.evaluate(() => window.scrollBy(0, window.innerHeight));

await page.waitForSelector(".ytd-comment-view-model");

const body = await page.evaluate(() => document.body.innerHTML);

await browser.close();

fs.writeFileSync("body.html", body);
