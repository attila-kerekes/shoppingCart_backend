import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import uploadFileMw from '../middlewares/uploadFileMw.js';

const router = Router();

router
  .route('/')
    .get(getAllProducts)
    .post(uploadFileMw.single('image'), createProduct);

router
  .route('/:id')
    .get(getProductById)
    .put(uploadFileMw.single('image'), updateProduct)
    .delete(deleteProduct);

export default router;

