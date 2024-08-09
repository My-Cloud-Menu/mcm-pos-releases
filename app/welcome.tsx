import React from "react";
import { Alert, Linking, Pressable, StyleSheet } from "react-native";
import {
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Image, Text, View } from "react-native-ui-lib";
import { useNavigation } from "expo-router";
import useOrderStore from "../modules/orders/OrdersStore";
import useSetting from "../modules/settings/hooks/useSetting";
import { getLogoComponent } from "../modules/settings/SettingsHelper";

const HomeScreen = () => {
  const navigation = useNavigation();
  const changeInputValue = useOrderStore((state) => state.changeInputValue);
  const { settings } = useSetting();

  const onPressButton = () =>
    navigation.navigate("(menu)", { screen: "clocksinout" });
  const onPressMenu = () => navigation.navigate("(menu)", { screen: "menu" });
  const onPressPayments = () =>
    navigation.navigate("(menu)", { screen: "payments" });
  const onPressOrders = () =>
    navigation.navigate("(menu)", { screen: "orders" });
  const onPressSettings = () =>
    navigation.navigate("(menu)", { screen: "settings" });
  const onPressLogout = () =>
    navigation.navigate("(menu)", { screen: "clocksinout" });

  const onPressContactSupport = () => {
    const externalLink =
      "https://api.whatsapp.com/send/?phone=17873330990&text&type=phone_number&app_absent=0";

    Linking.openURL(externalLink);
  };

  const onPressOrderExperience = (experience = "pu") => {
    changeInputValue("experience", experience);

    if (experience == "qe") {
      navigation.navigate("(menu)", { screen: "table-selector" });
      return;
    }

    navigation.navigate("(menu)", { screen: "menu" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {getLogoComponent({ settings: settings, styles: styles.logo })}
      </View>

      <View style={styles.cardsContainer}>
        <Pressable
          onPress={() => onPressOrderExperience("pu")}
          style={[styles.card, { marginRight: 10 }]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <Entypo name="shopping-bag" size={45} color="#9e2820" />
            </View>
            <Text style={styles.cardText}>Takeout</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => onPressOrderExperience("qe")}
          style={[styles.card, { marginHorizontal: 10 }]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <FontAwesome5 name="chair" size={45} color="#9e2820" />
            </View>
            <Text style={styles.cardText}>Table</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => onPressOrderExperience("dl")}
          style={[styles.card, { marginHorizontal: 10 }]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <MaterialIcons name="delivery-dining" size={49} color="#9e2820" />
            </View>
            <Text style={styles.cardText}>Delivery</Text>
          </View>
        </Pressable>
        {/* <Pressable
          onPress={onPressButton}
          style={[styles.card, { marginHorizontal: 10 }]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <Ionicons name="car" size={50} color="#9e2820" />
            </View>
            <Text style={styles.cardText}>Delivery</Text>
          </View>
        </Pressable> */}
        <Pressable
          onPress={() => onPressOrderExperience("pu")}
          style={[styles.card, { marginHorizontal: 10 }]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <Ionicons name="list" size={50} color="#9e2820" />
            </View>
            <Text style={styles.cardText}>More</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.contactContainer}>
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            marginHorizontal: 30,
          }}
        >
          <Ionicons name="call" size={24} color="#9e2820" />
          <Text style={styles.contactText}>Phone: 000 - 000 - 0000</Text>
        </View>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            marginHorizontal: 30,
          }}
        >
          <Ionicons name="logo-whatsapp" size={24} color="#9e2820" />
          <Text style={styles.contactText}>WhatsApp: 000 - 000 - 0000</Text>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            flexDirection: "row",
            marginHorizontal: 30,
          }}
        >
          <Ionicons name="mail" size={24} color="#9e2820" />
          <Text style={styles.contactText}>Mail: support@mycloudmenu.com</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.iconsContainer}>
          {/* <Pressable onPress={onPressButton} style={styles.iconWithText}>
            <Ionicons
              name="home"
              size={55}
              color="#9e2820"
              style={styles.footerIconfooter}
            />
            <Text style={styles.footerText}>Home</Text>
          </Pressable> */}
          <Pressable onPress={onPressMenu} style={styles.iconWithText}>
            <MaterialIcons
              name="restaurant"
              size={55}
              color="#9e2820"
              style={styles.footerIconfooter}
            />
            <Text style={styles.footerText}>Menu</Text>
          </Pressable>
          <Pressable onPress={onPressOrders} style={styles.iconWithText}>
            <Feather
              name="shopping-bag"
              size={55}
              color="#9e2820"
              style={styles.footerIconfooter}
            />
            <Text style={styles.footerText}>Orders</Text>
          </Pressable>

          <Pressable onPress={onPressButton} style={styles.iconWithText}>
            <FontAwesome5
              name="user-clock"
              size={55}
              color="#9e2820"
              style={[styles.footerIconfooter]}
            />
            <Text style={styles.footerText}>Employees</Text>
          </Pressable>
          <Pressable onPress={onPressPayments} style={styles.iconWithText}>
            <FontAwesome5
              name="money-check"
              size={55}
              color="#9e2820"
              style={styles.footerIconfooter}
            />
            <Text style={styles.footerText}>Payments</Text>
          </Pressable>
          <Pressable onPress={onPressSettings} style={styles.iconWithText}>
            <AntDesign
              name="setting"
              size={55}
              color="#9e2820"
              style={styles.footerIconfooter}
            />
            <Text style={styles.footerText}>Settings</Text>
          </Pressable>
          <Pressable
            onPress={onPressContactSupport}
            style={styles.iconWithText}
          >
            <MaterialIcons
              name="support-agent"
              size={55}
              color="#9e2820"
              style={styles.footerIconfooter}
            />
            <Text style={styles.footerText}>Support</Text>
          </Pressable>

          <View style={{ flex: 1 }}>
            <Pressable onPress={onPressLogout} style={styles.iconWithText}>
              <Ionicons
                name="log-out-outline"
                size={55}
                color="#9e2820"
                style={styles.footerIconfooter}
              />
              <Text style={styles.footerText}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2eded",
    alignItems: "center",
  },
  contentContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 70,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  card: {
    width: 150,
    height: 100,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 5,
    borderRadius: 10,
  },

  cardContent: {
    alignItems: "center",
  },
  cardIcon: {
    // marginRight: 10,
    marginTop: 10,
    marginBottom: 4,
  },
  cardText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  cardTextContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  cardIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingBottom: 10,
  },
  footer: {
    width: "100%",
    height: "25%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    zIndex: 1,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  footerIcon: {
    marginHorizontal: 30,
  },
  footerIconfooter: {
    marginHorizontal: 20,
  },
  footerIconText: {
    color: "#333",
    fontSize: 12,
    marginTop: 10,
  },
  contactContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 90,
  },
  contactText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "bold",
    marginVertical: 5,
    marginLeft: 5,
  },
  iconWithText: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  footerText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    fontWeight: "bold",
  },
  searchIcon: {
    marginRight: 0,
  },
});

export default HomeScreen;
