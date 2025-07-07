// CoupleApp\services\GoogleLogin.js
// services/GoogleLogin.js
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

export const handleGoogleLogin = async (accessToken, navigation) => {
  try {
    const res = await axios.post('http://192.168.33.189:5000/api/auth/google-login', {
      access_token: accessToken,
    });

    await SecureStore.setItemAsync('token', res.data.token);
    Alert.alert('Success', `Welcome ${res.data.user.name}`);
    navigation.replace('Dashboard');
  } catch (err) {
    Alert.alert('Login failed', err?.response?.data?.error || 'Google login failed');
  }
};
