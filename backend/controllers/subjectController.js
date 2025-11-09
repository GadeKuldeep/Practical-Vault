const Joi = require('joi');
const Subject = require('../models/Subject');

const schema = Joi.object({ title: Joi.string().min(1).required(), description: Joi.string().allow('', null) });

const listSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.json(subjects);
  } catch (err) { next(err); }
};

const createSubject = async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const sub = await Subject.create(value);
    res.status(201).json(sub);
  } catch (err) { next(err); }
};

const updateSubject = async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const sub = await Subject.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Subject not found' });
    sub.title = value.title;
    sub.description = value.description || '';
    await sub.save();
    res.json(sub);
  } catch (err) { next(err); }
};

const deleteSubject = async (req, res, next) => {
  try {
    const sub = await Subject.findById(req.params.id);
    if (!sub) return res.status(404).json({ message: 'Subject not found' });

    // remove related practicals first to avoid orphan documents
    const Practical = require('../models/Practical');
    try {
      await Practical.deleteMany({ subject: sub._id });
    } catch (e) {
      // log but continue to attempt subject removal
      console.error('Failed to delete related practicals:', e.message || e);
    }

    // use findByIdAndDelete for a single call (safer in some mongoose versions)
    await Subject.findByIdAndDelete(sub._id);
    res.json({ message: 'Subject and its practicals removed' });
  } catch (err) {
    console.error('deleteSubject error:', err.stack || err);
    next(err);
  }
};

module.exports = { listSubjects, createSubject, updateSubject, deleteSubject };
