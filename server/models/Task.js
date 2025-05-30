import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  link: {
    type: String,
    required: true
  },
  isTopPerformer: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  skillTags: {
    type: [String],
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  totalSlots: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  filledSlots: {
    type: Number,
    default: 0
  },
  startup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Startup',
    required: true
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  submissions: [submissionSchema],
  payment: {
    amount: {
      type: Number,
      required: true,
      min: 100
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;