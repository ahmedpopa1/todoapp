import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/Config";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import loginImage from "../assets/login.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        AsyncStorage.removeItem("user");
      }
    });

    return () => {
      unsub();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const credentials = await login(email, password);
      console.log("credentials", credentials);
      const id = auth.currentUser.uid;
      storeUser(id);
      if (email.includes("@admin")) {
        router.replace("/account/adminhome");
      } else {
        router.replace("/account/Home");
      }
    } catch (error) {
      console.log("error", JSON.stringify(error));
      setError(error);
      setLoginError("Invalid email or password.");
    }
  };

  const storeUser = async (userId) => {
    try {
      await AsyncStorage.setItem("@user_id", userId);
    } catch (error) {
      console.error("Error storing user ID:", error);
    }
  };

  return (
    <ImageBackground source={loginImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.header}>Login</Text>
        <Text style={styles.label}>Email :</Text>
        <TextInput
          placeholder="e.g: example@something.com"
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
        {loginError ? <Text style={styles.error}>{loginError}</Text> : null}
        <TouchableOpacity
          onPress={() => router.replace("/account/forget")}
          style={styles.forgotButton}
        >
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate("/account/register")}
          style={styles.registerButton}
        >
          <Text style={styles.registerText}>Register</Text>
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
    padding: 80,
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
  forgotButton: {
    alignSelf: "flex-start",
    marginLeft: "15%",
    marginBottom: 10,
    cursor: "pointer",
  },
  forgotText: {
    color: "white",
    fontSize: 18,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 22,
    width: 150,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  registerButton: {
    marginTop: 20,
    marginLeft: 5,
  },
  registerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
  },
  additionalInfo: {
    marginTop: 20,
    alignItems: "center",
  },
  additionalText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default Login;
