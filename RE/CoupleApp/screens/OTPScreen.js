import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert,
  ImageBackground, KeyboardAvoidingView, Platform
} from 'react-native';
import { verifyOtp } from '../services/authService';
import * as SecureStore from 'expo-secure-store';

export default function OTPScreen({ route, navigation }) {
  const { email } = route.params;
  const [otp, setOtp] = useState('');

  const handleVerifyOtp = async () => {
    try {
      const res = await verifyOtp({ email, otp });

      // Save token
      await SecureStore.setItemAsync('token', res.data.token);

      Alert.alert('Success', `Welcome ${res.data.user.name}`);
      navigation.replace('Dashboard');
    } catch (err) {
      console.log('OTP error:', err?.response?.data || err.message);
      Alert.alert('Error', 'OTP verification failed');
    }
  };

  return (
    <ImageBackground source={require('../assets/bg2.jpg')} style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <Text style={styles.heading}>Enter OTP sent to {email}</Text>
        <TextInput
          style={styles.input}
          placeholder="6-digit OTP"
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
        />
        <Button title="Verify OTP" onPress={handleVerifyOtp} />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: 'white', textAlign: 'center' },
  input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#ccc', backgroundColor: 'white', borderRadius: 5, marginBottom: 15 },
});
