import { StyleSheet } from "react-native";
import { Assets, Colors, ThemeManager } from "react-native-ui-lib";

Colors.loadColors({
  primary: "#002C51",
  primaryLight: "#ffc745",
  secondary: "#9fdb82",
  third: "#fff09c",
  gray: "#757575",
  grayActive: "#2a2a2a",
  black: "#000",
  white: "#fff",
  green: "#27ae60",
  red: "#c0392b",
  danger: "#c0392b",
  disable: "#f5f5f5",
  titleBackground: "#e0e0e0",
  subtitleBackground: "#abe690",
  graySoft: "#f9f8fb",
  yellow: "#FFCA28",
});

Assets.loadAssetsGroup("assets", {
  logoMain: require("../../../assets/images/logo.png"),
  arrowBack: require("../../../assets/images/arrow-back.png"),
});

ThemeManager.setComponentForcedTheme("Button", (props, context) => {
  let themeStyles = styles.Button;

  if (props.variant == "iconButtonWithLabelCenter") {
    themeStyles = {
      ...themeStyles,
      ...styles.iconButtonWithLabelCenter,
    };
  }

  if (props.variant == "iconButtonWithLabelCenter" && props.active) {
    themeStyles = {
      ...themeStyles,
      ...styles.iconButtonWithLabelCenterActive,
    };
  }

  if (props.variant == "iconButtonWithLabelCenterOutline") {
    themeStyles = {
      ...themeStyles,
      ...styles.iconButtonWithLabelCenterOutline,
    };
  }

  if (props.variant == "iconButtonWithLabelCenterOutline" && props.active) {
    themeStyles = {
      ...themeStyles,
      ...styles.iconButtonWithLabelCenterOutlineActive,
    };
  }

  if (props.useMinSize) {
    themeStyles = {
      ...themeStyles,
      ...styles.useMinSize,
    };
  }

  return { style: { ...themeStyles, ...props.style } };
});

const styles = StyleSheet.create({
  Button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 0,
  },
  iconButtonWithLabelCenter: {
    backgroundColor: "transparent",
    display: "flex",
    flexDirection: "column",
    borderRadius: 10,
    paddingVertical: 11,
    width: 65,
  },

  iconButtonWithLabelCenterActive: {
    backgroundColor: Colors.primary,
    color: "#000",
    display: "flex",
    flexDirection: "column",
    borderRadius: 10,
  },
  iconButtonWithLabelCenterOutline: {
    backgroundColor: Colors.white,
    display: "flex",
    flexDirection: "column",
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  iconButtonWithLabelCenterOutlineActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.rgba(Colors.primary, 0.06),
  },
  useMinSize: {
    paddingVertical: 4,
    paddingHorizontal: 5,
  },
});
