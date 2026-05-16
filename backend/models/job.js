import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  position: { type: String, required: true },
  company: { type: String, required: true },
  type: { type: String, enum: ['Applied', 'Dropped', 'Interview', 'Offer'], default: 'Applied' },
  location: String,
  salaryRange: String,
  status: {
    type: String,
    enum: ['Applied', 'Round1', 'Round2', 'Round3', 'Selected', 'Rejected', 'Dropped'],
    default: 'Applied'
  },
  deadline: Date,
  dateApplied: Date,
  followUpDate: Date,
  recruiterName: String,
  recruiterContact: String,
  notes: String,
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
