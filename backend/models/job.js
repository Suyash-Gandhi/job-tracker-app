import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  position: String,
  company: String,
  mode: String,
  location: String,
  salary: String,
  status: String,
  deadline: Date,
  dateApplied: Date,
  followUp: Date,
  recruiter: String,
  additionalNotes: String,
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
