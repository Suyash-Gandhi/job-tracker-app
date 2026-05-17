import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import peopleRoutes from './routes/people.js';
import interviewRoutes from './routes/interviews.js';
import analyticsRoutes from './routes/analytics.js';
import resumeRoutes from './routes/resume.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'https://job-tracker-app-10.onrender.com',
  credentials: true
}));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/jobs', jobRoutes);
app.use('/people', peopleRoutes);
app.use('/interviews', interviewRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/analyze', resumeRoutes);

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);