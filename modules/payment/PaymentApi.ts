import { ecrSaleResponse, payment_method_available } from "../../types";
import { makeEcrRequest, makeMcmRequest } from "../common/PetitionsHelper";
import useEcrStore from "../ecr/EcrStore";
import { GetPaymentsRequestResponse, Payment, TipAdjustment } from "mcm-types";
import * as Linking from "expo-linking";
import dayjs from "dayjs";

export const paymentsQueryKey = "payments";
export const paymentQueryKey = "payment";

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

export const getPaymentById = async (
  paymentId: string
): Promise<Payment | undefined> => {
  return await makeMcmRequest(`front/payments/${paymentId}`);
};

export const getPayments = async (
  orderId = "",
  excludePending = false
): Promise<GetPaymentsRequestResponse> => {
  let response = await makeMcmRequest(
    `admin/payments`,
    "GET",
    {},
    {
      order_id: orderId,
      //after: dayjs().utc().subtract(24, "hours").toISOString(),
      withoutPaginate: true,
    }
  );

  if (excludePending) {
    response.payments = response.payments.filter(
      (payment: Payment) => payment.status != "pending"
    );
  }

  return response;
};

export const createTipAdjustment = async (
  paymentId: string,
  params: {
    amount: string;
    reference: string;
    employee: {
      id: string;
      first_name: string;
      last_name: string;
    };
  }
): Promise<TipAdjustment> => {
  const response = await makeMcmRequest(
    `admin/payments/${paymentId}/tipadjustments`,
    "POST",
    {
      amount: params.amount,
      reference: params.reference,
      employee: {
        id: params.employee.id,
        first_name: params.employee.first_name,
        last_name: params.employee.last_name,
      },
    }
  );

  return response;
};

export const makeEcrTipAdjust = async (
  target_reference: string,
  tip: string
) => {
  try {
    const data = {
      target_reference: target_reference,
      tip: tip,
    };

    const response = await makeEcrRequest("tipAdjust", data, 120000);

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

export const handleEcrTipAdjustmentSuccessful = async (params: {
  tipAdjustment: TipAdjustment;
  payment_receipt_html_updated: string | null;
}) => {
  const response = await makeMcmRequest(
    `admin/payments/${params.tipAdjustment.payment_id}/tipadjustments/${params.tipAdjustment.id}/ecr/successful`,
    "POST",
    { payment_receipt_html_updated: params.payment_receipt_html_updated }
  );

  return response;
};

export const makeEcrSettle = async (receipt_output = "BOTH") => {
  try {
    const data = {
      receipt_output: receipt_output,
    };

    const response = await makeEcrRequest("settle", data, 120000);
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
