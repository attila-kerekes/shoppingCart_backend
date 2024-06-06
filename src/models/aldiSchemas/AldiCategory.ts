import { Schema, model, Types } from 'mongoose';

const subcategorySchema = new Schema({
  name: { type: String, required: true },
  products: [{ type: Types.ObjectId, ref: 'Product' }]
});

const aldiCategorySchema = new Schema({
  category: {
    type: String,
    required: true,
    unique: true
  },
  subcategories: [subcategorySchema]
});

const AldiCategory = model('AldiCategory', aldiCategorySchema);

export default AldiCategory;
