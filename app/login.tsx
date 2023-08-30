import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Colors, Image, Text, View } from "react-native-ui-lib";
import NativeNumericPad from "../modules/auth/components/NativeNumericPad";
import fonts from "../modules/common/theme/fonts";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import Counter from "../modules/auth/components/Counter";
import useAuthStore from "../modules/auth/AuthStore";

const LoginScreen = () => {
  const { title = "Mozo", subTitle = "Los Especiales del dia" } =
    useLocalSearchParams<{ title: string; subTitle: string }>();

  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [passwordMaxLength, setPasswordMaxLength] = useState(4);
  const [error, setError] = useState(null);
  const authStore = useAuthStore((state) => state);

  const goBack = () => router.back();
  const onSubmit = async () => {
    // await authStore.login(userInput);
    router.push("/welcome");
    // navigation.navigate("(menu)", { screen: "menu" })
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Pressable style={{ alignSelf: "flex-start" }} onPress={goBack}>
          <Image
            resizeMode="contain"
            style={styles.arrowBackImage}
            assetGroup="assets"
            assetName="arrowBack"
          />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subTitle}</Text>
      </View>
      <Counter item={userInput} length={passwordMaxLength} />
      <View>
        {authStore.isLoading && (
          <>
            <ActivityIndicator color={Colors.primary} size={45} />
            <Text style={{ textAlign: "center" }}>{/* {loadingStatus} */}</Text>
          </>
        )}
        {/* {error && (
          <Text style={{ textAlign: "center", color: colors.danger }}>
            {error}
          </Text>
        )} */}
      </View>
      {!isLoading && (
        <NativeNumericPad
          onChangeText={(value: string) => {
            setUserInput(value);
            setError(null);
          }}
          textMaxLength={passwordMaxLength}
          userInput={userInput}
          onSubmit={onSubmit}
        />
      )}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    alignItems: "center",
    // marginTop: 40,
    marginBottom: 20,
  },
  arrowBackImage: {
    marginTop: 10,
    width: 50,
    height: 50,
    marginLeft: 10,
  },
  title: {
    fontSize: fonts.size.xxl + 10,
    textTransform: "uppercase",
    // marginTop: metrics.screenHeigth * 0.05,
  },
  subtitle: { fontSize: fonts.size.md + 2, marginTop: 8 },
});
