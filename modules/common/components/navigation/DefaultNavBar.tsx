import { StyleSheet } from "react-native";
import React from "react";
import { Button, Colors, Image, Text, View } from "react-native-ui-lib";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

const navItems = [
  {
    name: "Home",
    pathname: "/home",
    icon: (props = {}) => <FontAwesome size={25} name="home" {...props} />,
  },
  {
    name: "Menu",
    pathname: "/menu",
    icon: (props = {}) => (
      <MaterialIcons size={21} name="restaurant" {...props} />
    ),
  },
  {
    name: "History",
    pathname: "/history",
    icon: (props = {}) => (
      <AntDesign size={21} name="clockcircleo" {...props} />
    ),
  },
  {
    name: "Wallet",
    pathname: "/wallet",
    icon: (props = {}) => <FontAwesome5 size={19} name="wallet" {...props} />,
  },
  {
    name: "Promos",
    pathname: "/promos",
    icon: (props = {}) => <FontAwesome5 size={19} name="percent" {...props} />,
  },
  {
    name: "Settings",
    pathname: "/Settings",
    icon: (props = {}) => <AntDesign size={24} name="setting" {...props} />,
  },
];

const DefaultNavBar = () => {
  const activePathName = usePathname();

  const onLogoutPress = () => router.push("/index");

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.logo}
        assetGroup="assets"
        assetName="logoMain"
      />
      <View flex marginT-30>
        {navItems.map((navItem, idx) => {
          let isNavItemActive = navItem.pathname == activePathName;
          return (
            <Button

              key={`navitem-${idx}`}
              variant="iconButtonWithLabelCenter"
              active={isNavItemActive}
              marginV-2
            >
              {navItem.icon({
                color: isNavItemActive ? Colors.white : Colors.gray,
              })}
              <Text
                color={isNavItemActive ? Colors.white : Colors.gray}
                marginT-8
                text90BL
              >
                {navItem.name}
              </Text>
            </Button>
          );
        })}
      </View>

      <Button
        variant="iconButtonWithLabelCenter"
        marginV-5
        onPress={onLogoutPress}
      >
        <MaterialIcons name="logout" size={25} color={Colors.gray} />
        <Text color={Colors.gray} marginT-8 text90BL>
          Logout
        </Text>
      </Button>
    </View>
  );
};

export default DefaultNavBar;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
});
