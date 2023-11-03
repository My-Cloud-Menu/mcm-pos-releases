import { StyleSheet, ActivityIndicator, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Stack, router } from "expo-router";
import { Order, ecrSaleResponse } from "../../../types";
import TipSelector from "../../../modules/payment/components/TipSelector";
import OrderChargesCard from "../../../modules/payment/components/OrderChargesCard";
import usePaymentStore from "../PaymentStore";
import { goToReceiptScreen } from "../../common/NavigationHelper";
import PaymentMethodSelector from "../../menu/components/PaymentMethodSelector";
import { useMutation } from "@tanstack/react-query";
import {
  createPayment,
  updatePaymentPaidSuccessfullyInBackend,
} from "../PaymentApi";
import {
  getCreatePaymentStructureForBackend,
  handlePaymentInEcr,
} from "../PaymentHelper";
import { Payment } from "mcm-types";
import { handlePetitionError } from "../../common/AlertHelper";
import { useBackHandler } from "../../common/hooks/UseBackHandler";
import TerminalConnectionChecker from "../../auth/components/TerminalConnectionChecker";
import useEcrStore from "../../ecr/EcrStore";

interface props {
  order: Order;
}

const PaymentScreen = ({ order }: props) => {
  const paymentStore = usePaymentStore();
  const setCurrentBachNumber = useEcrStore(
    (state) => state.setCurrentBachNumber
  );
  const totalToPay = Number(order.total) + (paymentStore.inputValues.tip || 0);
  const [paymentCreatedInBackend, setPaymentCreatedInBackend] = useState<
    Payment | undefined
  >(undefined);
  const [ecrResultCreated, setEcrResultCreated] = useState<
    ecrSaleResponse | undefined
  >(undefined);

  const createPaymentQuery = useMutation({
    onError: (error) => {
      handlePetitionError(error);
    },
    onSuccess: (payment: Payment) => {
      goToReceiptScreen(payment.id, payment);
    },
    mutationFn: async (orderId: string) => {
      let paymentToSend = paymentCreatedInBackend;

      if (!Boolean(paymentToSend)) {
        const paymentStructure = getCreatePaymentStructureForBackend({
          orderId: orderId,
        });

        paymentToSend = await createPayment(paymentStructure);
        setPaymentCreatedInBackend(paymentToSend);
      }

      let ecrResultToSend = ecrResultCreated;

      if (!Boolean(ecrResultToSend)) {
        ecrResultToSend = await handlePaymentInEcr(paymentToSend);
        setEcrResultCreated(ecrResultToSend);

        if (ecrResultToSend?.batch_number) {
          setCurrentBachNumber(ecrResultToSend?.batch_number);
        }
      }

      if (ecrResultToSend == undefined || paymentToSend == undefined)
        throw "Payment error";

      const paymentUpdated = await updatePaymentPaidSuccessfullyInBackend(
        paymentToSend,
        ecrResultToSend
      );

      return paymentUpdated;
    },
  });

  useBackHandler(() => {
    Alert.alert(
      "Are you sure you want to leave the Payment Screen?",
      "",
      [
        { text: "No", onPress: () => null, style: "cancel" },
        { text: "Si", onPress: () => router.back() },
      ],
      {
        cancelable: true,
      }
    );

    return true;
  });

  useEffect(() => {
    createPaymentQuery.reset();
    setPaymentCreatedInBackend(undefined);
    setEcrResultCreated(undefined);
    paymentStore.resetInputValues();
  }, []);

  useEffect(() => {
    setPaymentCreatedInBackend(undefined);
    setEcrResultCreated(undefined);
  }, [paymentStore.inputValues.tip]);

  console.log("payment created", paymentCreatedInBackend);
  return (
    <View flex backgroundColor={Colors.graySoft}>
      <TerminalConnectionChecker />
      <ScrollView>
        <View flex centerH>
          <Stack.Screen options={{ title: `Payment - Order #${order.id}` }} />
          <Text marginT-15 text50L>
            Total a Pagar
          </Text>
          <Text text20 marginT-5 marginB-20>
            $ {totalToPay.toFixed(2)}{" "}
          </Text>
          <Text center text65 marginT-10>
            Method
          </Text>
          <PaymentMethodSelector />
          <Text center text65 marginT-40>
            Tip
          </Text>
          <TipSelector paymentTotal={Number(order.cart.subtotal)} />
          <View marginT-40>
            <OrderChargesCard order={order} />
          </View>
        </View>
      </ScrollView>
      <View paddingB-20>
        <Button
          disabled={createPaymentQuery.isLoading}
          onPress={() => createPaymentQuery.mutate(order.id)}
          label={
            createPaymentQuery.isLoading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              "Complete Payment"
            )
          }
          fullWidth
          marginH-20
        />
      </View>
    </View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({});
