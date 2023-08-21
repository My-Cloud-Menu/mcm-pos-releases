import { StyleSheet } from "react-native";
import { Assets, Colors, ThemeManager } from "react-native-ui-lib";

Colors.loadColors({
  primary: "#002C51",
  primaryLight: "#ffc745",
  secondary: "#9fdb82",
  third: "#fff09c",
  gray: "#50505044",
  grayActive: "#2a2a2a",
  black: "#000",
  white: "#fff",
  green: "#27ae60",
  red: "#c0392b",
  danger: "#c0392b",
  disable: "#f5f5f5",
  titleBackground: "#e0e0e0",
  subtitleBackground: "#abe690",
  graySoft: "rgba(217, 217, 217, 0.3);",
  yellow: "#FFCA28",
});

Assets.loadAssetsGroup("assets", {
  logoMain: require("../../../assets/images/logo.png"),
  arrowBack: require("../../../assets/images/arrow-back.png"),
});

ThemeManager.setComponentTheme("Text", (props, context) => {
  return {
    color: "#131313",
  };
});

ThemeManager.setComponentTheme("Button", (props, context) => {
  console.log("AQUIII", props.variant);

  return styles.Button;
});

const styles = StyleSheet.create({
  Button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
});
