import { router } from "expo-router";
import { queryClient } from "../../app/_layout";
import { Order } from "../../types";
import { Payment } from "mcm-types/src/payment";

export const goToPaymentScreen = (orderId: string, order?: Order) => {
  if (order) queryClient.setQueryData(["orders", orderId], order);
  router.push({ pathname: "/payment", params: { orderId: orderId } });
};

export const goToReceiptScreen = (paymentId: string, payment?: Payment) => {
  if (payment) queryClient.setQueryData(["payments", paymentId], payment);
  router.push({ pathname: "/receipt", params: { paymentId: paymentId } });
};
