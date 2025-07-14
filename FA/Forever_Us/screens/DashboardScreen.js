// Forever_Us\screens\DashboardScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';

export default function DashboardScreen({ navigation, route }) {
  const incomingUser = route?.params?.user || null;
  const [user, setUser] = useState(incomingUser);
  const [loading, setLoading] = useState(!incomingUser);

  useEffect(() => {
    const initUser = async () => {
      if (incomingUser) {
        // ✅ New login/registration — overwrite store
        await SecureStore.setItemAsync('foreverus_user', JSON.stringify(incomingUser));
        setUser(incomingUser);
        setLoading(false);
      } else {
        // ✅ Reload — try loading from store
        try {
          const stored = await SecureStore.getItemAsync('foreverus_user');
          if (stored) {
            const parsedUser = JSON.parse(stored);
            setUser(parsedUser);
          } else {
            redirectToLogin();
          }
        } catch (err) {
          console.error('🔴 Failed to load user:', err);
          redirectToLogin();
        } finally {
          setLoading(false);
        }
      }
    };

    initUser();
  }, []);

  const redirectToLogin = () => {
    Alert.alert('Session Expired', 'Please log in again.');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('foreverus_user');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FD5B71" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/Splash.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Welcome to Forever Us 💖</Text>

        <Text style={styles.subtext}>
          Logged in as: {user?.name || user?.phone || user?.email}
        </Text>

        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Profile', { user })}>
            <Ionicons name="person-circle" size={36} color="#FD5B71" />
            <Text style={styles.cardText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Journal')}>
            <Ionicons name="book" size={36} color="#FD5B71" />
            <Text style={styles.cardText}>Journal</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Memories')}>
            <Ionicons name="images" size={36} color="#FD5B71" />
            <Text style={styles.cardText}>Memories</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings" size={36} color="#FD5B71" />
            <Text style={styles.cardText}>Settings</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    paddingTop: 80,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  subtext: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  card: {
    width: 140,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  cardText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#FD5B71',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#FD5B71',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
