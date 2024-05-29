import Product from '../models/Product';

export const findAllProducts = () => {
  return Product.find();
};

export const findProductById = (id: string) => {
  return Product.findById(id);
};

export const createProduct = (productData: any) => {
  const product = new Product(productData);
  return product.save();
};

export const updateProduct = (id: string, productData: any) => {
  return Product.findByIdAndUpdate(id, productData, { new: true });
};

export const deleteProduct = (id: string) => {
  return Product.findByIdAndDelete(id);
};

