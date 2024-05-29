import { Router } from 'express';
import { registerCustomer, getAllCustomers } from '../controllers/customerController';

const router = Router();

router.post('/', registerCustomer);
router.get('/', getAllCustomers);

export default router;
