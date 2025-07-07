// CoupleApp\services\FacebookLogin.js
import React, { useEffect } from 'react';
import { Button, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = '3967156820263186';
const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

const discovery = {
  authorizationEndpoint: 'https://www.facebook.com/v13.0/dialog/oauth',
  tokenEndpoint: 'https://graph.facebook.com/v13.0/oauth/access_token',
};

export default function FacebookLogin({ navigation }) {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: FB_APP_ID,
      redirectUri,
      scopes: ['public_profile', 'email'],
      responseType: 'token',
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;

      axios
        .post('http://192.168.33.189:5000/api/auth/facebook-login', { access_token })
        .then(res => {
          Alert.alert('Welcome', res.data.user.name);
          navigation.replace('Dashboard');
        })
        .catch(err => {
          Alert.alert('Login failed', err?.response?.data?.error || 'Error');
        });
    }
  }, [response]);

  return (
    <Button
      title="Continue with Facebook"
      onPress={() => promptAsync()}
      disabled={!request}
    />
  );
}
