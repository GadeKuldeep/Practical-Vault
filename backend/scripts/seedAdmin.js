// Small script to create an initial admin user for development
require('dotenv').config()
const connectDB = require('../config/db')
const Admin = require('../models/Admin')

// allow falling back to a local default for convenience during development
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/practicalvault'
if (!process.env.MONGO_URI) {
  console.warn('MONGO_URI not set in .env — falling back to local mongodb://localhost:27017/practicalvault for this run')
}

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set in .env — tokens will be signed with an empty secret which is insecure. Set JWT_SECRET in production.')
}

const DEFAULT = {
  name: 'Practical Admin',
  email: 'admin@example.com',
  password: 'Password1234!'
}

const seed = async () => {
  try {
    await connectDB(MONGO_URI)
    const exists = await Admin.findOne({ email: DEFAULT.email })
    if (exists) {
      console.log('Admin already exists:', DEFAULT.email)
      process.exit(0)
    }

    const admin = new Admin(DEFAULT)
    await admin.save()
    console.log('Created admin:')
    console.log('  email:', DEFAULT.email)
    console.log('  password:', DEFAULT.password)
    console.log('\nPlease change the password after first login or remove this script in production.')
    process.exit(0)
  } catch (err) {
    console.error('Failed to seed admin:', err.message)
    process.exit(1)
  }
}

seed()
