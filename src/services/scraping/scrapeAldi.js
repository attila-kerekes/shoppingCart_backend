const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");


// Scrape categories
async function scrapeCategories(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  try {
    await page.waitForSelector('.category-page-sidebar-categories', { timeout: 30000 });

    const categories = await page.evaluate(() => {
      const categoriesObj = {};

      const mainCategoryElements = document.querySelectorAll('.category-page-sidebar-category');

      mainCategoryElements.forEach((mainCategoryEl) => {
        const mainCategoryName = mainCategoryEl.querySelector('.category-page-sidebar-category-link').innerText.trim();
        categoriesObj[mainCategoryName] = [];

        const subCategoryElements = mainCategoryEl.querySelectorAll('.category-page-sidebar-subcategory');
        subCategoryElements.forEach((subCategoryEl) => {
          const subCategoryName = subCategoryEl.querySelector('.category-page-sidebar-subcategory-link').innerText.trim();
          categoriesObj[mainCategoryName].push(subCategoryName);
        });
      });

      return categoriesObj;
    });

    console.log(categories);

  } catch (error) {
    console.error('Error scraping categories:', error);
  } finally {
    await browser.close();
  }
}

scrapeCategories('https://shop.aldi.hu/kezdooldal');



function delay(time) {
  return new Promise(function(resolve) { 
    setTimeout(resolve, time);
  });
}

// Scrape products
async function scrapeProducts(url, mainCategory, subCategory) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Wait for the main categories to be loaded and displayed
    await page.waitForSelector('ul.category-page-sidebar-categories', { timeout: 30000 });

    // Click on the main category
    await page.evaluate((mainCategory) => {
      const mainCategoryElement = Array.from(document.querySelectorAll('ul.category-page-sidebar-categories > li.category-page-sidebar-category a.category-page-sidebar-category-link'))
        .find(el => el.innerText.trim() === mainCategory);
      if (mainCategoryElement) mainCategoryElement.click();
    }, mainCategory);

    // Wait for subcategories to be loaded and displayed
    await page.waitForSelector('ul.accordion-body', { timeout: 30000 });

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
      await delay(2000);
      const newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === previousHeight) {
        break;
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

//scrapeProducts('https://shop.aldi.hu/kezdooldal', 'Tejtermék, tojás', 'Tojás')
