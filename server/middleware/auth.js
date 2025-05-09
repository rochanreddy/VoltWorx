import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Startup from '../models/Startup.js';

export const auth = async (req, res, next) => {
  try {
    // Check for token in headers
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token, authorization denied' });
    }

    // Validate decoded object
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: 'Token is missing required fields' });
    }

    // Find user based on role
    let user;
    if (decoded.role === 'student') {
      user = await Student.findById(decoded.id).select('-password');
    } else if (decoded.role === 'startup') {
      user = await Startup.findById(decoded.id).select('-password');
    }
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const studentOnly = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Student only' });
  }
};

export const startupOnly = (req, res, next) => {
  if (req.user && req.user.role === 'startup') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Startup only' });
  }
};