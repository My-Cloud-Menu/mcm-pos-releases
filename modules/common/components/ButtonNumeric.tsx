import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import metrics from "../theme/metrics";
import fonts from "../theme/fonts";
import { Colors } from "react-native-ui-lib";

const ButtonNumeric = ({
  text = "",
  subText = "",
  action,
  customStyles = {},
  image = null,
  backgroundColor = "white",
  onPressBackgroundColor = "rgb(216, 216, 216)",
}) => {
  return (
    <Pressable
      onPress={action}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? onPressBackgroundColor : backgroundColor,
          transform: pressed ? [{ translateY: 2 }] : [{ translateY: 0 }],
        },
        customStyles,
      ]}
    >
      {image ? (
        <Image resizeMode="contain" style={styles.image} source={image} />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 80,
    paddingTop: 4,
    borderWidth: 0.6,
    borderStyle: "solid",
    borderColor: "#14141444",
    borderRadius: 8,
    margin: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: fonts.size.lg,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.black,
    marginHorizontal: 5,
  },
  subtext: {
    fontSize: fonts.size.sm - 3,
    color: "#4C4C4C",
    fontWeight: "normal",
  },
  image: { height: "60%", marginVertical: "10%" },
});

// .login-numericpad-number:active {
//   background-color: rgb(216, 216, 216);
//   transform: translateY(2px);
//   color: #000;
// }
export default ButtonNumeric;
