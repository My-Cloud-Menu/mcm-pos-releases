import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native-ui-lib";
import fonts from "../modules/common/theme/fonts";
import { useNavigation } from "expo-router";

const HomeScreen = () => {
  const navigation = useNavigation();

  const onPressButton = () => navigation.navigate("(menu)", { screen: "menu" });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          resizeMode="contain"
          style={styles.logo}
          assetGroup="assets"
          assetName="logoMain"
        />
      </View>

      <View style={styles.cardsContainer}>
        <Pressable
          onPress={onPressButton}
          style={[styles.card, { marginRight: 10 }]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <Ionicons name="map" size={50} color="#9e2820" />
            </View>
            <Text style={styles.cardText}>Drive In</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={onPressButton}
          style={[styles.card, { marginHorizontal: 10 }]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <Ionicons name="business" size={fonts.size.md} color="#9e2820" />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardText}>Take away</Text>
            </View>
          </View>
        </Pressable>
        <Pressable
          onPress={onPressButton}
          style={[styles.card, { marginHorizontal: 10 }]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <Ionicons name="cube" size={50} color="#9e2820" />
            </View>
            <Text style={styles.cardText}>Collection</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={onPressButton}
          style={[styles.card, { marginHorizontal: 10 }]}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardIcon}>
              <Ionicons name="car" size={50} color="#9e2820" />
            </View>
            <Text style={styles.cardText}>Delivery</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={onPressButton}
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
          <Pressable onPress={onPressButton} style={styles.iconWithText}>
            <Ionicons
              name="home"
              size={50}
              color="#9e2820"
              style={styles.footerIconfooter}
            />
            <Text style={styles.footerText}>Home</Text>
          </Pressable>
          <Pressable onPress={onPressButton} style={styles.iconWithText}>
            <Ionicons
              name="cash-outline"
              size={50}
              color="#9e2820"
              style={styles.footerIconfooter}
            />
            <Text style={styles.footerText}>Pay</Text>
          </Pressable>
          <Pressable onPress={onPressButton} style={styles.iconWithText}>
            <Ionicons
              name="alarm-outline"
              size={50}
              color="#9e2820"
              style={styles.footerIconfooter}
            />
            <Text style={styles.footerText}>Clock in</Text>
          </Pressable>
          <Pressable onPress={onPressButton} style={styles.iconWithText}>
            <Ionicons
              name="tv-outline"
              size={50}
              color="#9e2820"
              style={styles.footerIconfooter}
            />
            <Text style={styles.footerText}>Monitor</Text>
          </Pressable>
          <Pressable onPress={onPressButton} style={styles.iconWithText}>
            <Ionicons
              name="search-outline"
              size={50}
              color="#9e2820"
              style={[styles.footerIconfooter, styles.searchIcon]}
            />
            <Text style={styles.footerText}>Search</Text>
          </Pressable>
          <Pressable onPress={onPressButton} style={styles.iconWithText}>
            <Ionicons
              name="archive-outline"
              size={50}
              color="#9e2820"
              style={styles.footerIconfooter}
            />
            <Text style={styles.footerText}>Cash save</Text>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Pressable onPress={onPressButton} style={styles.iconWithText}>
              <Ionicons
                name="log-out-outline"
                size={50}
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
    borderRadius: 30,
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
    marginRight: 10,
    marginTop: 10,
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
