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
import RegistrationProgressBar from './components/RegistrationProgressBar';

export default function NameScreen({ navigation, route }) {
  const { email, phone } = route.params || {}; // ✅ Get email or phone from previous screen
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (!name.trim()) {
      alert('Please enter your name');
      return;
    }

    // ✅ Navigate to Age screen with name + email/phone
    navigation.navigate('Email', { name, email, phone });
  };

  return (
    <ImageBackground
      source={require('../../assets/Splash.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <View style={styles.progressWrapper}>
        <RegistrationProgressBar step={3} />
      </View>

      <Text style={styles.title}>Your Name</Text>
      <Text style={styles.subtitle}>Please enter your full name.</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
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
    marginTop: -10,
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
