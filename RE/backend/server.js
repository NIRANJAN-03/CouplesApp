require('dotenv').config(); // Load environment variables early

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Check required env variables
const requiredEnv = ['EMAIL_USER', 'EMAIL_PASS', 'JWT_SECRET', 'FACEBOOK_APP_ID', 'FACEBOOK_APP_SECRET'];
requiredEnv.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Warning: Missing required env variable ${key}`);
  }
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});