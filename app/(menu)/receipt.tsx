import { StyleSheet } from "react-native";
import React from "react";
import { Colors, LoaderScreen, StateScreen } from "react-native-ui-lib";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Order } from "../../types";
import ReceiptScreen from "../../modules/receipt/components/ReceiptScreen";
import { getPaymentById } from "../../modules/payment/PaymentApi";

const receipt = () => {
  let params = useLocalSearchParams<{ paymentId: string }>();

  if (!params.paymentId)
    return (
      <StateScreen
        title={"Payment Not Founded"}
        subtitle={"The Payment was not found or is no longer valid"}
      />
    );

  const { data: order, isLoading: isOrderLoading } = useQuery<Order>({
    queryKey: ["payments", params.paymentId],
    queryFn: () => getPaymentById(params.paymentId),
  });

  if (isOrderLoading && !order)
    return <LoaderScreen message={"Loading Order"} color={Colors.grey40} />;

  if (!order)
    return (
      <StateScreen
        title={"Payment Not Founded"}
        subtitle={"The Payment was not found or is no longer valid"}
      />
    );

  return <ReceiptScreen order={order} />;
};

export default receipt;

const styles = StyleSheet.create({});
