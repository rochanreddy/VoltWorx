import mongoose from 'mongoose';
import Task from '../models/Task.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const moveLastTaskToCompleted = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gcet_project');
    console.log('Connected to MongoDB');

    // Find the last task
    const lastTask = await Task.findOne().sort({ createdAt: -1 });
    
    if (!lastTask) {
      console.log('No tasks found in the database');
      return;
    }

    console.log('Found task:', lastTask.title);

    // Set deadline to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Update the task's deadline
    await Task.findByIdAndUpdate(lastTask._id, {
      deadline: yesterday
    });

    console.log('Task moved to completed section successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
moveLastTaskToCompleted(); 