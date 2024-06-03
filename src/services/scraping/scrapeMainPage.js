const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");


async function scrapeHTML(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Get the entire HTML content
  const html = await page.content();

  // Save the HTML content to a file
  const filePath = path.join(__dirname, "page.html");
  fs.writeFileSync(filePath, html);

  console.log(`HTML content saved to ${filePath}`);
  await browser.close();
}

scrapeHTML('https://shop.aldi.hu/kezdooldal');
