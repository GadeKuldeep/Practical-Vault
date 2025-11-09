const mongoose = require('mongoose');

const practicalSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  code: { type: String, default: '' },
  tags: [{ type: String }],
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Practical', practicalSchema);
