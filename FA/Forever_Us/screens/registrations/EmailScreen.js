import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function EmailScreen({ navigation, route }) {
  const { name, phone } = route.params || {}; // ✅ Get both name and phone
  const [email, setEmail] = useState('');

  const handleContinue = () => {
    if (!email.trim() || !email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    // ✅ Pass all data forward
    navigation.navigate('Age', { name, phone, email });
  };

  return (
    <ImageBackground
      source={require('../../assets/Splash.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.progressWrapper}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFilled, { width: '49.8%' }]} />
        </View>
      </View>

      <Text style={styles.title}>Email Address</Text>
      <Text style={styles.subtitle}>We’ll send a verification link to your email.</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

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
  progressBar: {
    height: 6,
    backgroundColor: '#FADCE2',
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressFilled: {
    backgroundColor: '#FD5B71',
    height: '100%',
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
  input: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 40,
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
