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
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/practicalvault';

connectDB(MONGO_URI);

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.get('/', (req, res) => res.send('PracticalVault Backend'));

app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/practicals', practicalRoutes);

// dev-only helpers
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/dev', devRoutes);
}

// basic error handlers
app.use((req, res, next) => res.status(404).json({ message: 'Not Found' }));
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
