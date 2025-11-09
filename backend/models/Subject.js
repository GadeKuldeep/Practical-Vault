const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
