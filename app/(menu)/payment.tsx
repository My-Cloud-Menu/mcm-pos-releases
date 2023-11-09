import { StyleSheet } from "react-native";
import React from "react";
import { Colors, LoaderScreen, StateScreen } from "react-native-ui-lib";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Order } from "../../types";
import { getOrderById, orderQueryKey } from "../../modules/orders/OrdersApi";
import PaymentScreen from "../../modules/payment/components/PaymentScreen";

const payment = () => {
  console.log("klk wa")
  let params = useLocalSearchParams<{ orderId: string }>();

  if (!params.orderId)
    return (
      <StateScreen
        title={"Order Not Founded"}
        subtitle={"The order was not found or is no longer valid"}
      />
    );

  const { data: order, isLoading: isOrderLoading } = useQuery<Order>({
    queryKey: [orderQueryKey, params.orderId],
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

  if (order.payment_status == "fulfilled")
    return <StateScreen title={"Order is Already Paid"} subtitle="Thank You" />;

  return <PaymentScreen order={order} />;
};

export default payment;

const styles = StyleSheet.create({});
