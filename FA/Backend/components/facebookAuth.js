// backend/components/facebookAuth.js
const axios = require('axios');

async function verifyFacebookToken(accessToken) {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/me?access_token=${accessToken}&fields=id,name,email,picture`
    );
    return { success: true, user: response.data };
  } catch (error) {
    console.error('Facebook token verification failed:', error.response?.data || error.message);
    return { success: false, message: 'Invalid Facebook token' };
  }
}

module.exports = verifyFacebookToken;
