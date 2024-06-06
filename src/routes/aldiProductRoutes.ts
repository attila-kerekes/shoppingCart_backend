import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  scrapeAndSaveAldiData
} from '../controllers/aldiProductController.js';

const router = Router();

router
  .post('/scrape', scrapeAndSaveAldiData);

router
  .route('/')
  .get(getAllProducts);

router
  .route('/:id')
  .get(getProductById)
  .delete(deleteProduct);

export default router;

