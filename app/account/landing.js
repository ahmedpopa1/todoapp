import Landing from "../../screens/Landing";
import { View, StyleSheet } from "react-native";
export default function Page() {
  return (
    <View style={styles.container}>
      <Landing />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
  },
});
