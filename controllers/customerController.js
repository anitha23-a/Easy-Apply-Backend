import { validationResult } from 'express-validator';
import * as customerService from '../services/customerService.js';

export const getCustomerByTelephone = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { telephone } = req.params;
    const customer = await customerService.findCustomerByTelephone(telephone);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    return res.status(200).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
};

export const lookupCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const telephone = req.body.telephone || req.params.telephone;
    const customer = await customerService.findCustomerByTelephone(telephone);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    return res.status(200).json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
};

export const updateCustomer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { telephone } = req.params;
    const updates = req.body;
    const affected = await customerService.updateCustomer(telephone, updates);
    if (affected === 0) {
      return res.status(400).json({ success: false, message: 'Nothing to update or customer not found' });
    }

    const updated = await customerService.findCustomerByTelephone(telephone);
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

