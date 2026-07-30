import express from 'express';
import { getCustomerByTelephone, lookupCustomer, updateCustomer } from '../controllers/customerController.js';
import { getCustomerValidator, lookupValidator, updateValidator } from '../validation/customerValidation.js';

const router = express.Router();

// GET customer by telephone number (GET /api/customers/:telephone)
router.get('/:telephone', getCustomerValidator, getCustomerByTelephone);

// POST lookup customer (POST /api/customers/lookup)
router.post('/lookup', lookupValidator, lookupCustomer);

// PUT update customer by telephone param (PUT /api/customers/:telephone)
router.put('/:telephone', updateValidator, updateCustomer);

export default router;

