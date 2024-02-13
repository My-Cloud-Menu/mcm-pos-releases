import React from "react";
import { StyleSheet, View } from "react-native";
import Counter from "../../auth/components/Counter";
import ButtonNumeric from "./ButtonNumeric";

const NumericPad = ({
  userInput,
  textMaxLength = 4,
  onChangeText,
  onSubmit,
}: any) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const letters = [];

  return (
    <View>
      <View style={styles.numericPad}>
        {numbers.map((number, index) => (
          <ButtonNumeric
            key={`numericpad-${number}`}
            text={number.toString()}
            action={() =>
              userInput.length != textMaxLength &&
              onChangeText(userInput + number)
            }
          />
        ))}
        <ButtonNumeric
          key={`numericpad-DEL`}
          action={() => onChangeText(userInput.slice(0, userInput.length - 1))}
          image={require("../../../assets/images/arrow-delete.png")}
          backgroundColor="#CBCED5"
        />
        <ButtonNumeric
          key={`numericpad-0`}
          text="0"
          subText="+"
          action={() =>
            userInput.length != textMaxLength && onChangeText(userInput + 0)
          }
        />
        <ButtonNumeric
          action={onSubmit}
          key={`numericpad-check`}
          image={require("../../../assets/images/arrow-check.png")}
          backgroundColor="#1A73E9"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  numericPad: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 600,
    gap: 20,
    marginHorizontal: "auto",
  },
});
export default NumericPad;
