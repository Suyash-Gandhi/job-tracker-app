import mongoose from 'mongoose';

const personSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  role: String,
  contact: String,
  company: String,
  relation: {
    type: String,
    enum: ['HR', 'Recruiter', 'Referral', 'LinkedIn', 'Friend', 'Mentor'],
    default: 'Recruiter'
  },
  lastContact: Date,
  followUp: Date,
  notes: String,
}, { timestamps: true });

export default mongoose.model('Person', personSchema);
