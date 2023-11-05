import { Refund } from "mcm-types";
import { makeEcrRequest, makeMcmRequest } from "../common/PetitionsHelper";
import useEcrStore from "../ecr/EcrStore";
import * as Linking from "expo-linking";

export const refundsQueryKey = "refunds";

export const createRefund = async (
  paymentId: string,
  params: {
    amount: string;
    reason: string;
    reference: string;
    employee: {
      id: string;
      first_name: string;
      last_name: string;
    };
  }
): Promise<Refund> => {
  const response = await makeMcmRequest(
    `admin/payments/${paymentId}/refunds`,
    "POST",
    params
  );

  return response;
};

export const makeEcrCashRefund = async (refund: Refund) => {
  try {
    const setup = useEcrStore.getState().setup;

    const data = {
      amounts: refund.data,
      receipt_output: setup.receipt_output,
      receipt_email: setup.receipt_email,
    };

    const response = await makeEcrRequest("cashRefund", data);

    try {
      !__DEV__ && Linking.openURL("mcmpos://");
    } catch {}

    return response;
  } catch (error) {
    try {
      !__DEV__ && Linking.openURL("mcmpos://");
    } catch {}
    throw error;
  }
};

export const makeEcrCardRefund = async (refund: Refund) => {
  try {
    const setup = useEcrStore.getState().setup;

    const data = {
      receipt_email: setup.receipt_email,
      amounts: refund.data,
      receipt_output: setup.receipt_output,
      manual_entry_indicator: setup.manual_entry_indicator,
    };

    const response = await makeEcrRequest("refund", data);

    try {
      !__DEV__ && Linking.openURL("mcmpos://");
    } catch {}

    return response;
  } catch (error) {
    try {
      !__DEV__ && Linking.openURL("mcmpos://");
    } catch {}
    throw error;
  }
};

export const handleEcrRefundSuccessful = async (params: {
  refund: Refund;
  ecrRefundResult: any;
  paymentInvoiceUpdated: string | null;
}) => {
  const ecrRefundReceipt =
    params.ecrRefundResult?.receipt_output?.customer ||
    params.ecrRefundResult?.receipt_output?.merchant ||
    "";

  const response = await makeMcmRequest(
    `admin/payments/${params.refund.payment_id}/refunds/${params.refund.id}/ecr/succesful`,
    "POST",
    {
      invoice: params.ecrRefundResult.invoice_number.toString(),
      receipt_html: ecrRefundReceipt,
      reference: params.ecrRefundResult.reference,
      payment_receipt_html_updated: params.paymentInvoiceUpdated,
    }
  );

  return response;
};

export const getRefundsByPaymentId = async (
  paymentId: string,
  status = "completed"
): Promise<Refund[]> => {
  let { refunds } = await makeMcmRequest(
    `admin/payments/${paymentId}/refunds`,
    "GET",
    {},
    {
      withoutPaginate: true,
    }
  );

  if (status) {
    refunds = refunds.filter((refund: Refund) => refund.status == status);
  }

  return refunds;
};
