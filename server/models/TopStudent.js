import mongoose from 'mongoose';

const topStudentSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student',
    required: true 
  },
  studentName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  skills: { 
    type: [String], 
    default: [],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.every(skill => typeof skill === 'string' && skill.trim().length > 0);
      },
      message: 'Skills must be an array of non-empty strings'
    }
  },
  githubLink: { 
    type: String,
    default: 'https://github.com'
  },
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
  selectionDate: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Add indexes for commonly queried fields
topStudentSchema.index({ studentId: 1 });
topStudentSchema.index({ startupId: 1 });
topStudentSchema.index({ projectId: 1 });

// Add a pre-save hook to validate references
topStudentSchema.pre('save', async function(next) {
  try {
    // Validate student exists
    const Student = mongoose.model('Student');
    const student = await Student.findById(this.studentId);
    if (!student) {
      throw new Error('Student not found');
    }

    // Validate startup exists
    const Startup = mongoose.model('Startup');
    const startup = await Startup.findById(this.startupId);
    if (!startup) {
      throw new Error('Startup not found');
    }

    // Validate task exists
    const Task = mongoose.model('Task');
    const task = await Task.findOne({ _id: this.projectId, startup: this.startupId });
    if (!task) {
      throw new Error('Task not found');
    }

    // Copy student data if not provided
    if (!this.studentName) {
      this.studentName = student.name;
    }
    if (!this.email) {
      this.email = student.email;
    }
    if (!this.phone) {
      this.phone = student.phone || '';
    }
    if (!this.skills || this.skills.length === 0) {
      this.skills = student.skills || [];
    }

    next();
  } catch (error) {
    next(error);
  }
});

const TopStudent = mongoose.model('TopStudent', topStudentSchema);

export default TopStudent;
