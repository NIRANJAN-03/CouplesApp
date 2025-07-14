import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';

// Main screens
import LoginScreen from './screens/LoginScreen';
import OTPVerifyScreen from './screens/OTPVerifyScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';

// Registration screens
import PhoneNumberScreen from './screens/registrations/PhoneNumberScreen';
import NameScreen from './screens/registrations/NameScreen';
import EmailScreen from './screens/registrations/EmailScreen';
import AgeScreen from './screens/registrations/AgeScreen';
import GenderScreen from './screens/registrations/GenderScreen';
import PasswordScreen from './screens/registrations/PasswordScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const stored = await SecureStore.getItemAsync('foreverus_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setInitialRoute('Dashboard');
        } else {
          setInitialRoute('Login');
        }
      } catch (error) {
        console.error('❌ Error loading user:', error);
        setInitialRoute('Login');
      }
    };

    checkUserSession();
  }, []);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FD5B71" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        {/* Login Flow */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTPVerify" component={OTPVerifyScreen} />

        {/* Registration Flow */}
        <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="Email" component={EmailScreen} />
        <Stack.Screen name="Age" component={AgeScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="PasswordScreen" component={PasswordScreen} />

        {/* Dashboard */}
        <Stack.Screen name="Dashboard">
          {(props) => <DashboardScreen {...props} user={user} />}
        </Stack.Screen>

        {/* Profile */}
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
