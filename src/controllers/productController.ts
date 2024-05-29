import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';
import { IProduct } from '../interfaces/product';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).send(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getProductById(req.params.id);
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
    if(req.file) {
      productData.imagePath = `/images/${req.file.filename}`;
    }
    const product = await productService.createProduct(productData);
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
    const product = await productService.updateProduct(req.params.id, productData);
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
    const product = await productService.deleteProduct(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Product not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
