import express from 'express';
import axios from 'axios';
import mongoose from 'mongoose';
import { auth, startupOnly } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

// Cashfree credentials (use environment variables in production!)
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET = process.env.CASHFREE_SECRET;
const CASHFREE_BASE_URL = process.env.CASHFREE_BASE_URL || 'https://api.cashfree.com/pg';

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
    // Log environment variables (without sensitive data)
    console.log('[Cashfree Create Order] Environment check:', {
      hasAppId: !!CASHFREE_APP_ID,
      hasSecret: !!CASHFREE_SECRET,
      baseUrl: CASHFREE_BASE_URL
    });

    // Check for required env variables
    if (!CASHFREE_APP_ID || !CASHFREE_SECRET || !CASHFREE_BASE_URL) {
      console.error('[Cashfree Create Order] Missing Cashfree environment variables');
      return res.status(500).json({ message: 'Server misconfiguration: Cashfree credentials missing.' });
    }

    const { amount, customer_email, customer_phone, customer_id } = req.body;
    
    // Log request data
    console.log('[Cashfree Create Order] Request data:', {
      amount,
      customer_email,
      customer_phone,
      customer_id
    });

    if (!amount || amount < 100) {
      return res.status(400).json({ message: 'Amount must be at least ₹100' });
    }
    if (!customer_email || !customer_phone) {
      return res.status(400).json({ message: 'Customer email and phone are required' });
    }

    const orderId = 'order_' + Date.now();
    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: customer_id || ('cust_' + Date.now()),
        customer_email,
        customer_phone
      }
    };

    // Log the payload being sent to Cashfree
    console.log('[Cashfree Create Order] Sending payload to Cashfree:', orderPayload);

    let response;
    try {
      console.log('🔍 [CASHFREE_DEBUG] Making request to Cashfree with headers:', {
        'x-client-id': CASHFREE_APP_ID ? 'present' : 'missing',
        'x-client-secret': CASHFREE_SECRET ? 'present' : 'missing',
        'x-api-version': '2022-09-01',
        'Content-Type': 'application/json'
      });

      response = await axios.post(
        `${CASHFREE_BASE_URL}/orders`,
        orderPayload,
        {
          headers: {
            'x-client-id': CASHFREE_APP_ID,
            'x-client-secret': CASHFREE_SECRET,
            'Content-Type': 'application/json',
            'x-api-version': '2022-09-01'
          },
        }
      );
    } catch (apiError) {
      console.error('❌ [CASHFREE_DEBUG] API Error Details:', {
        status: apiError.response?.status,
        statusText: apiError.response?.statusText,
        data: apiError.response?.data,
        message: apiError.message,
        headers: apiError.response?.headers,
        requestUrl: `${CASHFREE_BASE_URL}/orders`,
        requestPayload: orderPayload
      });
      return res.status(500).json({ 
        message: 'Cashfree API error', 
        error: apiError.response?.data || apiError.message,
        details: {
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data
        }
      });
    }

    console.log('✅ [CASHFREE_DEBUG] Cashfree Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    });

    if (response.data && response.data.order_id && response.data.payment_session_id) {
      res.json({
        order_id: response.data.order_id,
        payment_session_id: response.data.payment_session_id,
        order_amount: response.data.order_amount,
        order_currency: response.data.order_currency,
        order_status: response.data.order_status,
        customer_details: response.data.customer_details
      });
    } else {
      console.error('❌ [CASHFREE_DEBUG] Invalid response from Cashfree:', {
        data: response.data,
        status: response.status,
        statusText: response.statusText
      });
      res.status(500).json({ 
        message: 'Invalid order response from Cashfree', 
        error: response.data,
        details: {
          status: response.status,
          statusText: response.statusText
        }
      });
    }
  } catch (error) {
    console.error('[Cashfree Create Order] Error:', error.response?.data || error.message, error);
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