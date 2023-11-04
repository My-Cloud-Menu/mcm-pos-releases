import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import useSplitStore from "../SplitStore";
import { Colors } from "react-native-ui-lib";

const SplitPaymentCounter = ({ isSplitByProducts = false }) => {
  let { splitAmountsToPay, splitProductsToPay, quantityDesiredToPay } =
    useSplitStore((state) => state);

  let personQuantity = isSplitByProducts
    ? splitProductsToPay
    : splitAmountsToPay;

  if (personQuantity.length == 0) personQuantity.push("");

  return (
    <View style={styles.container}>
      {personQuantity.map((check, index) => (
        <Ionicons
          name="person-sharp"
          size={24}
          color={index < quantityDesiredToPay ? Colors.primary : Colors.gray}
          style={styles.check}
        />
      ))}
    </View>
  );
};

export default SplitPaymentCounter;

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "center" },
  check: { marginHorizontal: 2 },
});
