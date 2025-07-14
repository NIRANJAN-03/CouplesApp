// Forever_Us/screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import * as AuthSession from 'expo-auth-session';
import { loginWithFacebook } from '../services/facebookAuth';

const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID;

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleContinue = async () => {
    if (phoneNumber.length < 10) {
      alert('Enter a valid phone number');
      return;
    }

    const fullNumber = `+${callingCode}${phoneNumber}`;

    try {
      const checkRes = await fetch('http://192.168.122.189:5000/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullNumber }),
      });

      const checkData = await checkRes.json();

      if (!checkData.success) {
        Alert.alert(
          'Account Not Found',
          'No account found with this number. Redirecting to Sign Up.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('PhoneNumber', { phone: fullNumber }),
            },
          ]
        );
        return;
      }

      const otpRes = await fetch('http://192.168.122.189:5000/api/auth/send-phone-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullNumber }),
      });

      const otpData = await otpRes.json();

      if (otpData.success) {
        navigation.navigate('OTPVerify', { phone: fullNumber });
      } else {
        alert(otpData.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Phone OTP Error:', error);
      alert('Server error while sending OTP');
    }
  };

  const handleEmailContinue = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Enter a valid email');
      return;
    }

    try {
      const checkRes = await fetch('http://192.168.122.189:5000/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkRes.json();

      if (!checkData.success) {
        Alert.alert(
          'Account Not Found',
          'No account found with this email. Redirecting to Sign Up.',
          [
            {
              text: 'OK',
              onPress: () => {
                setModalVisible(false);
                navigation.navigate('PhoneNumber', { email });
              },
            },
          ]
        );
        return;
      }

      const otpRes = await fetch('http://192.168.122.189:5000/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const otpData = await otpRes.json();

      if (otpData.success) {
        setModalVisible(false);
        navigation.navigate('OTPVerify', { email });
      } else {
        alert(otpData.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Email OTP Error:', error);
      alert('Server error while sending OTP');
    }
  };

  const handleFacebookLogin = async () => {
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

    const result = await AuthSession.startAsync({
      authUrl:
        `https://www.facebook.com/v10.0/dialog/oauth?response_type=token` +
        `&client_id=${FACEBOOK_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}`,
    });

    if (result.type === 'success') {
      const { access_token } = result.params;

      const res = await loginWithFacebook(access_token);
      if (res.success) {
        navigation.navigate('Dashboard', { user: res.user });
      } else {
        alert(res.message || 'Facebook login failed');
      }
    } else {
      alert('Facebook login cancelled');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/Splash.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image source={require('../assets/forever.png')} style={styles.logo} />
        <Text style={styles.title}>Let’s start with your number</Text>

        <View style={styles.inputRow}>
          <CountryPicker
            countryCode={countryCode}
            withCallingCode
            withFlag
            withFilter
            withAlphaFilter={false}
            withEmoji={false}
            flagType="flat"
            onSelect={(country) => {
              setCountryCode(country.cca2);
              setCallingCode(country.callingCode[0]);
            }}
            containerButtonStyle={styles.countryPicker}
            flagButtonStyle={styles.flagButtonStyle}
          />
          <Text style={styles.callingCode}>+{callingCode}</Text>
          <View style={styles.verticalLine} />
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
          />
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity style={styles.socialButton} onPress={() => setModalVisible(true)}>
          <Image source={require('../assets/email.png')} style={styles.icon} />
          <Text style={styles.socialText}>Login with Email</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
          <Image source={require('../assets/facebook.png')} style={styles.icon} />
          <Text style={styles.socialText}>Login with Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialButton}>
          <Image source={require('../assets/google.png')} style={styles.icon} />
          <Text style={styles.socialText}>Login with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('PhoneNumber')}>
          <Text style={styles.signupText}>
            Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Login with Email</Text>
              <TextInput
                placeholder="Enter your email"
                style={styles.modalInput}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity style={styles.modalButton} onPress={handleEmailContinue}>
                <Text style={styles.modalButtonText}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
}


// 👇 Style (unchanged)
const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 8,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    width: '100%',
    marginBottom: 22,
  },
  countryPicker: { marginRight: 6 },
  callingCode: { fontSize: 16, color: '#000', marginRight: 8 },
  verticalLine: { width: 1, height: 40, backgroundColor: '#ccc', marginRight: 8 },
  input: { flex: 1, fontSize: 16, color: '#000' },
  continueButton: {
    backgroundColor: '#FD5B71',
    borderRadius: 30,
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 25,
  },
  continueText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    width: '100%',
  },
  line: { flex: 1, height: 1, backgroundColor: '#aaa' },
  orText: { marginHorizontal: 10, color: '#777', fontSize: 13 },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginBottom: 14,
    width: '100%',
  },
  icon: { width: 22, height: 22, resizeMode: 'contain', marginRight: 12 },
  socialText: { fontSize: 15, color: '#222', paddingHorizontal: 30 },
  signupText: { marginTop: 40, color: '#333', fontSize: 14 },
  signupLink: { color: '#FD5B71', fontWeight: '600' },
  flagButtonStyle: {
    width: 32,
    height: 22,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 14 },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 14,
    padding: 12,
    fontSize: 16,
    marginBottom: 18,
  },
  modalButton: {
    backgroundColor: '#FD5B71',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 12,
  },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalCancelText: { color: '#777', fontSize: 14 },
});