import express from 'express';
import TopStudent from '../models/TopStudent.js';
import { auth, startupOnly } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Student from '../models/Student.js';
import Startup from '../models/Startup.js';

const router = express.Router();

// Endpoint to select a top student
router.post(
  '/select',
  auth,
  startupOnly,
  [
    body('studentId').isMongoId().withMessage('Invalid student ID'),
    body('studentName').optional(),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('skills').optional().isArray().withMessage('Skills must be an array'),
    body('submissionLink').optional().isURL().withMessage('Invalid submission link'),
    body('startupId').isMongoId().withMessage('Invalid startup ID'),
    body('startupName').notEmpty().withMessage('Startup name is required'),
    body('company').notEmpty().withMessage('Company name is required'),
    body('startupEmail').isEmail().withMessage('Invalid startup email format'),
    body('projectId').isMongoId().withMessage('Invalid project ID')
  ],
  async (req, res) => {
    console.log('📥 Received request to select top student:', req.body);
    
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('❌ Validation Errors:', errors.array());
        return res.status(400).json({ 
          success: false, 
          message: 'Validation failed', 
          errors: errors.array() 
        });
      }

      const {
        studentId,
        studentName,
        email,
        skills,
        submissionLink,
        startupId,
        startupName,
        company,
        startupEmail,
        projectId
      } = req.body;

      console.log('🔍 Validating IDs:', { studentId, startupId, projectId });

      // Validate MongoDB ObjectIds
      if (!mongoose.Types.ObjectId.isValid(studentId) || 
          !mongoose.Types.ObjectId.isValid(startupId) || 
          !mongoose.Types.ObjectId.isValid(projectId)) {
        console.error('❌ Invalid ID format:', { studentId, startupId, projectId });
        return res.status(400).json({
          success: false,
          message: 'Invalid ID format'
        });
      }

      // Check if student exists
      console.log('🔍 Checking student:', studentId);
      const student = await Student.findById(studentId);
      if (!student) {
        console.error('❌ Student not found:', studentId);
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }

      // Check if startup exists
      console.log('🔍 Checking startup:', startupId);
      const startup = await Startup.findById(startupId);
      if (!startup) {
        console.error('❌ Startup not found:', startupId);
        return res.status(404).json({
          success: false,
          message: 'Startup not found'
        });
      }

      // Check if task exists
      const task = await Task.findById(projectId);
      console.log('🔍 Task document:', task);
      if (!task) {
        console.error('❌ Task not found:', { projectId });
        return res.status(404).json({
          success: false,
          message: 'Task not found',
          debug: { projectId }
        });
      }
      // Prevent selection before deadline
      if (new Date(task.deadline) > new Date()) {
        return res.status(400).json({
          success: false,
          message: 'You can only select a top student after the task deadline has passed.'
        });
      }
      // Check if task belongs to the startup
      if (String(task.startup) !== String(startupId)) {
        console.error('❌ Task does not belong to this startup:', { projectId, taskStartup: task.startup, startupId });
        return res.status(403).json({
          success: false,
          message: 'Task does not belong to this startup',
          debug: { projectId, taskStartup: task.startup, startupId, taskDocument: task }
        });
      }

      // Check if a top student is already selected for this project
      console.log('🔍 Checking existing top student for project:', projectId);
      const existingTopStudent = await TopStudent.findOne({ projectId });
      if (existingTopStudent) {
        console.error('❌ Top student already selected for project:', projectId);
        return res.status(400).json({
          success: false,
          message: 'A top student has already been selected for this project'
        });
      }

      // Get student's github link and phone
      let githubLink = '';
      let phone = student.phone || '';
      // Try to get github from student, then from submission (if available in request), then fallback
      if (student.github) {
        githubLink = student.github;
      } else if (submissionLink) {
        githubLink = submissionLink;
      } else {
        githubLink = 'https://github.com';
      }

      // Create new top student entry
      console.log('📝 Creating new top student entry:', {
        studentId,
        studentName: studentName || student.name,
        email: email || student.email,
        phone,
        skills: skills || student.skills || [],
        githubLink,
        startupId,
        startupName,
        company,
        startupEmail,
        projectId
      });

      const topStudent = new TopStudent({
        studentId,
        studentName: studentName || student.name,
        email: email || student.email,
        phone,
        skills: skills || student.skills || [],
        githubLink,
        startupId,
        startupName,
        company,
        startupEmail,
        projectId
      });

      await topStudent.save();
      console.log('✅ Top student saved successfully:', topStudent._id);

      // Update task status to indicate top student has been selected
      task.status = 'completed';
      await task.save();
      console.log('✅ Task status updated to completed:', task._id);

      return res.status(201).json({
        success: true,
        message: 'Top student selected successfully',
        data: topStudent
      });

    } catch (error) {
      console.error('❌ Error selecting top student:', error);
      console.error('❌ Full Error:', error.stack);
      return res.status(500).json({
        success: false,
        message: 'Failed to select top student',
        error: error.message
      });
    }
  }
);

// Endpoint to get all top students
router.get('/', async (req, res) => {
  try {
    const topStudents = await TopStudent.find()
      .populate('studentId', 'name email skills')
      .populate('startupId', 'name email company')
      .populate('projectId', 'title description');
    
    res.json({
      success: true,
      data: topStudents
    });
  } catch (error) {
    console.error('❌ Error fetching top students:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top students',
      error: error.message
    });
  }
});

export default router;
