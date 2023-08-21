import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Colors, Text } from "react-native-ui-lib";
import { shadowProps } from "../theme/shadows";

const ButtonsBar = ({
  button1Icon = <FontAwesome5 name="chair" size={30} color="black" />,
  button1Action = null,
  button1Title = "Home",
  button2Icon = <AntDesign name="appstore1" size={30} color="black" />,
  button2Title = "Menu",
  button2Action = null,
  button3Icon = <MaterialIcons name="add" size={60} color="#fff" />,
  button3Action = null,
  button4Icon = <SimpleLineIcons name="note" size={30} color="black" />,
  button4Action = null,
  button4Title = "Checks",
  button5Icon = <MaterialIcons name="insert-chart" size={32} color="black" />,
  button5Action = null,
  button5Title = "Dashb.",
}) => {
  //   const navigation = useNavigation();
  //   const router = useRoute();

  //   const { setShowTableSelectorModal } = useCheckoutStore(
  //     (state) => state.tables
  //   );

  const pathname = usePathname();

  const button1DefaultAction = () => router.push("/Tables");
  const button2DefaultAction = () => {
    // setShowTableSelectorModal(true);
    router.push("/Menu");
  };
  const button3DefaultAction = () => {
    // setShowTableSelectorModal(true);
    router.push("/Menu");
  };
  const button4DefaultAction = () => {
    // setShowTableSelectorModal(true);

    router.push("/Newcheck");
  };
  const button5DefaultAction = () => router.push("/Dashboard");

  const isPathSelected = (buttonTitle: string) => {
    switch (buttonTitle) {
      case "Home":
        buttonTitle = "Tables";
        break;
      case "Checks":
        buttonTitle = "Newcheck";
        break;

      case "Dashb.":
        buttonTitle = "Dashboard";
        break;
      default:
        break;
    }

    return pathname == buttonTitle;
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonSubContainer}>
          {button1Icon ? (
            <Pressable
              style={
                isPathSelected(button1Title)
                  ? {
                      ...styles.buttonContainer,
                      ...styles.buttonContainerSelected,
                    }
                  : styles.buttonContainer
              }
              onPress={button1Action || button1DefaultAction}
            >
              <View style={styles.icon}>{button1Icon}</View>
              <Text
                style={
                  isPathSelected(button1Title)
                    ? { ...styles.buttonTitle, ...styles.buttonTitleSelected }
                    : styles.buttonTitle
                }
              >
                {button1Title}
              </Text>
            </Pressable>
          ) : (
            <View style={{ width: "10%" }} />
          )}
          {button2Icon ? (
            <Pressable
              style={
                isPathSelected(button2Title)
                  ? {
                      ...styles.buttonContainer,
                      ...styles.buttonContainerSelected,
                    }
                  : styles.buttonContainer
              }
              onPress={button2Action || button2DefaultAction}
            >
              <View style={styles.icon}>{button2Icon}</View>
              <Text
                style={
                  isPathSelected(button2Title)
                    ? { ...styles.buttonTitle, ...styles.buttonTitleSelected }
                    : styles.buttonTitle
                }
              >
                {button2Title}
              </Text>
            </Pressable>
          ) : (
            <View style={{ width: "10%" }} />
          )}
        </View>
        <Pressable style={styles.button2IconContainer}>
          {button3Icon ? (
            <Pressable
              style={[styles.icon, styles.iconCenter]}
              onPress={button3Action || button3DefaultAction}
            >
              {button3Icon}
            </Pressable>
          ) : (
            <View style={{ width: "10%" }} />
          )}
        </Pressable>
        <View style={styles.buttonSubContainer}>
          {button4Icon ? (
            <Pressable
              style={
                isPathSelected(button4Title)
                  ? {
                      ...styles.buttonContainer,
                      ...styles.buttonContainerSelected,
                    }
                  : styles.buttonContainer
              }
              onPress={button4Action || button4DefaultAction}
            >
              <View style={styles.icon}>{button4Icon}</View>
              <Text
                style={
                  isPathSelected(button4Title)
                    ? { ...styles.buttonTitle, ...styles.buttonTitleSelected }
                    : styles.buttonTitle
                }
              >
                {button4Title}
              </Text>
            </Pressable>
          ) : (
            <View style={{ width: "10%" }} />
          )}
          {button5Icon ? (
            <Pressable
              style={
                isPathSelected(button5Title)
                  ? {
                      ...styles.buttonContainer,
                      ...styles.buttonContainerSelected,
                    }
                  : styles.buttonContainer
              }
              onPress={button5Action || button5DefaultAction}
            >
              <View style={styles.icon}>{button5Icon}</View>
              <Text
                style={
                  isPathSelected(button5Title)
                    ? { ...styles.buttonTitle, ...styles.buttonTitleSelected }
                    : styles.buttonTitle
                }
              >
                {button5Title}
              </Text>
            </Pressable>
          ) : (
            <View style={{ width: "10%" }} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainerSelected: {
    backgroundColor: "#FFAB40",
  },
  buttonTitleSelected: {
    fontFamily: "Comfortaa_700Bold",
    color: "black",
  },
  buttonContainer: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 8,
    height: "100%",
  },
  buttonTitle: { fontSize: 13, color: "#fff" },
  buttonSubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "35%",
    height: "100%",
  },
  container: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    backgroundColor: Colors.primary,
    alignItems: "center",
    minHeight: 65,
    justifyContent: "center",
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: "100%",

    // paddingHorizontal: 10,
  },
  button2IconContainer: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 80,
    // justifyContent: "center",
    // alignItems: "center",
  },
  iconCenter: {
    backgroundColor: "#444444",
    width: 90,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    ...shadowProps,
  },
  line: {
    height: 5,
    backgroundColor: "#242020",
    width: "30%",
    marginVertical: 2,
  },
});

export default ButtonsBar;
