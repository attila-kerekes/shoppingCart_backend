import { Request, Response, NextFunction } from 'express';
import * as aldiProductService from '../services/aldiProductService.js';
import { IProduct } from '../interfaces/product.js';
import AldiCategory from '../models/aldiSchemas/AldiCategory.js';
import Product from '../models/Product.js';
import { scrapeCategories, scrapeProducts } from '../services/scraping/scrapeAldi.js';


/*export const scrapeAndSaveAldiData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Scrape categories
    const categories = await scrapeCategories('https://shop.aldi.hu/kezdooldal');
    if (!categories) {
      return res.status(500).json({ error: 'Failed to scrape categories' });
    }

    // Iterate over categories to save them
    for (const [mainCategory, subcategories] of Object.entries(categories)) {
      const subcategoryDocs = [];
      
      for (const subcategory of subcategories) {
        // Scrape products for each subcategory
        const products = await scrapeProducts('https://shop.aldi.hu/kezdooldal', mainCategory, subcategory);
        if (products && products.length > 0) {
          const savedProducts = await Product.insertMany(products);
          const productRefs = savedProducts.map(product => product._id);
          subcategoryDocs.push({ name: subcategory, products: productRefs });
        }
      }

      // Save main category with its subcategories
      await AldiCategory.findOneAndUpdate(
        { category: mainCategory },
        { category: mainCategory, subcategories: subcategoryDocs },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: 'Scraping and saving data successful' });
  } catch (error) {
    console.error('Error scraping and saving Aldi data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
*/


export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await aldiProductService.getAllProducts();
    res.status(200).send(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await aldiProductService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData: IProduct = req.body;
    if (req.file) {
      productData.imagePath = `/images/${req.file.filename}`;
    }
    const product = await aldiProductService.createProduct(productData);
    res.status(201).send(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData: Partial<IProduct> = req.body;
    if (req.file) {
      productData.imagePath = `/images/${req.file.filename}`;
    }
    const product = await aldiProductService.updateProduct(req.params.id, productData);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await aldiProductService.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};


export const scrapeAndSaveAldiData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Scrape categories
    const categories = await scrapeCategories('https://shop.aldi.hu/kezdooldal');
    if (!categories) {
      return res.status(500).json({ error: 'Failed to scrape categories' });
    }

    // Iterate over categories to save them
    for (const [mainCategory, subcategories] of Object.entries(categories)) {
      const subcategoryDocs = [];

      for (const subcategory of subcategories) {
        // Scrape products for each subcategory
        const products = await scrapeProducts('https://shop.aldi.hu/kezdooldal', mainCategory, subcategory);
        if (products && products.length > 0) {
          const savedProducts = await Product.insertMany(products);
          const productRefs = savedProducts.map(product => product._id);
          subcategoryDocs.push({ name: subcategory, products: productRefs });
        }
      }

      // Save main category with its subcategories
      await AldiCategory.findOneAndUpdate(
        { category: mainCategory },
        { category: mainCategory, subcategories: subcategoryDocs },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ message: 'Scraping and saving data successful' });
  } catch (error) {
    console.error('Error scraping and saving Aldi data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};