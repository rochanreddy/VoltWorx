import express from 'express';
import Startup from '../models/Startup.js';
import Task from '../models/Task.js';
import { auth, startupOnly } from '../middleware/auth.js';

const router = express.Router();

// Get startup profile
router.get('/profile', auth, startupOnly, async (req, res) => {
  try {
    const startup = await Startup.findById(req.user._id).select('-password');
    
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }
    
    res.json(startup);
  } catch (error) {
    console.error('Error fetching startup profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update startup profile
router.patch('/profile', auth, startupOnly, async (req, res) => {
  try {
    const { name, company } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (company) updates.company = company;
    
    const startup = await Startup.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('-password');
    
    if (!startup) {
      return res.status(404).json({ message: 'Startup not found' });
    }
    
    res.json(startup);
  } catch (error) {
    console.error('Error updating startup profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get startup's tasks
router.get('/tasks', auth, startupOnly, async (req, res) => {
  try {
    const tasks = await Task.find({ startup: req.user._id })
      .populate('applicants', 'name email skills')
      .populate({
        path: 'submissions.student',
        select: 'name email skills',
        model: 'Student'
      })
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching startup tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;