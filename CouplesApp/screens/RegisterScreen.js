import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/firebaseAuth"; // use named export

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      console.log("Display Name Set:", auth.currentUser.displayName);
      Alert.alert("Registration Successful!");

      if (navigation && navigation.navigate) {
        navigation.navigate("Dashboard");
      } else {
        console.warn("Navigation not available");
      }
    } catch (err) {
      console.error("Registration Error:", err.message);

      if (err.code === "auth/email-already-in-use") {
        setError("This email is already in use. Try logging in.");
      } else {
        setError(err.message);
      }
    }
  };

  const goToLogin = () => {
    if (navigation) {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        style={styles.textInput}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.textInput}
      />

      <Button title="Register" onPress={handleRegister} />
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text onPress={goToLogin} style={{ marginVertical: 10 }}>
        Already have an account? Login here
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    width: 200,
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
});
