import { queryClient } from "../../app/_layout";
import { Order } from "../../types";
import { makeMcmRequest } from "../common/PetitionsHelper";
import { getOrderStructure } from "./OrderHelper";

export const orderSummaryQueryKey = "order_summary";
export const ordersQueryKey = "/orders";

export const createOrderInBackend = async () => {
  const orderToCreate = getOrderStructure();

  const response = await makeMcmRequest("front/carts", "POST", orderToCreate);

  queryClient.invalidateQueries({ queryKey: [ordersQueryKey] });

  return response;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await makeMcmRequest(`front/orders/${orderId}`);

  return response.order;
};

export const getOrderSummary = async () => {
  const orderToCreate = getOrderStructure();
  console.log(orderToCreate);
  const response = await makeMcmRequest(
    `front/carts/summary`,
    "POST",
    orderToCreate
  );

  return response;
};
