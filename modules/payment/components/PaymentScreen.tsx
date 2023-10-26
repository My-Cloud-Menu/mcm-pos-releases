import { StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Stack } from "expo-router";
import { Order } from "../../../types";
import TipSelector from "../../../modules/payment/components/TipSelector";
import OrderChargesCard from "../../../modules/payment/components/OrderChargesCard";
import usePaymentStore from "../PaymentStore";
import { goToReceiptScreen } from "../../common/NavigationHelper";
import PaymentMethodSelector from "../../menu/components/PaymentMethodSelector";

interface props {
  order: Order;
}

const PaymentScreen = ({ order }: props) => {
  const paymentStore = usePaymentStore();

  const totalToPay = Number(order.total) + (paymentStore.inputValues.tip || 0);

  const onPressMakePayment = async () => {
    if (!Boolean(paymentStore.paymentCreated)) {
      await paymentStore.createPayment(order.id);
    }
    if (!Boolean(paymentStore.ecrResult)) {
      await paymentStore.handlePaymentInEcr();
    }

    const paymentUpdated = await paymentStore.updatePaymentPaidSuccessfully();

    goToReceiptScreen(paymentUpdated.id, paymentUpdated);
  };

  useEffect(() => {
    paymentStore.resetPayment();
  }, []);

  return (
    <View flex backgroundColor={Colors.graySoft}>
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
          disabled={paymentStore.isLoading}
          onPress={onPressMakePayment}
          label={
            paymentStore.isLoading ? (
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
