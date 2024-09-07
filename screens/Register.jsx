import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { register } from "../firebase/auth";
import { db } from "../firebase/Config";
import { collection, doc, setDoc, getDocs } from "firebase/firestore"; 
import regImage from "../assets/reg.jpg";
import { router } from "expo-router";

const Register = () => {
  const [userName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  const handlePress = async () => {
    try {
      const trimmedUserName = userName.trim();
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      const trimmedPhone = phone.trim();

      if (!validateInputs()) return;

      const credentials = await register(trimmedEmail, trimmedPassword);
      const userId = credentials.user.uid;

      await setDoc(doc(db, "users", userId), {
        userName: trimmedUserName,
        email: trimmedEmail,
        phone: trimmedPhone,
      });

      const tasksRef = collection(db, "users", userId, "tasks");
      const tasksSnapshot = await getDocs(tasksRef); 

      if (tasksSnapshot.empty) {
        await setDoc(doc(tasksRef, "sample-task"), {
          title: "Sample Task",
          description: "This is an example of a high-priority task.",
          due_date: new Date(),
          priority: "high",
          status: "pending",
        });
      }

      console.log("User registered and tasks setup completed.");
      router.replace(`/account/login`); 
    } catch (error) {
      console.log("Registration error:", JSON.stringify(error));
      setError("Registration failed. Please try again.");
    }
  };

  const validateInputs = () => {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  return (
    <ImageBackground source={regImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.header}>Register</Text>
        <Text style={styles.label}>Name :</Text>
        <TextInput
          placeholder="Name"
          value={userName}
          onChangeText={setName}
          style={styles.input}
        />
        <Text style={styles.label}>Phone :</Text>
        <TextInput
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />
        <Text style={styles.label}>Email :</Text>
        <TextInput
          placeholder="e.g : example@something.com"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <Text style={styles.label}>Password :</Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/account/login")}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  header: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 5,
  },
  label: {
    alignSelf: "flex-start",
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginLeft: "15%",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  input: {
    width: "70%",
    height: 40,
    borderBottomWidth: 3,
    borderBottomColor: "white",
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "white",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 22,
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  loginLink: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
  error: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
});

export default Register;