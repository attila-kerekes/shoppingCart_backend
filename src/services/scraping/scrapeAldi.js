const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

/*
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
*/

/*
async function scrapeCategories(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait for the categories to be loaded and displayed
  await page.waitForSelector('ul#accordionExample');

  // Extract the text of the categories
  const categories = await page.evaluate(() => {
    // Select all category elements within the ul with id "accordionExample"
    const categoryElements = document.querySelectorAll('ul#accordionExample li');

    // Extract the text content of each category element
    const categoryTexts = Array.from(categoryElements).map(el => {
      // Ensure the element is an HTMLElement to access innerText
      return el instanceof HTMLElement ? el.innerText.trim() : '';
    });

    return categoryTexts;
  });

  console.log(categories);

  await browser.close();
}

scrapeCategories('https://shop.aldi.hu/kezdooldal');
*/

function delay(time) {
  return new Promise(function(resolve) { 
    setTimeout(resolve, time);
  });
}


async function scrapeCategories(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Wait for the categories to be loaded and displayed
  await page.waitForSelector('ul#accordionExample', { timeout: 20000 });

  // Extract the text of the categories
  const categories = await page.evaluate(() => {
    const categoriesObj = {};

    // Select all main category elements
    const mainCategoryElements = document.querySelectorAll('ul#accordionExample > li.category-page-sidebar-category');

    mainCategoryElements.forEach((mainCategoryEl) => {
      // Get the main category name
      const mainCategoryName = mainCategoryEl.querySelector('a.category-page-sidebar-category-link').innerText.trim();

      // Initialize the main category in the object
      categoriesObj[mainCategoryName] = [];

      // Get subcategory elements within this main category
      const subCategoryElements = mainCategoryEl.querySelectorAll('ul.accordion-body > li.category-page-sidebar-subcategory');

      subCategoryElements.forEach((subCategoryEl) => {
        // Get the subcategory name
        const subCategoryName = subCategoryEl.querySelector('a.category-page-sidebar-subcategory-link').innerText.trim();

        // Add subcategory name to the main category
        categoriesObj[mainCategoryName].push(subCategoryName);
      });
    });

    return categoriesObj;
  });

  console.log(categories);

  await browser.close();
}

scrapeCategories('https://shop.aldi.hu/kezdooldal');


async function scrapeProducts(url, mainCategory, subCategory) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for the main categories to be loaded and displayed
    await page.waitForSelector('ul#accordionExample', { timeout: 15000 });

    // Click on the main category
    await page.evaluate((mainCategory) => {
      const mainCategoryElement = Array.from(document.querySelectorAll('ul#accordionExample > li.category-page-sidebar-category a.category-page-sidebar-category-link'))
        .find(el => el.innerText.trim() === mainCategory);
      if (mainCategoryElement) mainCategoryElement.click();
    }, mainCategory);

    // Wait for subcategories to be loaded and displayed
    await page.waitForSelector('ul.accordion-body', { timeout: 15000 });

    // Click on the subcategory
    await page.evaluate((subCategory) => {
      const subCategoryElement = Array.from(document.querySelectorAll('ul.accordion-body > li.category-page-sidebar-subcategory a.category-page-sidebar-subcategory-link'))
        .find(el => el.innerText.trim() === subCategory);
      if (subCategoryElement) subCategoryElement.click();
    }, subCategory);

    // Wait for the products to be loaded and displayed
    await page.waitForSelector('.products-list-container', { timeout: 50000 });

    // Function to scroll to the bottom of the page
    async function autoScroll(page) {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }

    // Scroll to the bottom and load all products
    let previousHeight;
    while (true) {
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await autoScroll(page);
      await delay(2000); // Wait for 2 seconds to load new products
      const newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === previousHeight) {
        break; // Exit the loop if no new products are loaded
      }
    }

    // Extract product details
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.products-list-container .product-list > .ng-star-inserted');
      const productDetails = Array.from(productElements).map(productEl => {
        const productName = productEl.querySelector('[itemprop="name"]')?.innerText.trim() || '';
        const productPrice = productEl.querySelector('[itemprop="price"]')?.innerText.trim() || '';
        const imgUrl = productEl.querySelector('img[itemprop="image"]')?.src || '';

        return { name: productName, price: productPrice, imgUrl: imgUrl };
      });
      return productDetails;
    });

    console.log(products);
    console.log(products.length);

  } catch (error) {
    console.error('Error scraping products:', error);
  } finally {
    await browser.close();
  }
}

scrapeProducts('https://shop.aldi.hu/kezdooldal', 'Tejtermék, tojás', 'Tej')
