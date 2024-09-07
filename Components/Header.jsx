import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "expo-router";
import { auth, db } from "../firebase/Config";
import logoutIcon from "../assets/logout_icon.png";

const Header = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      fetchUserProfile(user.uid);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const userDoc = doc(db, "users", userId);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setName(docSnap.data().userName);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const loadStoredImage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem("profileImage");
        if (storedImage !== null) {
          setImage(storedImage);
        }
      } catch (error) {
        console.error("Error loading stored image:", error);
      }
    };

    loadStoredImage();
  }, []);

  const pickImage = async () => {
    setIsLoading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await AsyncStorage.setItem("profileImage", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@user_id");
      await auth.signOut();
      router.replace("/account/login");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <View style={styles.profileSection}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: image || "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.profileInfo}>Welcome {name}</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Image source={logoutIcon} style={styles.logoutIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ddd",
  },
  profileInfo: {
    marginTop: 10,
    fontSize: 18,
  },
  logoutButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  logoutIcon: {
    width: 30,
    height: 30,
  },
});

export default Header;
