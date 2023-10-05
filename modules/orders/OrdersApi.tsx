import { queryClient } from "../../app/_layout";
import { Order } from "../../types";
import { makeMcmRequest } from "../common/PetitionsHelper";

export const createOrderInBackend = async (cartData: any) => {
  const response = await makeMcmRequest("front/carts", "POST", cartData);

  queryClient.invalidateQueries({ queryKey: ["/orders"] });

  return response;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await makeMcmRequest(`front/orders/${orderId}`);

  return response.order;
};
