import { StyleSheet } from "react-native";
import React from "react";
import { Colors, Text, View } from "react-native-ui-lib";
import { AntDesign } from "@expo/vector-icons";

type props = {
  quantity: number;
  onIncrement: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
};

const Counter = (props: props) => {
  let min = props.min || 0;
  let max = props.max || 20;

  return (
    <View centerH>
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <AntDesign
          onPress={() => props.quantity != min && props.onDecrease()}
          name="minus"
          size={16}
          color={Colors.primary}
          style={{
            paddingVertical: 5,
            paddingHorizontal: 7,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.primary,
            textAlign: "center",
          }}
        />
        <Text
          style={{
            fontWeight: "bold",
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 1,
            fontSize: 16,
          }}
        >
          {props.quantity}
        </Text>
        <AntDesign
          onPress={() => props.quantity != max && props.onIncrement()}
          name="plus"
          size={16}
          color={Colors.primary}
          style={{
            paddingVertical: 5,
            paddingHorizontal: 7,
            color: "white",
            backgroundColor: Colors.primary,
            borderRadius: 5,
            textAlign: "center",
          }}
        />
      </View>
    </View>
  );
};

export default Counter;

const styles = StyleSheet.create({});
