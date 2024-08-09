import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Colors, Image, Text, View } from "react-native-ui-lib";
import {
  AntDesign,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { router, useNavigation, usePathname } from "expo-router";
import useAuthStore from "../../../auth/AuthStore";
import { showWarningAlert } from "../../AlertHelper";
import * as Linking from "expo-linking";
import useSetting from "../../../settings/hooks/useSetting";
import { getLogoComponent } from "../../../settings/SettingsHelper";

const navItems = [
  // {
  //   name: "Home",
  //   pathname: "/welcome",
  //   icon: (props = {}) => <FontAwesome size={35} name="home" {...props} />,
  // },
  {
    name: "Menu",
    pathname: "/menu",
    icon: (props = {}) => (
      <MaterialIcons size={27} name="restaurant" {...props} />
    ),
  },
  {
    name: "Orders",
    pathname: "/orders",
    icon: (props = {}) => <Feather size={27} name="shopping-bag" {...props} />,
  },
  {
    name: "Employees",
    pathname: "/clocksinout",
    icon: (props = {}) => (
      <FontAwesome5 size={27} name="user-clock" {...props} />
    ),
  },
  {
    name: "Payments",
    pathname: "/payments",
    icon: (props = {}) => (
      <FontAwesome5 size={27} name="money-check" {...props} />
    ),
  },
  {
    name: "Settings",
    pathname: "/settings",
    icon: (props = {}) => <AntDesign size={27} name="setting" {...props} />,
  },
];

const DefaultNavBar = () => {
  const activePathName = usePathname();
  const navigation = useNavigation();
  const authStore = useAuthStore((state) => state);

  const { settings } = useSetting();

  const [activeNavItem, setActiveNavItem] = useState("/welcome");

  useEffect(() => {
    setActiveNavItem(activePathName);
  }, [activePathName]);

  const onLogoutPress = async () => {
    try {
      if (authStore?.employeeLogged) {
        await authStore.logout();
      }

      navigation.dispatch({ type: "POP_TO_TOP" });
    } catch (error: any) {
      console.log(error);
      showWarningAlert(
        "Error in Logout, please try again or contact the administrator"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          router.push("/welcome");
        }}
      >
        {getLogoComponent({ settings })}
      </Pressable>

      <ScrollView>
        <View flex marginT-20>
          {navItems.map((navItem, idx) => {
            let isNavItemActive = navItem.pathname === activeNavItem;
            return (
              <Button
                onPress={() => router.push(navItem.pathname)}
                key={`navitem-${idx}`}
                variant="iconButtonWithLabelCenter"
                active={isNavItemActive}
                marginV-5
                style={{
                  height: 65,
                  width: 65,
                  backgroundColor: isNavItemActive ? "#002c51" : "white",
                }}
              >
                {navItem.icon({
                  color: isNavItemActive ? Colors.white : Colors.gray,
                })}
                <Text
                  color={isNavItemActive ? Colors.white : Colors.black}
                  marginT-3
                  text90
                  style={{ fontWeight: "400" }}
                >
                  {navItem.name}
                </Text>
              </Button>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default DefaultNavBar;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignItems: "center",
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: Colors.white,
    borderTopEndRadius: 12,
    borderBottomEndRadius: 12,
  },

  supportIcon: {
    alignSelf: "center",
    marginVertical: 20,
  },
});
