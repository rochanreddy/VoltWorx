import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import { auth, startupOnly } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

// Cashfree credentials (use environment variables in production!)
const CASHFREE_APP_ID = 'TEST10609211de6ed1cdc721c0c3d87711290601';
const CASHFREE_SECRET = 'cfsk_ma_test_20f71dc9d96264fb295173d9102d5bc2_6470e097';
const CASHFREE_BASE_URL = 'https://sandbox.cashfree.com/pg';

// Debug middleware for payments routes
router.use((req, res, next) => {
  console.log(`[Payments] ${req.method} ${req.path}`, req.body);
  next();
});

// Test route to verify payments router is working
router.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Payments API. is accessible (Cashfree)' });
});

// Create a Cashfree order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 100) {
      return res.status(400).json({ message: 'Amount must be at least ₹100' });
    }
    const orderId = 'order_' + Date.now();
    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: 'cust_' + Date.now(),
        customer_email: 'test@example.com',
        customer_phone: '9999999999'
      }
    };
    const response = await axios.post(
      `${CASHFREE_BASE_URL}/orders`,
      orderPayload,
      {
        headers: {
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('[Cashfree Create Order] Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error creating Cashfree order', error: error.response?.data || error.message });
  }
});

// Verify payment and create task
router.post('/verify', auth, startupOnly, async (req, res) => {
  try {
    const { order_id, payment_session_id, taskData } = req.body;
    if (!order_id || !payment_session_id) {
      return res.status(400).json({ message: 'Missing payment details' });
    }
    // Verify payment status with Cashfree
    const response = await axios.get(
      `${CASHFREE_BASE_URL}/orders/${order_id}/payments`,
      {
        headers: {
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET,
        },
      }
    );
    const payments = response.data.payments || [];
    const payment = payments.find(p => p.payment_session_id === payment_session_id);
    if (!payment || payment.payment_status !== 'SUCCESS') {
      return res.status(400).json({ message: 'Payment not successful' });
    }
    // Create task with payment details
    const task = new Task({
      ...taskData,
      startup: req.user._id,
      payment: {
        amount: taskData.payment.amount,
        cashfreeOrderId: order_id,
        cashfreePaymentSessionId: payment_session_id,
        status: 'completed'
      }
    });
    await task.save();
    await mongoose.model('Startup').findByIdAndUpdate(
      req.user._id,
      { $push: { tasks: task._id } }
    );
    res.status(201).json(task);
  } catch (error) {
    console.error('[Cashfree Verify] Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Error verifying payment', error: error.response?.data || error.message });
  }
});

export default router; 