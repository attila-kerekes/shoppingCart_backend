import Product from '../models/Product.js';
import { IProduct } from '../interfaces/product.js';

export const findAllProducts = (): Promise<IProduct[]> => {
  return Product.find().exec();
};

export const findProductById = (id: string): Promise<IProduct | null> => {
  return Product.findById(id).exec();
};

export const createProduct = (productData: IProduct): Promise<IProduct> => {
  const product = new Product(productData);
  return product.save();
};

export const updateProduct = (id: string, productData: Partial<IProduct>): Promise<IProduct | null> => {
  return Product.findByIdAndUpdate(id, productData, { new: true }).exec();
};

export const deleteProduct = (id: string): Promise<IProduct | null> => {
  return Product.findByIdAndDelete(id).exec();
};
