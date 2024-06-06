import { Router } from 'express';
import { registerCustomer, getAllCustomers } from '../controllers/customerController.js';

const router = Router();

router
  .route('/')
    .get(getAllCustomers)
    .post(registerCustomer);

export default router;
