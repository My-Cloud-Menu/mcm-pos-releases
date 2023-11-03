import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Slot, Stack } from "expo-router";
import DefaultNavBar from "../../modules/common/components/navigation/DefaultNavBar";
import { Colors } from "react-native-ui-lib";

const MenuLayout = () => {
  return (
    <View style={styles.container}>
      <DefaultNavBar />
      <View style={{ flex: 1, backgroundColor: Colors.graySoft }}>
        <Stack>
          <Stack.Screen name="orders" options={{}} />
          <Stack.Screen
            name="menu"
            options={{
              headerShown: false,
            }}
          />
          {/* <Stack.Screen
            name="home"
            options={{
              headerShown: false,
            }}
          /> */}
          <Stack.Screen
            name="table-selector"
            options={{ title: "Table Selector" }}
          />
          <Stack.Screen
            name="clocksinout"
            options={{ title: "Clock In/Out" }}
          />
          <Stack.Screen name="clockin" options={{ title: "Clock In" }} />
          <Stack.Screen name="settings" options={{ title: "Settings" }} />
        </Stack>
      </View>
    </View>
  );
};

export default MenuLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.graySoft,
    display: "flex",
    flexDirection: "row",
  },
});
