import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  startupName: { type: String, required: true },
  startupEmail: { type: String, required: true },
  upiReference: { type: String, required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment; 