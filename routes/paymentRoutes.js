const express = require('express');
const router = express.Router();
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentsController');
const protect = require('../middleware/auth');
const bodyParser = require('body-parser');

// Stripe webhook requires raw body
router.post(
  '/webhook',
  bodyParser.raw({ type: 'application/json' }),
  handleWebhook
);

// Protected route for creating a PaymentIntent
router.post('/create-intent', protect, createPaymentIntent);

module.exports = router;
