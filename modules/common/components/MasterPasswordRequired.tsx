import { Image, Pressable, StyleSheet } from "react-native";
import React, { useState, useEffect, ReactNode } from "react";

import useGlobalStore from "../GlobalStore";
import { Colors, Text, View } from "react-native-ui-lib";
import Counter from "../../auth/components/Counter";
import NativeNumericPad from "../../auth/components/NativeNumericPad";
import fonts from "../theme/fonts";

const passwordMaxLength = 4;

type props = {
  useDevPassword?: boolean;
  children: ReactNode;
};

const MasterPasswordRequired = (props: props) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(null);
  const setup = useGlobalStore((state) => state.setup);

  const onSubmit = () => {
    if (props?.useDevPassword) {
      if (setup.devPassword == userInput) {
        // onSuccess();
        setIsAuthorized(true);
      } else {
        setError("Incorrect PIN");
        return false;
      }
    }

    if (setup.masterPassword == userInput) {
      setIsAuthorized(true);
      return true;
    } else {
      setError("Incorrect PIN");
      return false;
    }
  };

  const goBack = () => {
    // if (onBack) onBack();
    // else navigation.goBack();
  };

  // useBackHandler(() => {
  //   goBack();
  //   return true;
  // });

  useEffect(() => {
    if (userInput.length == passwordMaxLength) onSubmit();
    if (userInput.length == passwordMaxLength / 2) setError(null);
  }, [userInput]);

  const title = props.useDevPassword
    ? "Ingrese DEV PIN para Continuar "
    : "Ingrese el Master PIN para Continuar";

  if (isAuthorized) return props.children;

  return (
    <View style={styles.container}>
      <View>
        <Pressable style={{ alignSelf: "flex-start" }} onPress={goBack}>
          <Image
            resizeMode="contain"
            style={styles.arrowBackIcon}
            source={require("../../../assets/images/arrow-back.png")}
          />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.contentContainer}>
        {/* <Text style={styles.subTitle}>
          Please enter your 4 digit Master PIN
        </Text> */}
        <Counter item={userInput} length={passwordMaxLength} />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>

      <NativeNumericPad
        onChangeText={setUserInput}
        textMaxLength={passwordMaxLength}
        userInput={userInput}
        onSubmit={onSubmit}
      />
    </View>
  );
};

export default MasterPasswordRequired;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  title: {
    textAlign: "center",
    marginTop: 100,
    marginBottom: 30,
    fontSize: fonts.size.lg - 2,
    fontWeight: "bold",
  },
  subTitle: {
    marginTop: 20,
    marginBottom: 40,
    fontSize: fonts.size.sm,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  arrowBackIcon: {
    marginLeft: 15,
    marginTop: 20,
  },
  error: {
    color: Colors.danger,
  },
});
