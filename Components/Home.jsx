import React, { useState, useEffect } from "react";
import { View, StyleSheet, ImageBackground, ScrollView } from "react-native";
import Header from "./Header";
import AddTask from "./AddTask";
import TaskList from "./TaskList";
import { getAuth } from "firebase/auth";

const HomePage = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      setUserName(user.displayName || "User");
      setUserImage(user.photoURL || null);
    } else {
      console.log("No user is signed in");
    }
    setIsLoading(false);
  }, []);
  
  return (
    <ImageBackground
      source={require("../assets/home.jpg")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Header image={userImage} isLoading={isLoading} name={userName} />
        <View style={styles.content}>
          <AddTask userId={userId} />
          <TaskList userId={userId} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    padding: 10,
  },
});

export default HomePage;
