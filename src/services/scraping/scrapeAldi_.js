import puppeteer from 'puppeteer';

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}


// Scrape categories
async function scrapeCategories(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  await delay(20000);

  try {
    await page.waitForSelector('#accordionExample', { timeout: 30000 });
    console.log('Accordion example selector found');

    const categories = await page.evaluate(() => {
      const categoriesObj = {};
      const mainCategoryElements = document.querySelectorAll('ul#accordionExample > li.category-page-sidebar-category');

      console.log('Found main categories:', mainCategoryElements.length);
      
      mainCategoryElements.forEach((mainCategoryEl) => {
        const mainCategoryLink = mainCategoryEl.querySelector('a.category-page-sidebar-category-link');
        if (!mainCategoryLink) {
          console.error('Main category link not found');
          return;
        }

        const mainCategoryName = mainCategoryLink.innerText.trim();
        console.log('Main category name:', mainCategoryName);
        categoriesObj[mainCategoryName] = [];

        const subCategoryElements = mainCategoryEl.querySelectorAll('ul.accordion-body > li.category-page-sidebar-subcategory');
        console.log('Found subcategories:', subCategoryElements.length, 'for main category:', mainCategoryName);

        subCategoryElements.forEach((subCategoryEl) => {
          const subCategoryLink = subCategoryEl.querySelector('a.category-page-sidebar-subcategory-link');
          if (!subCategoryLink) {
            console.error('Subcategory link not found');
            return;
          }

          const subCategoryName = subCategoryLink.innerText.trim();
          console.log('Subcategory name:', subCategoryName);
          categoriesObj[mainCategoryName].push(subCategoryName);
        });
      });

      console.log('Categories object constructed:', categoriesObj);
      return categoriesObj;
    });

    console.log('Categories:', categories);

  } catch (error) {
    console.error('Error scraping categories:', error);
  } finally {
    await browser.close();
  }
}

//scrapeCategories('https://shop.aldi.hu/kezdooldal');


// Scrape products
async function scrapeProducts(url, mainCategory, subCategory) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await delay(20000);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('#accordionExample', { timeout: 30000 });
    console.log('Accordion example selector found');

    // Click on the main category
    await page.evaluate((mainCategory) => {
      const mainCategoryElement = Array.from(document.querySelectorAll('ul#accordionExample > li.category-page-sidebar-category a.category-page-sidebar-category-link'))
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

scrapeProducts('https://shop.aldi.hu/kezdooldal', 'Tejtermék, tojás', 'Tej')

module.exports = {
  scrapeCategories,
  scrapeProducts
};
