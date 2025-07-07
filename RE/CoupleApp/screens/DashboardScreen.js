import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ImageBackground } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { getDashboard } from '../services/api'; // ✅ updated path

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          Alert.alert('Session expired', 'Please login again');
          navigation.replace('Login');
          return;
        }

        const res = await getDashboard(token);
        setUser(res.data);
      } catch (err) {
        console.log('Dashboard error:', err);
        Alert.alert('Error', 'Unable to load user data. Please login again.');
        navigation.replace('Login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.replace('Login');
  };

  return (
    <ImageBackground source={require('../assets/bg3.jpg')} style={styles.bg}>
      <View style={styles.container}>
        <Text style={styles.heading}>Dashboard</Text>
        {loading ? (
          <Text style={styles.text}>Loading...</Text>
        ) : user ? (
          <>
            <Text style={styles.text}>Name: {user.name}</Text>
            <Text style={styles.text}>Email: {user.email || 'Not linked'}</Text>
            <Text style={styles.text}>Phone: {user.phone || 'Not linked'}</Text>
            <View style={{ marginTop: 20 }}>
              <Button title="Logout" onPress={handleLogout} />
            </View>
          </>
        ) : (
          <Text style={styles.text}>User not found</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, resizeMode: 'cover' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'brown',
  },
  text: {
    fontSize: 16,
    color: 'brown',
    marginBottom: 10,
  },
});
