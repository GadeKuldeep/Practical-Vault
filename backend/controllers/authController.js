const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const loginSchema = Joi.object({ email: Joi.string().email().required(), password: Joi.string().required() });

const generateToken = (admin) => jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;
    // Log attempt for easier debugging in dev
    console.log(`Login attempt for admin: ${email}`);
    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.warn(`Admin not found for email: ${email}`);
      return res.status(401).json({ message: process.env.NODE_ENV === 'production' ? 'Invalid credentials' : 'Invalid credentials - admin not found' });
    }
    const match = await admin.matchPassword(password);
    if (!match) {
      console.warn(`Password mismatch for admin: ${email}`);
      return res.status(401).json({ message: process.env.NODE_ENV === 'production' ? 'Invalid credentials' : 'Invalid credentials - wrong password' });
    }

    const token = generateToken(admin);
    res.json({ admin: { id: admin._id, name: admin.name, email: admin.email }, token });
  } catch (err) {
    console.error('Login error:', err.stack || err);
    next(err);
  }
};

module.exports = { login };
