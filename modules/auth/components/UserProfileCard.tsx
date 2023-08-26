import { StyleSheet } from "react-native";
import React from "react";
import { Colors, Image, Text, View } from "react-native-ui-lib";
import { Feather } from "@expo/vector-icons";

const imageUrl =
  "https://foodie.sysco.com/wp-content/uploads/2019/07/MarcusMeansChefProfile_800x850.jpg";

const UserProfileCard = () => {
  return (
    <View style={styles.container}>
      <View row centerV>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        <View marginL-20 marginR-50>
          <Text text80L $textNeutralLight>
            I'm a Waiter
          </Text>
          <Text text65>Carlos Santos</Text>
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
