// Forever_Us/screens/registrations/PhoneNumberScreen.js
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
import CountryPicker from 'react-native-country-picker-modal';
import RegistrationProgressBar from '../registrations/components/RegistrationProgressBar';

export default function PhoneNumberScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('IN');
  const [callingCode, setCallingCode] = useState('91');

  const handleContinue = () => {
    if (phone.length >= 6) {
      const fullPhone = `+${callingCode}${phone}`;
      navigation.navigate('OTPVerify', { phone: fullPhone, fromRegistration: true });
    } else {
      alert('Please enter a valid phone number');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/Splash.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <View style={styles.progressWrapper}>
          <RegistrationProgressBar step={1} totalSteps={6} />
        </View>
      </View>

      <Text style={styles.title}>My Number Is</Text>
      <Text style={styles.subtitle}>
        We'll need your phone number to send an OTP for verification.
      </Text>

      <View style={styles.inputWrapper}>
        <CountryPicker
          withFilter
          withFlag
          withCallingCode
          withEmoji={false}
          countryCode={countryCode}
          onSelect={(country) => {
            setCountryCode(country.cca2);
            setCallingCode(country.callingCode[0]);
          }}
          containerButtonStyle={styles.countryPicker}
        />
        <Text style={styles.plus}>+{callingCode}</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="Enter phone number"
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: '#FFEFF1',
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  progressWrapper: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
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
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  countryPicker: {
    marginRight: 8,
  },
  plus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#fc4b64',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
