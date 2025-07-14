// Backend\controllers\authController.js
const nodemailer = require('nodemailer');
const db = require('../db'); // PostgreSQL connection
const bcrypt = require('bcrypt');
require('dotenv').config();

let emailOtps = {};
let phoneOtps = {};

// 📧 Send OTP to Email
exports.sendEmailOTP = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  emailOtps[email] = otp;

  console.log(`📨 Sending OTP ${otp} to email: ${email}`);

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `Forever Us <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Forever Us OTP Code',
      text: `Your OTP is: ${otp}`,
    });

    console.log('✅ Email sent:', info.response);
    res.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.error('❌ Email send error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP email' });
  }
};

// ✅ Verify Email OTP
exports.verifyEmailOTP = (req, res) => {
  const { email, otp } = req.body;

  console.log(`🔍 Verifying email OTP for ${email}: entered = ${otp}, expected = ${emailOtps[email]}`);

  if (emailOtps[email] == otp) {
    delete emailOtps[email];
    console.log(`✅ Email OTP verified for ${email}`);
    return res.json({ success: true });
  }

  console.warn(`❌ Invalid email OTP for ${email}`);
  res.status(400).json({ success: false, message: 'Invalid OTP' });
};

// 📱 Send OTP to Phone
exports.sendPhoneOTP = (req, res) => {
  const { phone } = req.body;

  if (!phone || phone.length < 10) {
    return res.status(400).json({ success: false, message: 'Invalid phone number' });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  phoneOtps[phone] = otp;

  console.log(`📱 Phone OTP for ${phone}: ${otp}`);
  res.json({ success: true, message: 'OTP sent to phone (logged in terminal)' });
};

// ✅ Verify Phone OTP
exports.verifyPhoneOTP = (req, res) => {
  const { phone, otp } = req.body;

  console.log(`🔍 Verifying phone OTP for ${phone}: entered = ${otp}, expected = ${phoneOtps[phone]}`);

  if (phoneOtps[phone] == otp) {
    delete phoneOtps[phone];
    console.log(`✅ Phone OTP verified for ${phone}`);
    return res.json({ success: true });
  }

  console.warn(`❌ Invalid phone OTP for ${phone}`);
  res.status(400).json({ success: false, message: 'Invalid OTP' });
};

// 🔍 Check if user exists (by phone or email)
exports.checkUserExists = async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ success: false, message: 'Email or phone required' });
  }

  try {
    const query = email
      ? `SELECT * FROM users WHERE email ILIKE $1 LIMIT 1`
      : `SELECT * FROM users WHERE phone = $1 LIMIT 1`;

    const values = [email || phone];
    const result = await db.query(query, values);

    if (result.rowCount > 0) {
      return res.json({ success: true, user: result.rows[0] });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('❌ Check user error:', error);
    res.status(500).json({ success: false, message: 'Server error checking user' });
  }
};

// 🔄 Create or Update User Details
exports.updateUserDetails = async (req, res) => {
  const { email, name, age, gender, phone, password } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ success: false, message: 'Email or phone is required' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const login_time = new Date();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Check if user exists
    const checkQuery = email
      ? 'SELECT * FROM users WHERE email ILIKE $1 LIMIT 1'
      : 'SELECT * FROM users WHERE phone = $1 LIMIT 1';

    const checkResult = await db.query(checkQuery, [email || phone]);

    if (checkResult.rows.length > 0) {
      // 2. Update user
      const updateQuery = `
        UPDATE users
        SET
          name = COALESCE($1, name),
          age = COALESCE($2, age),
          gender = COALESCE($3, gender),
          password = $4,
          login_time = $5
        WHERE ${email ? 'email ILIKE $6' : 'phone = $6'}
        RETURNING *;
      `;

      const updateValues = [name, age, gender, hashedPassword, login_time, email || phone];
      const result = await db.query(updateQuery, updateValues);

      return res.json({ success: true, message: 'User updated', user: result.rows[0] });
    } else {
      // 3. Insert new user
      const insertQuery = `
        INSERT INTO users (name, email, phone, age, gender, password, login_time)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;

      const insertValues = [name, email, phone, age, gender, hashedPassword, login_time];
      const insertResult = await db.query(insertQuery, insertValues);

      return res.json({ success: true, message: 'User created', user: insertResult.rows[0] });
    }
  } catch (err) {
    console.error('❌ User save error:', err);
    res.status(500).json({ success: false, message: 'Server error while saving user' });
  }
};

// 🧠 Get full user details (for OTPVerifyScreen)
exports.getUser = async (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({ success: false, message: 'Email or phone is required' });
  }

  try {
    const query = email
      ? 'SELECT * FROM users WHERE email ILIKE $1 LIMIT 1'
      : 'SELECT * FROM users WHERE phone = $1 LIMIT 1';

    const values = email ? [email] : [phone];

    const result = await db.query(query, values);

    if (result.rows.length > 0) {
      return res.json({ success: true, user: result.rows[0] });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching user' });
  }
};
