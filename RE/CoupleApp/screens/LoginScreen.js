import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { login } from '../services/authService';
import { handleGoogleLogin } from '../services/GoogleLogin';

WebBrowser.maybeCompleteAuthSession();

const FB_APP_ID = '3967156820263186';
const GOOGLE_CLIENT_ID = '988498783094-6ur3lrndfd1njck69n1tqict0ktgth12.apps.googleusercontent.com';
const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

const fbDiscovery = {
  authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Facebook Login
  const [fbRequest, fbResponse, promptFacebookLogin] = AuthSession.useAuthRequest(
    {
      clientId: FB_APP_ID,
      redirectUri,
      scopes: ['public_profile', 'email'],
      responseType: 'token',
      useProxy: true,
    },
    fbDiscovery
  );

  // Google Login
  const [googleRequest, googleResponse, promptGoogleLogin] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    redirectUri,
    scopes: ['profile', 'email'],
  });

  // Email/Password Login
  const handleLogin = async () => {
    try {
      await login({ email, password });
      Alert.alert('OTP Sent', 'Check your email for OTP');
      navigation.navigate('OTPScreen', { email });
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.error || 'Login failed');
    }
  };

  // Handle Facebook Login
  useEffect(() => {
    if (fbResponse?.type === 'success') {
      const { access_token } = fbResponse.params;

      axios
        .post('http://192.168.33.189:5000/api/auth/facebook-login', { access_token })
        .then(async (res) => {
          await SecureStore.setItemAsync('token', res.data.token);
          Alert.alert('Success', `Welcome ${res.data.user.name}`);
          navigation.replace('Dashboard');
        })
        .catch(err => {
          Alert.alert('Login failed', err?.response?.data?.error || 'Error');
        });
    }
  }, [fbResponse]);

  // Handle Google Login
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { accessToken } = googleResponse.authentication;
      handleGoogleLogin(accessToken, navigation);
    }
  }, [googleResponse]);

  return (
    <ImageBackground source={require('../assets/bg1.jpg')} style={styles.bg}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <Text style={styles.heading}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Login" onPress={handleLogin} />

        <Text style={styles.or}>OR</Text>

        <View style={styles.socialContainer}>
          {/* Facebook */}
          <TouchableOpacity style={styles.socialButton} onPress={() => promptFacebookLogin()}>
            <Image source={require('../assets/facebook.png')} style={styles.icon} />
          </TouchableOpacity>

          {/* Google */}
          <TouchableOpacity style={styles.socialButton} onPress={() => promptGoogleLogin()}>
            <Image source={require('../assets/google.png')} style={styles.icon} />
          </TouchableOpacity>

          {/* Phone Login */}
          <TouchableOpacity style={styles.socialButton} onPress={() => navigation.navigate('MobileLogin')}>
            <Image source={require('../assets/phone.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          Don't have an account? Register
        </Text>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    width: '85%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
  },
  or: {
    color: 'white',
    fontSize: 16,
    marginVertical: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  link: {
    marginTop: 15,
    color: '#007AFF',
    fontSize: 14,
  },
});
