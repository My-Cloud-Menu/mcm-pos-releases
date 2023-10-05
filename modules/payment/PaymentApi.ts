import { ecrSaleResponse, payment_method_available } from "../../types";
import { makeEcrRequest, makeMcmRequest } from "../common/PetitionsHelper";
import useEcrStore from "../ecr/EcrStore";
import { Payment } from "mcm-types/src/payment";
import * as Linking from "expo-linking";

export const createPayment = async (params: {
  method: payment_method_available;
  orders_ids: string[];
  tip?: string;
  reference: string;
  employee: { id: string; first_name: string; last_name: string };
  total_to_pay?: string;
  items_to_pay?: string;
}) => {
  return await makeMcmRequest("front/payments", "POST", {
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
};

export const makeEcrCardSale = async (payment: Payment, excludeTip = false) => {
  try {
    const setup = useEcrStore.getState().setup;

    if (excludeTip && payment.data.tip == 0.0) {
      payment.data = {
        ...payment.data,
        tip: 0,
      };
    }
    const data = {
      force_duplicate: setup.force_duplicate,
      amounts: payment.data,
      receipt_output: setup.receipt_output,
      manual_entry_indicator: setup.manual_entry_indicator,
      receipt_email: setup.receipt_email,
      process_cashback: setup.process_cashback,
    };

    const response = await makeEcrRequest("sale", data, 120000);
    try {
      !__DEV__ && Linking.openURL("mcmpos://");
    } catch (err) {}
    return response;
  } catch (error) {
    try {
      !__DEV__ && Linking.openURL("mcmpos://");
    } catch (err) {}
    throw error;
  }
};

export const makeEcrCashSale = async (payment: Payment, excludeTip = false) => {
  try {
    const setup = useEcrStore.getState().setup;

    if (excludeTip && payment.data.tip == 0.0) {
      payment.data = {
        ...payment.data,
        tip: 0,
      };
    }

    const data = {
      amounts: payment.data,
      receipt_output: setup.receipt_output,
      receipt_email: setup.receipt_email,
    };

    const response = await makeEcrRequest("cash", data);
    try {
      !__DEV__ && Linking.openURL("mcmpos://");
    } catch (err) {}
    return response;
  } catch (error) {
    try {
      !__DEV__ && Linking.openURL("mcmpos://");
    } catch (err) {}
    throw error;
  }
};

export const updatePaymentPaidSuccessfullyInBackend = async (
  payment: Payment,
  ecrResponse: ecrSaleResponse
) => {
  const ecrReceipt =
    ecrResponse?.receipt_output?.customer ||
    ecrResponse?.receipt_output?.merchant ||
    "";

  const cardBinType = ecrResponse?.card_bin_type || "Sin Especificar";

  return await makeMcmRequest(
    `admin/payments/ecr/${payment.id}/succesful`,
    "POST",
    {
      invoice: ecrResponse.invoice_number,
      receipt_html: ecrReceipt,
      source: cardBinType,
      batch_number: ecrResponse.batch_number,
    }
  );
};

export const getPaymentById = async (paymentId: string) => {
  return await makeMcmRequest(`front/payments/${paymentId}`);
};
