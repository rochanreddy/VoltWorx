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
        skills: skills || []
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
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Missing Google credential' });
    }
    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return res.status(400).json({ message: 'Google account has no email' });
    }

    // Check both Student and Startup models for existing user
    let user = await Student.findOne({ email: payload.email });
    let role = 'student';
    
    if (!user) {
      user = await Startup.findOne({ email: payload.email });
      if (user) {
        role = 'startup';
      } else {
        // If user doesn't exist in either model, return error
        return res.status(404).json({ 
          message: 'No account found with this email. Please register first.',
          email: payload.email,
          name: payload.name
        });
      }
    }

    // Generate JWT with the correct role
    const token = jwt.sign(
      { id: user._id, role: user.role || role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ 
      token, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || role,
        ...(user.role === 'student' || role === 'student' ? { skills: user.skills } : { company: user.company })
      }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ message: 'Google login failed', error: error.message });
  }
});

export default router;