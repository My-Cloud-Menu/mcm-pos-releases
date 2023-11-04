import { router } from "expo-router";
import { queryClient } from "../../app/_layout";
import { Order } from "../../types";
import { Payment } from "mcm-types/";
import { paymentQueryKey } from "../payment/PaymentApi";
import { orderQueryKey } from "../orders/OrdersApi";

export const goToPaymentScreen = (orderId: string, order?: Order) => {
  if (order) queryClient.setQueryData([orderQueryKey, orderId], order);
  router.push({ pathname: "/payment", params: { orderId: orderId } });
};

export const goToReceiptScreen = (
  paymentId: string,
  payment?: Payment,
  canGoBack = false
) => {
  if (payment) queryClient.setQueryData([paymentQueryKey, paymentId], payment);
  router.push({
    pathname: "/receipt",
    params: { paymentId: paymentId, canGoBack: canGoBack ? "1" : "" },
  });
};

export const goToOrderDetailsScreen = (orderId: string, order?: Order) => {
  if (order) queryClient.setQueryData([orderQueryKey, orderId], order);
  router.push({ pathname: "/orders", params: { orderId: orderId } });
};

export const goToPaymentDetailsScreen = (
  paymentId: string,
  payment?: Payment
) => {
  if (payment) queryClient.setQueryData([paymentQueryKey, paymentId], payment);
  router.push({
    pathname: "/payment-details",
    params: { paymentId: paymentId },
  });
};

export const goToSplitPaymentScreen = (orderId: string, order?: Order) => {
  if (order) queryClient.setQueryData([orderQueryKey, orderId], order);
  router.push({ pathname: "/split-payment", params: { orderId: orderId } });
};
