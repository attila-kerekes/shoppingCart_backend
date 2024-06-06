import puppeteer from 'puppeteer';
import type { Page } from 'puppeteer';

// Define delay function
function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

/*

export async function scrapeCategories(url: string): Promise<Record<string, string[]>> {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  await delay(20000);

  try {
    await page.waitForSelector('#accordionExample', { timeout: 30000 });
    console.log('Accordion example selector found');

    const categories = await page.evaluate(() => {
      const categoriesObj: Record<string, string[]> = {};
      const mainCategoryElements = document.querySelectorAll('ul#accordionExample > li.category-page-sidebar-category');

      console.log('Found main categories:', mainCategoryElements.length);

      mainCategoryElements.forEach((mainCategoryEl) => {
        const mainCategoryLink = mainCategoryEl.querySelector('a.category-page-sidebar-category-link');
        if (!mainCategoryLink) {
          console.error('Main category link not found');
          return;
        }

        const mainCategoryName = (mainCategoryLink as HTMLElement).innerText.trim();
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

          const subCategoryName = (subCategoryLink as HTMLElement).innerText.trim();
          console.log('Subcategory name:', subCategoryName);
          categoriesObj[mainCategoryName].push(subCategoryName);
        });
      });

      console.log('Categories object constructed:', categoriesObj);
      return categoriesObj;
    });

    console.log('Categories:', categories);
    return categories;
  } catch (error) {
    console.error('Error scraping categories:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

scrapeCategories('https://shop.aldi.hu/kezdooldal');

export async function scrapeProducts(url: string, mainCategory: string, subCategory: string): Promise<{ name: string; price: string; imgUrl: string }[]> {
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
        .find(el => (el as HTMLElement).innerText.trim() === mainCategory);
      if (mainCategoryElement) (mainCategoryElement as HTMLElement).click();
    }, mainCategory);

    // Wait for subcategories to be loaded and displayed
    await page.waitForSelector('ul.accordion-body', { timeout: 30000 });

    // Click on the subcategory
    await page.evaluate((subCategory) => {
      const subCategoryElement = Array.from(document.querySelectorAll('ul.accordion-body > li.category-page-sidebar-subcategory a.category-page-sidebar-subcategory-link'))
        .find(el => (el as HTMLElement).innerText.trim() === subCategory);
      if (subCategoryElement) (subCategoryElement as HTMLElement).click();
    }, subCategory);

    // Wait for the products to be loaded and displayed
    await page.waitForSelector('.products-list-container', { timeout: 50000 });

    // Function to scroll to the bottom of the page
    async function autoScroll(page: Page) {
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
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
        const productName = (productEl.querySelector('[itemprop="name"]') as HTMLElement)?.innerText.trim() || '';
        const productPrice = (productEl.querySelector('[itemprop="price"]') as HTMLElement)?.innerText.trim() || '';
        const imgUrl = (productEl.querySelector('img[itemprop="image"]') as HTMLImageElement)?.src || '';

        return { name: productName, price: productPrice, imgUrl: imgUrl };
      });
      return productDetails;
    });

    console.log(products);
    return products;
  } catch (error) {
    console.error('Error scraping products:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

scrapeProducts('https://shop.aldi.hu/kezdooldal', 'Tejtermék, tojás', 'Tej')
*/


export async function scrapeCategories(url: string) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  await delay(20000);

  try {
    await page.waitForSelector('#accordionExample', { timeout: 30000 });
    console.log('Accordion example selector found');

    const categories = await page.evaluate(() => {
      const categoriesObj: Record<string, string[]> = {};
      const mainCategoryElements = document.querySelectorAll('ul#accordionExample > li.category-page-sidebar-category');

      mainCategoryElements.forEach((mainCategoryEl) => {
        const mainCategoryLink = mainCategoryEl.querySelector('a.category-page-sidebar-category-link');
        if (!mainCategoryLink) return;

        const mainCategoryName = (mainCategoryLink as HTMLElement).innerText.trim();
        categoriesObj[mainCategoryName] = [];

        const subCategoryElements = mainCategoryEl.querySelectorAll('ul.accordion-body > li.category-page-sidebar-subcategory');
        subCategoryElements.forEach((subCategoryEl) => {
          const subCategoryLink = subCategoryEl.querySelector('a.category-page-sidebar-subcategory-link');
          if (!subCategoryLink) return;

          const subCategoryName = (subCategoryLink as HTMLElement).innerText.trim();
          categoriesObj[mainCategoryName].push(subCategoryName);
        });
      });

      return categoriesObj;
    });

    console.log('Categories:', categories);
    return categories;

  } catch (error) {
    console.error('Error scraping categories:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export async function scrapeProducts(url: string, mainCategory: string, subCategory: string) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await delay(30000);

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('#accordionExample', { timeout: 30000 });
    console.log('Accordion example selector found');

    // Click on the main category
    await page.evaluate((mainCategory) => {
      const mainCategoryElement = Array.from(document.querySelectorAll('ul#accordionExample > li.category-page-sidebar-category a.category-page-sidebar-category-link'))
        .find(el => (el as HTMLElement).innerText.trim() === mainCategory);
      if (mainCategoryElement) (mainCategoryElement as HTMLElement).click();
    }, mainCategory);

    // Wait for subcategories to be loaded and displayed
    await page.waitForSelector('ul.accordion-body', { timeout: 30000 });

    // Click on the subcategory
    await page.evaluate((subCategory) => {
      const subCategoryElement = Array.from(document.querySelectorAll('ul.accordion-body > li.category-page-sidebar-subcategory a.category-page-sidebar-subcategory-link'))
        .find(el => (el as HTMLElement).innerText.trim() === subCategory);
      if (subCategoryElement) (subCategoryElement as HTMLElement).click();
    }, subCategory);

    // Wait for the products to be loaded and displayed
    await page.waitForSelector('.products-list-container', { timeout: 50000 });

    // Function to scroll to the bottom of the page
    async function autoScroll(page: Page) {
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newHeight = await page.evaluate('document.body.scrollHeight');
      if (newHeight === previousHeight) {
        break;
      }
    }

    // Extract product details
    const products = await page.evaluate(() => {
      const productElements = document.querySelectorAll('.products-list-container .product-list > .ng-star-inserted');
      const productDetails = Array.from(productElements).map(productEl => {
        const productName = (productEl.querySelector('[itemprop="name"]') as HTMLElement)?.innerText.trim() || '';
        const productPrice = (productEl.querySelector('[itemprop="price"]') as HTMLElement)?.innerText.trim() || '';
        const imgUrl = (productEl.querySelector('img[itemprop="image"]') as HTMLImageElement)?.src || '';

        return { name: productName, price: productPrice, imgUrl: imgUrl };
      });
      return productDetails;
    });

    console.log(products);
    console.log(products.length);
    return products;

  } catch (error) {
    console.error('Error scraping products:', error);
    throw error;
  } finally {
    await browser.close();
  }
}


scrapeCategories('https://shop.aldi.hu/kezdooldal')

scrapeProducts('https://shop.aldi.hu/kezdooldal', 'Tejtermék, tojás', 'Tej')

