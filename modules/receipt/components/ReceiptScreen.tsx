import { StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Stack } from "expo-router";
import { Order } from "../../../types";

interface props {
  order: Order;
}

const ReceiptScreen = ({ order }: props) => {
  return (
    <View flex backgroundColor={Colors.graySoft}>
      <View flex centerH>
        <Text>Pago Realizado Exitosamente :) - {order.id}</Text>
      </View>
      <View paddingB-20></View>
    </View>
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({});
