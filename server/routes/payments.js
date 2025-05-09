import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { auth, startupOnly } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

// Debug middleware for payments routes
router.use((req, res, next) => {
  console.log(`[Payments] ${req.method} ${req.path}`, req.body);
  next();
});

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_test_pIRURBknTtWJ3p',
  key_secret: 'eyOfruF0oWJItfgFONsBJPiY'
});

// Test route to verify payments router is working
router.get('/test', (req, res) => {
  console.log('Payments API test endpoint called');
  res.json({ status: 'ok', message: 'Payments API is accessible' });
});

// Create a Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    console.log('[Create Order] Request body:', req.body);
    console.log('[Create Order] User:', req.user);

    const { amount } = req.body;

    if (!amount || amount < 100) {
      console.log('[Create Order] Invalid amount:', amount);
      return res.status(400).json({ message: 'Amount must be at least ₹100' });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    };

    console.log('[Create Order] Creating order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('[Create Order] Order created successfully:', order);
    res.json(order);
  } catch (error) {
    console.error('[Create Order] Error:', error);
    res.status(500).json({ 
      message: 'Error creating order',
      error: error.message 
    });
  }
});

// Verify payment and create task
router.post('/verify', auth, startupOnly, async (req, res) => {
  try {
    console.log('[Verify] Request body:', req.body);
    console.log('[Verify] User:', req.user);

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      taskData
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.log('[Verify] Missing payment details');
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    console.log('Razorpay Secret Used:', process.env.RAZORPAY_KEY_SECRET);
    console.log('Order ID:', razorpay_order_id);
    console.log('Payment ID:', razorpay_payment_id);
    console.log('Signature:', razorpay_signature);
    console.log('Body for HMAC:', body);
    console.log('Expected Signature:', expectedSignature);

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      console.log('[Verify] Invalid signature');
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    console.log('[Verify] Creating task with data:', taskData);
    // Create task with payment details
    const task = new Task({
      ...taskData,
      startup: req.user._id,
      payment: {
        amount: taskData.payment.amount,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        status: 'completed'
      }
    });

    await task.save();
    console.log('[Verify] Task saved successfully');

    // Add task reference to startup
    await mongoose.model('Startup').findByIdAndUpdate(
      req.user._id,
      { $push: { tasks: task._id } }
    );
    console.log('[Verify] Startup updated with task reference');

    res.status(201).json(task);
  } catch (error) {
    console.error('[Verify] Error:', error);
    res.status(500).json({ 
      message: 'Error verifying payment',
      error: error.message,
      stack: error.stack
    });
  }
});

export default router; 