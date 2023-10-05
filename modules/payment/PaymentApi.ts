import { payment_method_available } from "../../types";
import { makeMcmRequest } from "../common/PetitionsHelper";

export const createPayment = async (params: {
  method: payment_method_available;
  orders_ids: string[];
  tip?: string;
  reference: string;
  employee: { id: string; first_name: string; last_name: string };
  total_to_pay?: string;
  items_to_pay?: string;
}) => {
  const response = await makeMcmRequest("front/payments", "POST", {
    orders_ids: params.orders_ids,
    method: params.method,
    reference: params.reference.toString(),
    employee: {
      id: params.employee.toString(),
      first_name: params.employee.first_name || "",
      last_name: params.employee.last_name || "",
    },
    tip: params.tip,
    // total to pay es solo disponible cuando es a pagar un cheque individual
    total_to_pay: params.total_to_pay,
    items_to_pay: params.items_to_pay,
  });

  return response;
};
