import axios from 'axios';

export const loginWithFacebook = async (accessToken) => {
  try {
    const res = await axios.post('http://192.168.122.189:5000/api/auth/facebook-login', {
      accessToken,
    });
    return res.data;
  } catch (err) {
    console.error('Facebook login error:', err);
    return { success: false, message: 'Facebook login failed' };
  }
};
