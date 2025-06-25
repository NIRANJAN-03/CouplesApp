import { View, Text, Button, StyleSheet } from 'react-native';
import { auth } from '../services/firebaseAuth';
import { signOut } from 'firebase/auth';

export default function Dashboard({ navigation }) {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login'); // Go back to login
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Dashboard</Text>

      {user ? (
        <>
          <Text style={styles.info}>👤 Name: {user.displayName}</Text>
          <Text style={styles.info}>📧 Email: {user.email}</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text style={styles.info}>No user is logged in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
  },
});
