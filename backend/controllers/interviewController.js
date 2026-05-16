import Interview from '../models/interview.js';

export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId }).sort('date');
    res.json({ success: true, data: interviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createInterview = async (req, res) => {
  try {
    const interview = await Interview.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, data: interview });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json({ success: true, data: interview });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json({ success: true, message: 'Interview deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
