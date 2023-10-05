import { StyleSheet } from "react-native";
import React from "react";
import { Colors, Text, View } from "react-native-ui-lib";

type props = {
  label: string;
  value: string;
  horizontal?: boolean;
};

const LabelValue = ({ label, value, horizontal = true }: props) => {
  return (
    <View row={horizontal} marginR-15 centerV>
      <Text text80 style={{ color: Colors.black, fontWeight: "500" }}>
        {label}
      </Text>
      <Text text80 style={{ color: "#757575", marginLeft: horizontal ? 4 : 0 }}>
        {value}
      </Text>
    </View>
  );
};

export default LabelValue;

const styles = StyleSheet.create({});
