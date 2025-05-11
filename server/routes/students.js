import express from 'express';
import Student from '../models/Student.js';
import Task from '../models/Task.js';
import { auth, studentOnly } from '../middleware/auth.js';

const router = express.Router();

// Get student profile
router.get('/profile', auth, studentOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.user._id).select('-password').populate('submittedTasks');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student profile
router.patch('/profile', auth, studentOnly, async (req, res) => {
  try {
    const { name, skills } = req.body;
    const updates = {};
    
    if (name) updates.name = name;
    if (skills) updates.skills = skills;
    
    const student = await Student.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's joined tasks
router.get('/tasks', auth, studentOnly, async (req, res) => {
  try {
    const tasks = await Task.find({ applicants: req.user._id })
      .populate('startup', 'name company')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching student tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student's submissions
router.get('/submissions', auth, studentOnly, async (req, res) => {
  try {
    const tasks = await Task.find({ 'submissions.student': req.user._id })
      .populate('startup', 'name company')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;