import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";
import DefaultNavBar from "../../modules/common/components/navigation/DefaultNavBar";

const MenuLayout = () => {
  return (
    <View style={styles.container}>
      <DefaultNavBar />
      <View style={{ flex: 1 }}>
        <Stack >
          <Stack.Screen name="menu" options={{ headerShown: false, contentStyle: { backgroundColor: "#fff" } }} />
        </Stack>
      </View>
    </View>
  );
};

export default MenuLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
  },
});
