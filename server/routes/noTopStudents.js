import express from 'express';
import NoTopStudent from '../models/NoTopStudent.js';
import { auth, startupOnly } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Startup from '../models/Startup.js';
import TopStudent from '../models/TopStudent.js';

const router = express.Router();

// Endpoint to select no top student
router.post(
  '/select',
  auth,
  startupOnly,
  [
    body('startupId').isMongoId().withMessage('Invalid startup ID'),
    body('startupName').notEmpty().withMessage('Startup name is required'),
    body('company').notEmpty().withMessage('Company name is required'),
    body('startupEmail').isEmail().withMessage('Invalid startup email format'),
    body('projectId').isMongoId().withMessage('Invalid project ID'),
    body('reason').optional().isString(),
    body('paymentId').optional().isString(),
    body('money').optional().isNumeric()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        startupId,
        startupName,
        company,
        startupEmail,
        projectId,
        reason,
        paymentId,
        money
      } = req.body;

      // Validate MongoDB ObjectIds
      if (!mongoose.Types.ObjectId.isValid(startupId) || !mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid ID format'
        });
      }

      // Check if startup exists
      const startup = await Startup.findById(startupId);
      if (!startup) {
        return res.status(404).json({
          success: false,
          message: 'Startup not found'
        });
      }

      // Check if task exists
      const task = await Task.findById(projectId);
      if (!task) {
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
          message: 'You can only select No Top Student after the task deadline has passed.'
        });
      }
      // Check if task belongs to the startup
      if (String(task.startup) !== String(startupId)) {
        return res.status(403).json({
          success: false,
          message: 'Task does not belong to this startup',
          debug: { projectId, taskStartup: task.startup, startupId, taskDocument: task }
        });
      }

      // Check if a no top student is already selected for this project
      const existingNoTopStudent = await NoTopStudent.findOne({ projectId });
      if (existingNoTopStudent) {
        return res.status(400).json({
          success: false,
          message: 'No top student has already been selected for this project'
        });
      }

      // Check if a top student is already selected for this project
      const existingTopStudent = await TopStudent.findOne({ projectId });
      if (existingTopStudent) {
        return res.status(400).json({
          success: false,
          message: 'A top student has already been selected for this project'
        });
      }

      // Create new no top student entry
      let finalMoney = money;
      if (typeof finalMoney !== 'number' || finalMoney === 0) {
        finalMoney = task.payment?.amount || 0;
      }
      const noTopStudent = new NoTopStudent({
        startupId,
        startupName,
        company,
        startupEmail,
        projectId,
        reason: reason || '',
        paymentId: paymentId || '',
        money: finalMoney
      });

      await noTopStudent.save();

      // Optionally, update task status
      task.status = 'completed';
      await task.save();

      return res.status(201).json({
        success: true,
        message: 'No Top Student recorded successfully',
        data: noTopStudent
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to record No Top Student',
        error: error.message
      });
    }
  }
);

// Endpoint to get all no top student records
router.get('/', async (req, res) => {
  try {
    const records = await NoTopStudent.find()
      .populate('startupId', 'name email company')
      .populate('projectId', 'title description');
    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch records',
      error: error.message
    });
  }
});

export default router; 