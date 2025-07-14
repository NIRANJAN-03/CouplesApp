import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ route, navigation }) {
  const { user } = route.params || {};
  const [profile, setProfile] = useState(user || {});

  useEffect(() => {
    if (!user) {
      Alert.alert('No user found', 'Returning to Dashboard');
      navigation.goBack();
    }
  }, []);

  return (
    <ImageBackground
      source={require('../assets/Splash.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* 🔙 Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.name}>{profile.name || 'No Name'}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{profile.email || '-'}</Text>

          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{profile.phone || '-'}</Text>

          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{profile.age || '-'}</Text>

          <Text style={styles.label}>Gender:</Text>
          <Text style={styles.value}>{profile.gender || '-'}</Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile', { user: profile })}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  container: {
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#111',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#FD5B71',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
