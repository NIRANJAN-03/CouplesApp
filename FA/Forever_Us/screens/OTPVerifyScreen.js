// Forever_Us\screens\OTPVerifyScreen.js
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RegistrationProgressBar from './registrations/components/RegistrationProgressBar';

export default function OTPVerifyScreen({ navigation, route }) {
  const { phone, email, fromRegistration } = route.params;

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== '' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (index) => {
    if (otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      alert('Please enter full OTP');
      return;
    }

    try {
      const otpUrl = email
        ? 'http://192.168.122.189:5000/api/auth/verify-email-otp'
        : 'http://192.168.122.189:5000/api/auth/verify-phone-otp';

      const body = email ? { email, otp: enteredOtp } : { phone, otp: enteredOtp };

      const response = await fetch(otpUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        if (fromRegistration) {
          navigation.navigate('Name', { phone });
        } else {
          // ✅ Fetch full user profile from backend
          const profileRes = await fetch('http://192.168.122.189:5000/api/auth/get-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone }),
          });

          const profileData = await profileRes.json();

          if (profileData.success) {
            navigation.navigate('Dashboard', {
              user: profileData.user,
            });
          } else {
            alert('User profile not found');
          }
        }
      } else {
        alert(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP Verify Error:', error);
      alert('Server error during OTP verification');
    }
  };

  const handleResend = () => {
    const url = email
      ? 'http://192.168.122.189:5000/api/auth/send-email-otp'
      : 'http://192.168.122.189:5000/api/auth/send-phone-otp';

    const body = email ? { email } : { phone };

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert('OTP resent');
        } else {
          alert(data.message || 'Failed to resend OTP');
        }
      })
      .catch((err) => {
        console.error('Resend OTP Error:', err);
        alert('Error while resending OTP');
      });
  };

  return (
    <ImageBackground
      source={require('../assets/Splash.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* 🔙 Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      {/* 🚀 Progress Bar */}
      {fromRegistration && (
        <View style={styles.progressBarWrapper}>
          <RegistrationProgressBar step={2} />
        </View>
      )}

      <View style={styles.container}>
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>Please enter the code sent to</Text>
        <Text style={styles.phone}>{phone || email}</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace') {
                  handleBackspace(index);
                }
              }}
            />
          ))}
        </View>

        <Text style={styles.resendText}>
          Didn’t receive OTP?{' '}
          <Text style={styles.resendLink} onPress={handleResend}>
            Resend Code
          </Text>
        </Text>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFEFF1',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  progressBarWrapper: {
    marginTop: 10,
    marginBottom: 40,
    alignItems: 'flex-end',
    marginRight: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
  },
  phone: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
    gap: 15,
  },
  otpInput: {
    width: 55,
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 55 / 2,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  resendText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  resendLink: {
    color: '#FD5B71',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  verifyButton: {
    backgroundColor: '#FD5B71',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 120,
  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
