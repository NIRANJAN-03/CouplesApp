import React, { useState } from 'react';
import {
  View, Text, TextInput, Button, StyleSheet, Alert,
  ImageBackground, KeyboardAvoidingView, Platform
} from 'react-native';
import { register } from '../services/authService';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    try {
      await register(form);
      Alert.alert('Success', 'Registered successfully');
      navigation.replace('Login');
    } catch (err) {
      Alert.alert('Error', err?.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <ImageBackground source={require('../assets/bg2.jpg')} style={styles.bg}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <Text style={styles.heading}>Register</Text>
        <TextInput style={styles.input} placeholder="Name" onChangeText={t => handleChange('name', t)} />
        <TextInput style={styles.input} placeholder="Email" onChangeText={t => handleChange('email', t)} />
        <TextInput style={styles.input} placeholder="Phone" keyboardType="numeric" onChangeText={t => handleChange('phone', t)} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={t => handleChange('password', t)} />
        <Button title="Register" onPress={handleRegister} />
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'white' },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
  },
  link: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 14,
  },
});
