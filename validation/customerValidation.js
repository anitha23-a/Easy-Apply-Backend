import { body, param } from 'express-validator';

export const getCustomerValidator = [
  param('telephone')
    .trim()
    .notEmpty()
    .withMessage('Telephone number is required')
    .isNumeric()
    .withMessage('Telephone number must be numeric')
    .isLength({ min: 10, max: 10 })
    .withMessage('Telephone number must be exactly 10 digits'),
];

export const lookupValidator = [
  body('telephone')
    .trim()
    .notEmpty()
    .withMessage('Telephone number is required')
    .isNumeric()
    .withMessage('Telephone number must be numeric')
    .isLength({ min: 10, max: 10 })
    .withMessage('Telephone number must be exactly 10 digits'),
];

export const updateValidator = [
  param('telephone')
    .trim()
    .notEmpty()
    .withMessage('Telephone number is required')
    .isNumeric()
    .withMessage('Telephone number must be numeric')
    .isLength({ min: 10, max: 10 })
    .withMessage('Telephone number must be exactly 10 digits'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address'),
  body('mobile')
    .optional()
    .trim(),
  body('contactPerson')
    .optional()
    .trim(),
  body('serviceType')
    .optional()
    .trim(),
];

