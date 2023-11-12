import Decimal from "decimal.js";
import { Payment, Refund } from "mcm-types";
import useAuthStore from "../auth/AuthStore";
import useEcrStore from "../ecr/EcrStore";
import { makeEcrCardRefund, makeEcrCashRefund } from "./RefundApi";
import { reprintEcrReceipt } from "../receipt/ReceiptApi";

export const refundReasonsForSelect = [
  "Incorrect Order",
  "Cold or Undercooked Food",
  "Poor Quality",
  "Long Wait Times",
  "Overcharged",
  "Unfriendly Service",
  "Allergic Reaction",
  "Missing Items",
  "Other",
];

export const getAmountAvailableForRefund = (payment?: Payment) => {
  if (!payment) return "0.00";

  let totalAvailableForRefund = new Decimal(payment.total);
  totalAvailableForRefund = totalAvailableForRefund.minus(
    payment.total_refunded
  );

  return totalAvailableForRefund.toFixed(2);
};

export const getCreateRefundStructureForBackend = (
  amountToRefund: string,
  reason: string
) => {
  const employeeLogged = useAuthStore.getState().employeeLogged;
  const currentEcrReference = useEcrStore.getState().setup.reference;
  const nextEcrReference =
    currentEcrReference == 999999 ? 1 : Number(currentEcrReference) + 1;

  if (!employeeLogged) throw "Employee must be logged";

  const refundStructure = {
    amount: amountToRefund,
    reason: reason,
    reference: nextEcrReference.toString(),
    employee: {
      id: (employeeLogged?.id || "").toString(),
      first_name: employeeLogged?.first_name,
      last_name: employeeLogged?.last_name,
    },
  };

  return refundStructure;
};

export const handleRefundInEcr = async (refund: Refund, payment: Payment) => {
  let ecrResponse: any;

  switch (payment.method) {
    case "ecr-cash":
      ecrResponse = await makeEcrCashRefund(refund);
      break;
    default:
      ecrResponse = await makeEcrCardRefund(refund);
      break;
  }

  let paymentECRReceipt: string | null = null;

  try {
    const getReceiptResult = await reprintEcrReceipt("html");

    paymentECRReceipt =
      getReceiptResult?.receipt_output?.customer ||
      getReceiptResult?.receipt_output?.merchant;
  } catch (err) {
    console.log(err);
  }

  return {
    ecrRefundResult: ecrResponse,
    paymentReceiptUpdated: paymentECRReceipt,
  };
};
