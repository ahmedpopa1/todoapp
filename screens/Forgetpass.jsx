import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { forget } from "../firebase/auth";
import yourImage from "../assets/forgetpass.png";

const ForgetPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    try {
      await forget(email);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.replace("/account/login")}
        style={styles.backButton}
      >
        <Text style={styles.buttonText}>Back</Text>
      </Pressable>
      <Image source={yourImage} style={styles.image} />
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email.."
          onChangeText={setEmail}
          value={email}
        />
        <TouchableOpacity style={styles.confirm} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F7F7F7",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: 400,
    height: 300,
    alignItems: "center",
    elevation: 5,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: "15%",
    marginTop: "15%",
  },
  input: {
    width: "70%",
    height: 50,
    borderBottomWidth: 3,
    borderBottomColor: "black",
    paddingHorizontal: 10,
    marginTop: "25%",
    marginBottom: "3%",
    color: "#474745",
  },
  confirm: {
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 22,
    backgroundColor: "black",
  },
});

export default ForgetPasswordPage;
