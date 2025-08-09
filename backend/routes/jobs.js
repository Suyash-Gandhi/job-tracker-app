import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// POST - Add job
router.post("/", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET - List jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({},"-_id -__v -createdAt -updatedAt");
    const keys=Object.keys(jobs[0].toObject())
    res.status(200).json({ success: true, data: jobs ,keys:keys });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
