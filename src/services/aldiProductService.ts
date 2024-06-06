import * as aldiProductRepository from '../repositories/aldiProductRepository.js';
import { IProduct } from '../interfaces/product.js';

export const getAllProducts = (): Promise<IProduct[]> => {
  return aldiProductRepository.findAllProducts();
};

export const getProductById = (id: string): Promise<IProduct | null> => {
  return aldiProductRepository.findProductById(id);
};

export const createProduct = (productData: IProduct): Promise<IProduct> => {
  return aldiProductRepository.createProduct(productData);
};

export const updateProduct = (id: string, productData: Partial<IProduct>): Promise<IProduct | null> => {
  return aldiProductRepository.updateProduct(id, productData);
};

export const deleteProduct = (id: string): Promise<IProduct | null> => {
  return aldiProductRepository.deleteProduct(id);
};
