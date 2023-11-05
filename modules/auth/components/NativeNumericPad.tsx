import { Keyboard, ScrollView, StyleSheet, TextInput } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const NativeNumericPad = ({
  userInput,
  textMaxLength = 4,
  onChangeText,
  onSubmit,
}: any) => {
  // Controlling Keyboard
  const inputRef = React.createRef();
  const navigation = useNavigation();

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      // navigation.goBack();
    });

    showKeyboard();
    return () => {
      keyboardHideListener.remove();
    };
  }, [inputRef]);

  const showKeyboard = () => {
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 200);
  };

  return (
    <ScrollView
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps={"always"}
    >
      <TextInput
        value={userInput}
        ref={inputRef}
        onSubmitEditing={() => {
          if (!onSubmit()) {
            showKeyboard();
          }
        }}
        onKeyPress={({ nativeEvent }) => {}}
        onChangeText={(text) => {
          if (text.length <= textMaxLength) onChangeText(text);
        }}
        keyboardType="number-pad"
        autoFocus={true}
        style={{ color: "#fff", padding: "100%" }}
        selectionColor="#fff"
      />
    </ScrollView>
  );
};

export default NativeNumericPad;

const styles = StyleSheet.create({});
