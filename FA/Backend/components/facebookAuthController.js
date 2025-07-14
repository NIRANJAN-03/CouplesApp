const axios = require('axios');

exports.handleFacebookLogin = async (req, res) => {
  const { accessToken } = req.body;

  try {
    // Get user profile from Facebook
    const fbResponse = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const { email, name, id } = fbResponse.data;

    // TODO: Lookup/create user in your database
    const user = { name, email, facebookId: id }; // mock user

    // Respond with user data
    return res.json({ success: true, user });
  } catch (error) {
    console.error('Facebook login backend error:', error.message);
    return res.status(500).json({ success: false, message: 'Facebook login failed' });
  }
};
