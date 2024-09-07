import { StyleSheet } from "react-native";
import Landing from "../screens/Landing";
import React from "react";

export default function Page() {
  return <Landing/>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
});
