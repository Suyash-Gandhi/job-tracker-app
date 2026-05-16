import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  position: String,
  date: { type: Date, required: true },
  location: String,
  contact: String,
  recruiterName: String,
  notes: String,
  status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], default: 'Scheduled' },
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);
