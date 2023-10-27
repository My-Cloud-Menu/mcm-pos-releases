import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Colors, Image, Text, View } from "react-native-ui-lib";
import { router, useLocalSearchParams } from "expo-router";
import Counter from "./Counter";
import NativeNumericPad from "./NativeNumericPad";
import fonts from "../../common/theme/fonts";
import { useMutation } from "@tanstack/react-query";
import { login, timesSheetQueryKey } from "../AuthApi";
import { queryClient } from "../../../app/_layout";

const ClockInScreen = () => {
  const { title = "Mozo", subTitle = "Los Especiales del dia" } =
    useLocalSearchParams<{ title: string; subTitle: string }>();

  const loginQuery = useMutation({
    mutationFn: (pin: string) => login(pin),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [timesSheetQueryKey] });
      router.back();
    },
  });

  const [userInput, setUserInput] = useState("");
  const [passwordMaxLength, setPasswordMaxLength] = useState(4);

  const onPressLogin = async () => {
    if (loginQuery.isLoading) return;

    loginQuery.mutate(userInput);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Pressable
          style={{ alignSelf: "flex-start" }}
          onPress={() => router.back()}
        >
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
        {loginQuery.isLoading && (
          <>
            <ActivityIndicator color={Colors.primary} size={"large"} />
            <Text style={{ textAlign: "center" }}>{/* {loadingStatus} */}</Text>
          </>
        )}
        {Boolean(loginQuery.error) && (
          <Text style={{ textAlign: "center", color: Colors.danger }}>
            {loginQuery?.error?.message.toString()}
          </Text>
        )}
      </View>
      {!loginQuery.isLoading && (
        <NativeNumericPad
          onChangeText={(value: string) => {
            setUserInput(value);
          }}
          textMaxLength={passwordMaxLength}
          userInput={userInput}
          onSubmit={onPressLogin}
        />
      )}
    </View>
  );
};

export default ClockInScreen;

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
