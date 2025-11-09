require('dotenv').config();
require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const practicalRoutes = require('./routes/practicalRoutes');
const devRoutes = require('./routes/devRoutes');
const path = require('path');

const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb+srv://gadekuldeep25_db_user:12345@practicals.ecjqqez.mongodb.net/practicalvault';

// connect to MongoDB
connectDB(MONGO_URI);

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// ✅ Strict CORS setup for your Netlify site
app.use(
  cors({
    origin: [
      'https://practical-vault.netlify.app', // your Netlify frontend
      'http://localhost:5173', // allow local dev testing
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// root route
app.get('/', (req, res) => res.send('✅ PracticalVault Backend is running'));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/practicals', practicalRoutes);

// Dev-only helper routes
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/dev', devRoutes);
}

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Not Found' }));

// General error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack || err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
