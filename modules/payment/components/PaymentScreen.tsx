import { StyleSheet, ActivityIndicator, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Colors, StateScreen, Text, View } from "react-native-ui-lib";
import { Stack, router } from "expo-router";
import { Order, ecrSaleResponse } from "../../../types";
import TipSelector from "../../../modules/payment/components/TipSelector";
import OrderChargesCard from "../../../modules/payment/components/OrderChargesCard";
import usePaymentStore from "../PaymentStore";
import {
  goToReceiptScreen,
  goToSplitPaymentScreen,
} from "../../common/NavigationHelper";
import PaymentMethodSelector from "../../menu/components/PaymentMethodSelector";
import { useMutation } from "@tanstack/react-query";
import {
  createPayment,
  updatePaymentPaidSuccessfullyInBackend,
} from "../PaymentApi";
import {
  getBaseAmountToPay,
  getCreatePaymentStructureForBackend,
  getSubtotalAmountForTip,
  handlePaymentInEcr,
} from "../PaymentHelper";
import { Payment } from "mcm-types";
import { handlePetitionError } from "../../common/AlertHelper";
import { useBackHandler } from "../../common/hooks/UseBackHandler";
import TerminalConnectionChecker from "../../auth/components/TerminalConnectionChecker";
import useEcrStore from "../../ecr/EcrStore";
import SplitPaymentCounter from "./SplitPaymentCounter";
import useSplitStore from "../SplitStore";
import Decimal from "decimal.js";
import { queryClient } from "../../../app/_layout";
import { orderQueryKey } from "../../orders/OrdersApi";
import { useIsFocused } from "@react-navigation/native";
import { ecrStatusCheckerKey } from "../../auth/AuthApi";
import { printECRCustomReceipt } from "../../receipt/ReceiptApi";

interface props {
  order: Order;
}

const PaymentScreen = ({ order }: props) => {
  const isFocused = useIsFocused();

  const paymentStore = usePaymentStore();
  const setCurrentBachNumber = useEcrStore(
    (state) => state.setCurrentBachNumber
  );
  const {
    splitAmountsToPay,
    onSplitAmountPayFinish,
    onSplitProductsPayFinish,
  } = useSplitStore();

  let amountBaseToPay = Number(getBaseAmountToPay(order, splitAmountsToPay));

  let amountBaseForTips = getSubtotalAmountForTip(order, splitAmountsToPay);
  let amountFinalTotal = new Decimal(amountBaseToPay)
    .plus(paymentStore.inputValues.tip || 0)
    .toFixed(2);

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
      onSplitAmountPayFinish();
      onSplitProductsPayFinish();
      goToReceiptScreen(payment.id, payment);
      queryClient.invalidateQueries({
        queryKey: [orderQueryKey, payment.orders_ids[0]],
      });
    },
    mutationFn: async () => {
      await queryClient.cancelQueries({
        queryKey: [ecrStatusCheckerKey],
        exact: true,
      });

      let paymentToSend = paymentCreatedInBackend;

      if (!Boolean(paymentToSend)) {
        const paymentStructure = getCreatePaymentStructureForBackend({
          orderId: order.id,
          totalToPay: amountBaseToPay,
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
  }, [isFocused]);

  useEffect(() => {
    setPaymentCreatedInBackend(undefined);
    setEcrResultCreated(undefined);
  }, [paymentStore.inputValues.tip]);

  if (amountBaseToPay <= 0)
    return (
      <StateScreen
        title={`Orden #${order.id} sin balance por pagar`}
        subtitle={`El pago de la orden #${order.id} ha sido completado previamente`}
      />
    );

  return (
    <View flex backgroundColor={Colors.graySoft}>
      <TerminalConnectionChecker />
      <ScrollView>
        <View flex centerH paddingB-60>
          <Stack.Screen options={{ title: `Payment - Order #${order.id}` }} />
          <Text marginT-15 text50L>
            Total a Pagar
          </Text>
          <View>
            <Text text20 marginT-5 marginB-20>
              $ {amountFinalTotal}{" "}
            </Text>
            <View
              row
              center
              style={{ position: "absolute", left: 190, top: 23 }}
            >
              <SplitPaymentCounter />
              <Button
                marginL-3
                onPress={() => goToSplitPaymentScreen(order.id, order)}
                size="xSmall"
                label="Split Amount"
                style={{
                  paddingHorizontal: 12,
                  backgroundColor: Colors.green,
                }}
              />
            </View>
          </View>

          <Text center text65 marginT-10>
            Method
          </Text>
          <PaymentMethodSelector />
          <Text center text65 marginT-40>
            Tip
          </Text>
          <TipSelector paymentTotal={amountBaseForTips} />
          <View marginT-40>
            <OrderChargesCard order={order} />
          </View>
        </View>
      </ScrollView>
      <View paddingB-20>
        <Button
          disabled={createPaymentQuery.isLoading}
          onPress={() => createPaymentQuery.mutate()}
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
