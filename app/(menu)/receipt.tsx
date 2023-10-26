import { StyleSheet } from "react-native";
import React from "react";
import { Colors, LoaderScreen, StateScreen } from "react-native-ui-lib";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import ReceiptScreen from "../../modules/receipt/components/ReceiptScreen";
import { getPaymentById } from "../../modules/payment/PaymentApi";
import { Payment } from "mcm-types";

const receipt = () => {
  let params = useLocalSearchParams<{ paymentId: string }>();

  if (!params.paymentId)
    return (
      <StateScreen
        title={"Payment Not Founded"}
        subtitle={"The Payment was not found or is no longer valid"}
      />
    );

  const { data: payment, isLoading: isPaymentLoading } = useQuery<Payment>({
    queryKey: ["payments", params.paymentId],
    queryFn: () => getPaymentById(params.paymentId),
  });

  if (isPaymentLoading && !payment)
    return <LoaderScreen message={"Loading Payment"} color={Colors.grey40} />;

  if (!payment)
    return (
      <StateScreen
        title={"Payment Not Founded"}
        subtitle={"The Payment was not found or is no longer valid"}
      />
    );

  return <ReceiptScreen payment={payment} />;
};

export default receipt;

const styles = StyleSheet.create({});
