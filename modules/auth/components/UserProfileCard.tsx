import { StyleSheet } from "react-native";
import React from "react";
import { Colors, Image, Text, View } from "react-native-ui-lib";
import { Feather } from "@expo/vector-icons";
import useAuthStore from "../AuthStore";

// const imageUrl =
//   "https://foodie.sysco.com/wp-content/uploads/2019/07/MarcusMeansChefProfile_800x850.jpg";

const UserProfileCard = () => {
  const employeeLogged = useAuthStore((state) => state.employeeLogged);

  return (
    <View style={styles.container}>
      <View row centerV>
        <Image
          source={{ uri: employeeLogged?.avatar_url }}
          style={styles.image}
        />

        <View marginL-20 marginR-50>
          <Text text80L $textNeutralLight>
            I'm a Waiter
          </Text>
          <Text text65>{employeeLogged.first_name}</Text>
        </View>
        <Feather name="bell" size={24} color={Colors.grayActive} />
      </View>
    </View>
  );
};

export default UserProfileCard;

const styles = StyleSheet.create({
  container: { maxWidth: "95%", marginBottom: 30 },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});
