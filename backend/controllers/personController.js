import Person from '../models/person.js';

export const getPeople = async (req, res) => {
  try {
    const people = await Person.find({ userId: req.userId }).sort('-createdAt');
    res.json({ success: true, data: people });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPerson = async (req, res) => {
  try {
    const person = await Person.create({ ...req.body, userId: req.userId });
    res.status(201).json({ success: true, data: person });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updatePerson = async (req, res) => {
  try {
    const person = await Person.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!person) return res.status(404).json({ message: 'Person not found' });
    res.json({ success: true, data: person });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deletePerson = async (req, res) => {
  try {
    const person = await Person.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!person) return res.status(404).json({ message: 'Person not found' });
    res.json({ success: true, message: 'Person deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
