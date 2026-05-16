import Job from '../models/job.js';

export const getJobs = async (req, res) => {
  try {
    const { status, type, search, sort = '-dateApplied' } = req.query;
    const query = { userId: req.userId };
    if (status) query.status = status;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { position: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    const jobs = await Job.find(query).sort(sort);
    res.json({ success: true, data: jobs, count: jobs.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ success: true, message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
