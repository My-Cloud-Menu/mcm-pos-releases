import { StyleSheet } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Colors, LoaderScreen, StateScreen } from "react-native-ui-lib";
import { useQuery } from "@tanstack/react-query";
import { getOrderById, orderQueryKey } from "../../modules/orders/OrdersApi";
import SplitPaymentScreen from "../../modules/payment/components/SplitPaymentScreen";

const SplitPayment = () => {
  let params = useLocalSearchParams<{ orderId: string }>();

  if (!params.orderId)
    return (
      <StateScreen
        title={"Order Not Founded"}
        subtitle={"The order was not found or is no longer valid for Split"}
      />
    );

  const orderQuery = useQuery({
    queryKey: [orderQueryKey, params.orderId],
    queryFn: () => getOrderById(params.orderId),
  });

  if (orderQuery.isLoading && !orderQuery.data)
    return (
      <LoaderScreen message={"Loading Order For Split"} color={Colors.grey40} />
    );

  if (!orderQuery.data)
    return (
      <StateScreen
        title={"Order Not Founded"}
        subtitle={"The Order was not found or is no longer valid for split"}
      />
    );

  return <SplitPaymentScreen order={orderQuery.data} />;
};

export default SplitPayment;

const styles = StyleSheet.create({});
