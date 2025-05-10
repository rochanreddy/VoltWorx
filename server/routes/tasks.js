import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { auth, studentOnly, startupOnly } from '../middleware/auth.js';
import Payment from '../models/Payment.js';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('startup', 'name company')
      .populate('applicants', 'name email skills')
      .populate('submissions.student', 'name email skills')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('startup', 'name company')
      .populate('applicants', 'name email skills')
      .populate('submissions.student', 'name email skills');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post('/', auth, startupOnly, async (req, res) => {
  try {
    const { title, description, skillTags, deadline, totalSlots, upiReference, payment } = req.body;
    if (!upiReference || !payment || !payment.amount) {
      return res.status(400).json({ message: 'UPI reference and payment amount are required' });
    }
    const task = new Task({
      title,
      description,
      skillTags,
      deadline,
      totalSlots,
      startup: req.user._id,
      payment: { amount: payment.amount, status: 'pending' }
    });
    await task.save();
    // Save payment details
    const paymentDoc = new Payment({
      startupName: req.user.name,
      startupEmail: req.user.email,
      upiReference,
      taskId: task._id,
      amount: payment.amount
    });
    await paymentDoc.save();
    // Add task reference to startup
    await mongoose.model('Startup').findByIdAndUpdate(
      req.user._id,
      { $push: { tasks: task._id } }
    );
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a task
router.post('/:taskId/join', auth, studentOnly, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (task.filledSlots >= task.totalSlots) {
      return res.status(400).json({ message: 'Task is full' });
    }
    
    if (task.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already joined this task' });
    }
    
    task.applicants.push(req.user._id);
    task.filledSlots += 1;
    if (task.filledSlots >= task.totalSlots) {
      task.status = 'completed';
    }
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Error joining task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit a task
router.post('/:taskId/submit', auth, studentOnly, async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({ message: 'A link is required' });
    }

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!task.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have not joined this task' });
    }

    // Check if student has already submitted
    const existingSubmission = task.submissions.find(
      submission => submission.student.toString() === req.user._id.toString()
    );
    if (existingSubmission) {
      // Update the link and submittedAt fields
      existingSubmission.link = link;
      existingSubmission.submittedAt = new Date();
    } else {
      task.submissions.push({
        student: req.user._id,
        link
      });
    }

    // Mark project as completed
    task.status = 'completed';

    await task.save();
    await task.populate('submissions.student', 'name email skills');
    
    res.json(task);
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark top performer
router.patch('/:id/mark-top', auth, startupOnly, async (req, res) => {
  try {
    const { studentId } = req.body;
    
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required' });
    }
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is the task creator
    if (task.startup.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to mark top performers' });
    }
    
    // Find submission
    const submissionIndex = task.submissions.findIndex(
      (submission) => submission.student.toString() === studentId
    );
    
    if (submissionIndex === -1) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Reset all top performers
    task.submissions.forEach((submission) => {
      submission.isTopPerformer = false;
    });
    
    // Mark new top performer
    task.submissions[submissionIndex].isTopPerformer = true;
    
    await task.save();
    
    res.json({ message: 'Successfully marked top performer', task });
  } catch (error) {
    console.error('Error marking top performer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a task
router.delete('/:id', auth, startupOnly, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check if user is the task creator
    if (task.startup.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to delete this task' });
    }
    
    // Remove task references from students who applied
    if (task.applicants.length > 0) {
      await mongoose.model('Student').updateMany(
        { _id: { $in: task.applicants } },
        { $pull: { appliedTasks: task._id } }
      );
    }
    
    // Remove task references from students who submitted
    if (task.submissions.length > 0) {
      const studentIds = task.submissions.map(sub => sub.student);
      await mongoose.model('Student').updateMany(
        { _id: { $in: studentIds } },
        { $pull: { submittedTasks: task._id } }
      );
    }
    
    // Remove task reference from startup
    await mongoose.model('Startup').updateOne(
      { _id: task.startup },
      { $pull: { tasks: task._id } }
    );
    
    // Delete the task
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Failed to delete task. Please try again.' });
  }
});

export default router;