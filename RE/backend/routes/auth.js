const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');
const pool = require('../db');
require('dotenv').config();

const otpStore = {}; // For temporary OTP storage

// -------------------- Nodemailer Setup --------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// -------------------- Register --------------------
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users(name, email, password, phone) VALUES($1, $2, $3, $4) RETURNING id, name, email, phone',
      [name, email, hashed, phone]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// -------------------- Email Login + OTP (Sent to Email) --------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, userId: user.id, timestamp: Date.now() };

    await transporter.sendMail({
      from: `"CouplesApp Login" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP is: ${otp}`,
    });

    console.log(`✅ Email OTP ${otp} sent to ${email}`);
    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// -------------------- Verify Email OTP --------------------
router.post('/verify-email-otp', async (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore[email];
  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  try {
    const result = await pool.query('SELECT id, name, email, phone FROM users WHERE id = $1', [stored.userId]);
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    delete otpStore[email]; // clear OTP
    res.json({ token, user });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// -------------------- Send OTP to Phone --------------------
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[phone] = { otp, timestamp: Date.now() };

  console.log(`📱 Phone OTP ${otp} sent to ${phone}`);
  return res.json({ success: true, message: `OTP sent to ${phone}` });
});

// -------------------- Verify Phone OTP --------------------
router.post('/verify-phone-otp', async (req, res) => {
  const { phone, otp } = req.body;
  const stored = otpStore[phone];
  if (!stored || stored.otp !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  try {
    let user = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);

    if (user.rows.length === 0) {
      const insert = await pool.query(
        'INSERT INTO users (name, phone) VALUES ($1, $2) RETURNING *',
        ['User', phone]
      );
      user = insert;
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    delete otpStore[phone];
    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        phone: user.rows[0].phone,
        email: user.rows[0].email || null,
      },
    });
  } catch (err) {
    console.error('Phone OTP verification error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// -------------------- Facebook Login --------------------
router.post('/facebook-login', async (req, res) => {
  const { access_token } = req.body;
  try {
    const appAccessToken = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`;

    const debugRes = await axios.get(`https://graph.facebook.com/debug_token`, {
      params: { input_token: access_token, access_token: appAccessToken },
    });

    const isValid = debugRes.data?.data?.is_valid;
    if (!isValid) return res.status(401).json({ error: 'Invalid Facebook token' });

    const fbRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${access_token}`
    );
    const { name, email } = fbRes.data;

    if (!email) return res.status(400).json({ error: 'Email permission not granted' });

    let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      const insert = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
      user = insert;
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        phone: user.rows[0].phone || null,
      },
    });
  } catch (err) {
    console.error('Facebook login error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Facebook login failed' });
  }
});

// -------------------- Google Login --------------------
router.post('/google-login', async (req, res) => {
  const { access_token } = req.body;

  try {
    const googleRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
    );

    const { name, email } = googleRes.data;
    if (!email) return res.status(400).json({ error: 'Email not received from Google' });

    let user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      const insert = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
      );
      user = insert;
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email,
        phone: user.rows[0].phone || null,
      },
    });
  } catch (err) {
    console.error('Google login error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Google login failed' });
  }
});

// -------------------- Protected Dashboard Route --------------------
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalid' });
    req.user = user;
    next();
  });
};

router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, phone FROM users WHERE id = $1', [
      req.user.id,
    ]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

module.exports = router;
