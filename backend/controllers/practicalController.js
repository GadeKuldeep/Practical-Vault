const Joi = require('joi');
const Practical = require('../models/Practical');

const schema = Joi.object({ title: Joi.string().min(1).required(), description: Joi.string().allow('', null), code: Joi.string().allow('', null), tags: Joi.array().items(Joi.string()).optional(), subject: Joi.string().required() });

const listBySubject = async (req, res, next) => {
  try {
    const practicals = await Practical.find({ subject: req.params.id }).sort({ createdAt: -1 });
    res.json(practicals);
  } catch (err) { next(err); }
};

const createPractical = async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const p = await Practical.create(value);
    res.status(201).json(p);
  } catch (err) { next(err); }
};

const updatePractical = async (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    const p = await Practical.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Practical not found' });
    p.title = value.title;
    p.description = value.description || '';
    p.code = value.code || '';
    p.tags = value.tags || [];
    await p.save();
    res.json(p);
  } catch (err) { next(err); }
};

const deletePractical = async (req, res, next) => {
  try {
    const p = await Practical.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Practical not found' });
    await p.remove();
    res.json({ message: 'Practical removed' });
  } catch (err) { next(err); }
};

module.exports = { listBySubject, createPractical, updatePractical, deletePractical };
