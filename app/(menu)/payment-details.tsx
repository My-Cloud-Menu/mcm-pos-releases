import { StyleSheet } from "react-native";
import React from "react";
import { Colors, LoaderScreen, StateScreen, Text } from "react-native-ui-lib";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  getPaymentById,
  paymentQueryKey,
} from "../../modules/payment/PaymentApi";
import { Payment } from "mcm-types";
import PaymentDetailsScreen from "../../modules/payment/components/PaymentDetailsScreen";

const PaymentDetails = () => {
  let params = useLocalSearchParams<{ paymentId: string }>();

  if (!params.paymentId)
    return (
      <StateScreen
        title={"Payment Not Founded"}
        subtitle={"The Payment was not found or is no longer valid"}
      />
    );

  const { data: payment, isLoading: isPaymentLoading } = useQuery<Payment>({
    queryKey: [paymentQueryKey, params.paymentId],
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

  return <PaymentDetailsScreen payment={payment} />;
};

export default PaymentDetails;

const styles = StyleSheet.create({});
