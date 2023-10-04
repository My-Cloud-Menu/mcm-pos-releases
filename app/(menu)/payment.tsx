import { StyleSheet } from "react-native";
import React from "react";
import { Text, View } from "react-native-ui-lib";
import useOrderStore from "../../modules/orders/OrdersStore";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

const payment = () => {
  const params = useLocalSearchParams();

  if (!params.orderId) {
    return <Text>Orden Invalida</Text>;
  }

  const query = useQuery({
    queryKey: ["orders", params.orderId],
  });

  console.log("el query", query.data);

  return (
    <View center>
      <Stack.Screen options={{ title: `Payment - Order ` }} />
      <Text>Pago de Orden </Text>
    </View>
  );
};

export default payment;

const styles = StyleSheet.create({});
