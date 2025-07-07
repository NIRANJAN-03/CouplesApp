// services/api.js
import axios from 'axios';

const API_URL = 'http://192.168.122.189:5000/api/auth'; // Replace with your IP

export const register = (data) => axios.post(`${API_URL}/register`, data);

export const login = (data) => axios.post(`${API_URL}/login`, data);

export const sendOtp = (phone) => axios.post(`${API_URL}/send-otp`, { phone });

// Email OTP verification
export const verifyEmailOtp = (data) => axios.post(`${API_URL}/verify-otp`, data);

// Phone OTP verification (same endpoint handles both phone/email)
export const verifyPhoneOtp = (data) => axios.post(`${API_URL}/verify-otp`, data);

export const getDashboard = (token) =>
  axios.get(`${API_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
