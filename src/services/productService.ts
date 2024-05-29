import * as productRepository from '../repositories/productRepository';

export const getAllProducts = () => {
  return productRepository.findAllProducts();
};

export const getProductById = (id: string) => {
  return productRepository.findProductById(id);
};

export const createProduct = (productData: any) => {
  return productRepository.createProduct(productData);
};

export const updateProduct = (id: string, productData: any) => {
  return productRepository.updateProduct(id, productData);
};

export const deleteProduct = (id: string) => {
  return productRepository.deleteProduct(id);
};

