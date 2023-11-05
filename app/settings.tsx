import { Pressable, StyleSheet } from "react-native";
import React from "react";
import SettingsScreen from "../modules/settings/components/SettingsScreen";
import { Text, View } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Settings = () => {
  return (
    <View flex>
      <View row centerV marginL-10>
        <Ionicons
          name="arrow-back"
          size={50}
          color="#000"
          onPress={() => router.back()}
        />
        <Text>Volver</Text>
      </View>
      <SettingsScreen />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({});
