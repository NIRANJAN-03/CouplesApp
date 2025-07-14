import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import RegistrationProgressBar from './components/RegistrationProgressBar';

export default function GenderScreen({ navigation, route }) {
  const { name, email, phone, age } = route.params || {};
  const [selectedGender, setSelectedGender] = useState(null);

  useEffect(() => {
    console.log('🧾 Received params:', { name, email, phone, age });
  }, []);

  const handleSelect = (gender) => {
    setSelectedGender(gender);
  };

  const handleContinue = () => {
    if (!selectedGender) {
      Alert.alert('Missing Info', 'Please select your gender');
      return;
    }

    if (!name || !age || (!email && !phone)) {
      Alert.alert('Missing Data', 'Some user details are incomplete');
      return;
    }

    navigation.navigate('PasswordScreen', {
      name,
      email,
      phone,
      age,
      gender: selectedGender,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/Splash.png')}
      style={styles.container}
      resizeMode="cover"
    >
      {/* 🔙 Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      {/* 🚀 Progress Bar */}
      <View style={styles.progressBar}>
        <RegistrationProgressBar step={5} />
      </View>

      <Text style={styles.title}>What’s Your Gender?</Text>
      <Text style={styles.subtitle}>Tell us about your gender</Text>

      <View style={styles.genderOptions}>
        {['Male', 'Female'].map((gender) => {
          const isSelected = selectedGender === gender;
          const iconName = gender === 'Male' ? 'mars' : 'venus';

          return (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderCircle,
                isSelected ? styles.selectedCircle : styles.unselectedCircle,
              ]}
              onPress={() => handleSelect(gender)}
            >
              <FontAwesome5
                name={iconName}
                size={30}
                color={isSelected ? '#fff' : '#000'}
              />
              <Text
                style={[
                  styles.genderText,
                  isSelected && { color: '#fff' },
                ]}
              >
                {gender}
              </Text>
            </TouchableOpacity>
          );
        })}
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
  progressBar: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  genderOptions: {
    alignItems: 'center',
    gap: 40,
    marginBottom: 60,
  },
  genderCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    backgroundColor: '#FD5B71',
  },
  unselectedCircle: {
    backgroundColor: '#eee',
  },
  genderText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  continueBtn: {
    backgroundColor: '#FD5B71',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
