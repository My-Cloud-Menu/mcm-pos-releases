import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Colors, Image, Text, View } from "react-native-ui-lib";
import metrics from "../modules/common/theme/metrics";
import { Ionicons } from "@expo/vector-icons";
import fonts from "../modules/common/theme/fonts";
import { router } from "expo-router";

const version = "2.0.5";

const HomeScreen = () => {
  const goWaiterLogin = () => {
    router.push(`/login?title=MOZO&subTitle=Welcome`);
  };

  const goAdminLogin = () => {
    router.push(`/login?title=ADMIN&subTitle=`);
  };

  const onPressConfig = () => {
    router.push(`/settings`);

    // showAlert({ title: "We are working on it", type: "warning" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <Text style={styles.buildTitle}>v{version}</Text>
        <Ionicons
          name="settings"
          size={40}
          color="black"
          style={styles.iconConfig}
          onPress={onPressConfig}
          // onPress={goSetupPage}
        />
      </View>

      <View style={styles.contentContainer}>
        <Image
          resizeMode="contain"
          style={styles.logo}
          assetName="logoMain"
          assetGroup="assets"
          // source={require("../assets/icon.png")}
        />
        <Text style={styles.title}>My Cloud</Text>
        {/* <Image
          resizeMode="contain"
          style={styles.arrowImage}
          source={require("../assets/images/arrow.png")}
        /> */}
      </View>

      <View style={styles.containerButton}>
        <Pressable style={{ ...styles.button }} onPress={goWaiterLogin}>
          <Text style={styles.buttonText}>INICIAR</Text>
        </Pressable>

        <Pressable
          style={{ ...styles.button, ...styles.button2 }}
          onPress={goAdminLogin}
        >
          <Text style={{ ...styles.buttonText, ...styles.buttonText2 }}>
            ADMIN
          </Text>
        </Pressable>
      </View>
      <View style={styles.line} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buildTitle: { alignSelf: "flex-start", marginLeft: 3, marginTop: 1 },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  iconConfig: { alignSelf: "flex-end", marginRight: 6, marginTop: 6 },
  contentContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: {
    width: metrics.screenWidth,
    height: metrics.screenHeigth * 0.2,
    // borderRadius: 100,
  },
  title: { fontSize: fonts.size.xxl + 10, marginTop: 15 },
  arrowImage: {
    width: metrics.screenWidth * 0.1,
    height: metrics.screenHeigth * 0.1,
  },
  containerButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  button: {
    borderWidth: 2,
    borderStyle: "solid",
    borderRadius: 8,
    width: "47%",
    paddingVertical: 16,
  },
  button2: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: fonts.size.sm,
  },
  buttonText2: {
    color: Colors.white,
  },
  line: {
    height: 4,
    backgroundColor: Colors.black,
    width: "50%",
    marginTop: 25,
    marginBottom: 5,
  },
});
