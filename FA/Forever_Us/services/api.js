// services/api.js

import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.122.189:5000/api', // ← Use your local IP here
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
