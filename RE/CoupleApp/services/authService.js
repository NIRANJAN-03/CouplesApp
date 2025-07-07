// services/authService.js
import axios from 'axios';

const API_URL = 'http://192.168.33.189:5000/api/auth'; // 🔁 Replace with your backend IP

export const register = (data) => axios.post(`${API_URL}/register`, data);
export const login = (data) => axios.post(`${API_URL}/login`, data);
export const sendOtp = (phone) => axios.post(`${API_URL}/send-otp`, { phone });
export const verifyOtp = (data) => axios.post(`${API_URL}/verify-otp`, data);
export const getDashboard = (token) =>
  axios.get(`${API_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
