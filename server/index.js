const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables
const formRoutes = require('./routes/formRoutes');

const app = express();

// Middleware
// In production, you might want to restrict this to your Vercel URL, but for now we allow all
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Routes
// Health check route for Render deployment
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running successfully.' });
});

app.use('/api/form', formRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dynamic_forms';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

var PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
