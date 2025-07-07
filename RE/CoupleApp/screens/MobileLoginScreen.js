// screens/MobileLoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { sendPhoneOtp, verifyPhoneOtp } from '../services/api';

export default function MobileLoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid', 'Please enter a valid phone number');
      return;
    }

    try {
      const res = await axios.post('http://192.168.122.189:5000/api/auth/send-otp', { phone });
      if (res.data.success) {
        Alert.alert('OTP Sent', `OTP sent to ${phone}`);
        setOtpSent(true);
      } else {
        Alert.alert('Error', 'Server did not respond correctly');
      }
    } catch (err) {
      console.log('OTP send error:', err?.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('Invalid', 'Please enter the OTP');
      return;
    }

    try {
      const res = await axios.post('http://192.168.122.189:5000/api/auth/verify-phone-otp', {
        phone,
        otp,
      });

      if (res.data.token) {
        await SecureStore.setItemAsync('token', res.data.token);
        Alert.alert('Login Success', `Welcome ${res.data.user.name}`);
        navigation.replace('Dashboard');
      } else {
        Alert.alert('Error', 'Unexpected response from server');
      }
    } catch (err) {
      console.log('OTP verify error:', err?.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.error || 'Invalid OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.label}>Enter your phone number:</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChangeText={setPhone}
      />
      <Button title="Send OTP" onPress={sendOtp} />

      {otpSent && (
        <>
          <Text style={styles.label}>Enter OTP:</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
          />
          <Button title="Verify OTP" onPress={verifyOtp} />
        </>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 6,
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
});
