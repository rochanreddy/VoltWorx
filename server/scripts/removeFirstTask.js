import mongoose from 'mongoose';
import Task from '../models/Task.js';
import Student from '../models/Student.js';
import Startup from '../models/Startup.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const removeFirstTask = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gcet_project');
    console.log('Connected to MongoDB');

    // Find the first task
    const firstTask = await Task.findOne().sort({ createdAt: 1 });
    
    if (!firstTask) {
      console.log('No tasks found in the database');
      return;
    }

    console.log('Found task:', firstTask.title);

    // Remove task references from students who applied
    if (firstTask.applicants.length > 0) {
      await Student.updateMany(
        { _id: { $in: firstTask.applicants } },
        { $pull: { appliedTasks: firstTask._id } }
      );
      console.log('Removed task references from applicants');
    }

    // Remove task references from students who submitted
    if (firstTask.submissions.length > 0) {
      const studentIds = firstTask.submissions.map(sub => sub.student);
      await Student.updateMany(
        { _id: { $in: studentIds } },
        { $pull: { submittedTasks: firstTask._id } }
      );
      console.log('Removed task references from submitters');
    }

    // Remove task reference from startup
    await Startup.updateOne(
      { _id: firstTask.startup },
      { $pull: { tasks: firstTask._id } }
    );
    console.log('Removed task reference from startup');

    // Delete the task
    await Task.findByIdAndDelete(firstTask._id);
    console.log('Task deleted successfully');

    console.log('Cleanup completed successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
removeFirstTask(); 