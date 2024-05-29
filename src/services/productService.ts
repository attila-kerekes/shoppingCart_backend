import * as productRepository from '../repositories/productRepository';
import { IProduct } from '../interfaces/product';

export const getAllProducts = (): Promise<IProduct[]> => {
  return productRepository.findAllProducts();
};

export const getProductById = (id: string): Promise<IProduct | null> => {
  return productRepository.findProductById(id);
};

export const createProduct = (productData: IProduct): Promise<IProduct> => {
  return productRepository.createProduct(productData);
};

export const updateProduct = (id: string, productData: Partial<IProduct>): Promise<IProduct | null> => {
  return productRepository.updateProduct(id, productData);
};

export const deleteProduct = (id: string): Promise<IProduct | null> => {
  return productRepository.deleteProduct(id);
};
