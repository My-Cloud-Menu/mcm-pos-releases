import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>
          🚧 This page is under construction 🚧 {"\n"}We are working on it
        </Text>

        <Link href="/menu" style={styles.link}>
          <Text style={styles.linkText}>Go to Menu screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
