import { StyleSheet } from "react-native";
import React, { ReactNode } from "react";
import { Colors, Text, View } from "react-native-ui-lib";

type props = {
  label: string;
  value: string | ReactNode;
  vertical?: boolean;
  fontSize?: number;
  horizontalMargin?: number;
};

const LabelValue = ({
  label,
  value,
  vertical = false,
  fontSize = 16,
  horizontalMargin = 4,
}: props) => {
  return (
    <View row={!vertical} marginR-15 centerV>
      <Text style={{ fontWeight: "600", fontSize: fontSize }}>{label}</Text>
      {typeof value == "string" ? (
        <Text
          style={{
            color: "#000",
            marginLeft: vertical ? 0 : horizontalMargin,
            fontSize: fontSize,
          }}
        >
          {value}
        </Text>
      ) : (
        <View row>{value}</View>
      )}
    </View>
  );
};

export default LabelValue;

const styles = StyleSheet.create({});
