import mongoose from 'mongoose';

const noTopStudentSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  startupName: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  startupEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
    unique: true
  },
  reason: {
    type: String,
    default: ''
  },
  selectionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

noTopStudentSchema.index({ startupId: 1 });
noTopStudentSchema.index({ projectId: 1 });

const NoTopStudent = mongoose.model('NoTopStudent', noTopStudentSchema);

export default NoTopStudent; 