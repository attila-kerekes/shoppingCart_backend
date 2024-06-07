import { Schema, model, Document } from 'mongoose';
import { IProduct } from '../interfaces/product.js';

interface IProductDocument extends IProduct, Document { }

const productSchema = new Schema<IProductDocument>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imagePath: { type: String, required: true },
});

const Product = model<IProductDocument>('Product', productSchema);

export default Product;
