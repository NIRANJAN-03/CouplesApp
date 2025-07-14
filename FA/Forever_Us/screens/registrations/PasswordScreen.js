// Forever_Us\screens\registrations\PasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RegistrationProgressBar from './components/RegistrationProgressBar';
import API from '../../services/api';
import * as SecureStore from 'expo-secure-store';

export default function PasswordScreen({ navigation, route }) {
  const { name, email, age, phone, gender } = route.params;
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Toggle state

  const handleContinue = async () => {
    if (!password || password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return;
    }

    if (!email && !phone) {
      Alert.alert('Missing Info', 'Phone or email is required to register');
      return;
    }

    try {
      const res = await API.post('/auth/update-user', {
        name,
        email,
        phone,
        age,
        gender,
        password,
      });

      const user = res.data.user;
      console.log('✅ User saved:', user);

      await SecureStore.setItemAsync('foreverus_user', JSON.stringify(user));

      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard', params: { user } }],
      });
    } catch (error) {
      console.error('❌ Registration error:', error.message);
      console.log('❗️Error details:', error.response?.data || error);

      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', error.message || 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/Splash.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <View style={styles.progressWrapper}>
        <RegistrationProgressBar step={6} />
      </View>

      <Text style={styles.title}>Create Password</Text>
      <Text style={styles.subtitle}>Secure your account with a strong password.</Text>

      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#aaa"
          secureTextEntry={!showPassword} // 👈 Control visibility
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <Ionicons
            name={showPassword ? 'eye' : 'eye-off'}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    backgroundColor: '#FFEFF1',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  progressWrapper: {
    marginBottom: 40,
    marginTop: -3,
    marginLeft: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 4,
    marginBottom: 40,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    paddingVertical: 14,
  },
  eyeIcon: {
    paddingLeft: 10,
  },
  continueBtn: {
    backgroundColor: '#FD5B71',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
