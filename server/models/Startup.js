import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const startupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  company: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  startupStage: {
    type: String,
    trim: true,
    default: ''
  },
  startupAge: {
    type: String,
    trim: true,
    default: ''
  },
  startupIndiaRegistered: {
    type: String,
    trim: true,
    default: ''
  },
  linkedIn: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    default: 'startup'
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
  }
});

// Hash password before saving
startupSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
startupSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Startup = mongoose.model('Startup', startupSchema);

export default Startup;