import dayjs from "dayjs";
import { queryClient } from "../../app/_layout";
import { Order } from "../../types";
import { makeMcmRequest } from "../common/PetitionsHelper";
import { getOrderStructure } from "./OrderHelper";
import utc from "dayjs/plugin/utc";
import { GetOrdersRequestResponse } from "mcm-types";
import useEcrStore from "../ecr/EcrStore";

dayjs.extend(utc);

export const orderSummaryQueryKey = "order_summary";
export const ordersQueryKey = "/orders";
export const orderQueryKey = "order";

export const createOrderInBackend = async (): Promise<{ order: Order }> => {
  const orderToCreate = getOrderStructure();

  const response = await makeMcmRequest(
    "admin/orders/table/items/add",
    "POST",
    orderToCreate
  );

  queryClient.invalidateQueries({ queryKey: [ordersQueryKey] });
  return response;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await makeMcmRequest(`front/orders/${orderId}`);

  return response.order;
};

export const getOrderSummary = async () => {
  const orderToCreate = getOrderStructure();
  const response = await makeMcmRequest(
    `front/carts/summary`,
    "POST",
    orderToCreate
  );

  return response;
};

export const getOrders = async (): Promise<GetOrdersRequestResponse> => {
  let response = await makeMcmRequest(
    "admin/orders",
    "GET",
    {},
    {
      withoutPaginate: true,
      // after: dayjs().utc().subtract(24, "hours").toISOString(),
    }
  );

  const ecrSetup = useEcrStore.getState().setup;

  if (ecrSetup.batch_number) {
    response.orders = response.orders.filter(
      (order: Order) =>
        !(
          order.status == "check-closed" &&
          order.additional_properties?.batch_number != ecrSetup.batch_number
        )
    );
  }

  return response;
};
