import mongoose from 'mongoose';
import Job from '../models/job.js';

export const getAnalytics = async (req, res) => {
  try {
    const uid = new mongoose.Types.ObjectId(req.userId);

    const [statusStats, typeStats, monthlyStats, total] = await Promise.all([
      Job.aggregate([
        { $match: { userId: uid } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Job.aggregate([
        { $match: { userId: uid } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      Job.aggregate([
        { $match: { userId: uid, dateApplied: { $exists: true, $ne: null } } },
        {
          $group: {
            _id: {
              year: { $year: '$dateApplied' },
              month: { $month: '$dateApplied' },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),
      Job.countDocuments({ userId: uid }),
    ]);

    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthly = monthlyStats.map((d) => ({
      month: `${months[d._id.month - 1]} ${d._id.year}`,
      count: d.count,
    }));

    res.json({ success: true, data: { statusStats, typeStats, monthly, total } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
