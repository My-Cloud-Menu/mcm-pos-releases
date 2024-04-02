import { StyleSheet } from "react-native";
import React from "react";
import { Colors, Image, Text, View } from "react-native-ui-lib";
import { Feather } from "@expo/vector-icons";
import useAuthStore from "../AuthStore";

const UserProfileCard = () => {
  const employeeLogged = useAuthStore((state) => state.employeeLogged);
  const name = employeeLogged?.first_name || employeeLogged?.middle_name;

  return (
    <View style={styles.container}>
      <View
        row
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <View marginL-20 marginR-50>
          <Text text80L $textNeutralLight>
            I'm a Waiter
          </Text>
          <Text text65>{name || "Guest"}</Text>
        </View>
        <Feather name="bell" size={22} color={Colors.grayActive} />
      </View>
    </View>
  );
};

export default UserProfileCard;

const styles = StyleSheet.create({
  container: { maxWidth: "95%", marginBottom: 5 },
  image: {
    width: 45,
    height: 45,
    borderRadius: 8,
  },
});
