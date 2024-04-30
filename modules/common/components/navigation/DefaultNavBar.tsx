import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
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

const navItems = [
  {
    name: "Home",
    pathname: "/welcome",
    icon: (props = {}) => <FontAwesome size={35} name="home" {...props} />,
  },
  {
    name: "Menu",
    pathname: "/menu",
    icon: (props = {}) => (
      <MaterialIcons size={33} name="restaurant" {...props} />
    ),
  },
  {
    name: "Orders",
    pathname: "/orders",
    icon: (props = {}) => <Feather size={30} name="shopping-bag" {...props} />,
  },
  {
    name: "Employees",
    pathname: "/clocksinout",
    icon: (props = {}) => (
      <FontAwesome5 size={30} name="user-clock" {...props} />
    ),
  },
  {
    name: "Payments",
    pathname: "/payments",
    icon: (props = {}) => (
      <FontAwesome5 size={30} name="money-check" {...props} />
    ),
  },
  {
    name: "Settings",
    pathname: "/settings",
    icon: (props = {}) => <AntDesign size={35} name="setting" {...props} />,
  },
];
const redirectToExternalLink = () => {
  const externalLink =
    "https://api.whatsapp.com/send/?phone=17873330990&text&type=phone_number&app_absent=0";
  Linking.openURL(externalLink);
};

const DefaultNavBar = () => {
  const activePathName = usePathname();
  const navigation = useNavigation();
  const authStore = useAuthStore((state) => state);

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
      <Image
        resizeMode="contain"
        style={styles.logo}
        assetGroup="assets"
        assetName="logoMain"
      />
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
                  width: 100,
                  backgroundColor: isNavItemActive ? "#002c51" : "white",
                }}
              >
                {navItem.icon({
                  color: isNavItemActive ? Colors.white : Colors.gray,
                })}
                <Text
                  color={isNavItemActive ? Colors.white : Colors.black}
                  marginT-8
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

      <Button
        variant="iconButtonWithLabelCenter"
        marginV-5
        onPress={redirectToExternalLink}
        disabled={authStore.isLoading}
      >
        {authStore.isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <MaterialIcons size={35} name="support-agent" />
            <Text>Support</Text>
          </>
        )}
      </Button>
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
  logo: {
    width: 50,
    height: 50,
  },
  supportIcon: {
    alignSelf: "center",
    marginVertical: 20,
  },
});
