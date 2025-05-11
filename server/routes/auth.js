import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Startup from '../models/Startup.js';
import { auth } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, skills, company } = req.body;
    
    // Check if email already exists
    const existingStudent = await Student.findOne({ email });
    const existingStartup = await Startup.findOne({ email });
    
    if (existingStudent || existingStartup) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    // Create user based on role
    let user;
    if (role === 'student') {
      user = new Student({
        name,
        email,
        password,
        skills: skills || [],
        phone: req.body.phone || ''
      });
    } else if (role === 'startup') {
      user = new Startup({
        name,
        email,
        password,
        company: company || ''
      });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(role === 'student' ? { skills: user.skills } : { company: user.company })
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user based on role
    let user;
    if (role === 'student') {
      user = await Student.findOne({ email });
    } else if (role === 'startup') {
      user = await Startup.findOne({ email });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(role === 'student' ? { skills: user.skills } : { company: user.company })
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', auth, (req, res) => {
  res.json(req.user);
});

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { credential, role } = req.body;
    
    if (!credential) {
      console.error('Missing Google credential in request');
      return res.status(400).json({ message: 'Missing Google credential' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('Google Client ID not configured in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Verify Google token
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (error) {
      console.error('Google token verification failed:', error);
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    if (!payload?.email) {
      console.error('Google account has no email:', payload);
      return res.status(400).json({ message: 'Google account has no email' });
    }

    console.log('Google login attempt for email:', payload.email);

    // Check both Student and Startup models for existing user
    let user = await Student.findOne({ email: payload.email });
    let userRole = 'student';
    
    if (!user) {
      user = await Startup.findOne({ email: payload.email });
      if (user) {
        userRole = 'startup';
      } else {
        console.log('No account found for email:', payload.email);
        // If user doesn't exist in either model, return error
        return res.status(404).json({ 
          message: 'No account found with this email. Please register first.',
          email: payload.email,
          name: payload.name
        });
      }
    }

    // Verify role matches
    if (role && role !== userRole) {
      console.error('Role mismatch:', { provided: role, actual: userRole });
      return res.status(400).json({ 
        message: `This email is registered as a ${userRole}. Please select the correct role.`
      });
    }

    // Generate JWT with the correct role
    const token = jwt.sign(
      { id: user._id, role: user.role || userRole },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    console.log('Google login successful for:', payload.email);

    res.json({ 
      token, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || userRole,
        ...(user.role === 'student' || userRole === 'student' ? { skills: user.skills } : { company: user.company })
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ 
      message: 'Google login failed', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

export default router;