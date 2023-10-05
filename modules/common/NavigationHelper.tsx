import { router } from "expo-router";
import { queryClient } from "../../app/_layout";
import { Order } from "../../types";

export const goToPaymentScreen = (orderId: string, order?: Order) => {
  if (order) queryClient.setQueryData(["orders", orderId], order);
  router.push({ pathname: "/payment", params: { orderId: orderId } });
};
