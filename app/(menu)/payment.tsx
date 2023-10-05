import { StyleSheet } from "react-native";
import React from "react";
import {
  Button,
  Colors,
  LoaderScreen,
  StateScreen,
  Text,
  View,
} from "react-native-ui-lib";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Order } from "../../types";
import { getOrderById } from "../../modules/orders/OrdersApi";
import TipSelector from "../../modules/payment/components/TipSelector";

const payment = () => {
  let params = useLocalSearchParams<{ orderId: string }>();
  params.orderId = "10028"; // !! BORRAR AL TERMINAR
  if (!params.orderId)
    return (
      <StateScreen
        title={"Order Not Founded"}
        subtitle={"The order was not found or is no longer valid"}
      />
    );

  const { data: order, isLoading: isOrderLoading } = useQuery<Order>({
    queryKey: ["orders", params.orderId],
    queryFn: () => getOrderById(params.orderId),
  });

  if (isOrderLoading && !order)
    return (
      <LoaderScreen
        message={"Loading Order for Payment"}
        color={Colors.grey40}
      />
    );

  if (!order)
    return (
      <StateScreen
        title={"Order Not Founded"}
        subtitle={"The order was not found or is no longer valid"}
      />
    );

  return (
    <View flex>
      <View flex centerH>
        <Stack.Screen options={{ title: `Payment - Order ${order.id}` }} />
        <Text marginT-15 text70>
          Total a Pagar
        </Text>
        <Text text30L>$ {order.total} </Text>
        <TipSelector paymentTotal={Number(order.total)} />
      </View>
      <View paddingB-20>
        <Button label="Complete Payment" fullWidth marginH-20 />
      </View>
    </View>
  );
};

export default payment;

const styles = StyleSheet.create({});
