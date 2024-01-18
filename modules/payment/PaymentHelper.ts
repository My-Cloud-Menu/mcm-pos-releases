import useAuthStore from "../auth/AuthStore";
import useEcrStore from "../ecr/EcrStore";
import useOrderStore from "../orders/OrdersStore";
import usePaymentStore from "./PaymentStore";
import * as paymentApi from "./PaymentApi";
import { Colors } from "react-native-ui-lib";
import { Order, Payment } from "mcm-types";
import Decimal from "decimal.js";

export const getCreatePaymentStructureForBackend = ({
  orderId,
  totalToPay,
  itemsToPay,
}: {
  orderId: string;
  totalToPay?: number;
  itemsToPay?: any;
}) => {
  const inputValues = usePaymentStore.getState().inputValues;
  const employeeLogged = useAuthStore.getState().employeeLogged;
  const payment_method_selected =
    useOrderStore.getState().inputValues.payment_method;
  const currentEcrReference = useEcrStore.getState().setup.reference;

  const nextEcrReference =
    currentEcrReference == 999999 ? 1 : Number(currentEcrReference) + 1;

  if (!employeeLogged) throw "Employee must be logged";

  const paymentStructure = {
    orders_ids: [orderId],
    method: payment_method_selected,
    employee: {
      id: employeeLogged?.id,
      first_name: employeeLogged?.first_name,
      last_name: employeeLogged?.last_name,
    },
    reference: nextEcrReference.toString(),
    tip: inputValues?.tip?.toString(),
    total_to_pay: itemsToPay ? undefined : totalToPay?.toString(),
    items_to_pay: itemsToPay,
  };

  return paymentStructure;
};

export const handlePaymentInEcr = async (paymentCreatedInBackend: any) => {
  const { inputValues } = usePaymentStore.getState();

  const paymentMethodSelected =
    useOrderStore.getState().inputValues.payment_method;

  const excludeTip = inputValues.selectedTip === 0;

  let ecrResult: any;

  if (paymentMethodSelected == "ecr-card") {
    ecrResult = await paymentApi.makeEcrCardSale(
      paymentCreatedInBackend,
      excludeTip
    );
  } else {
    ecrResult = await paymentApi.makeEcrCashSale(
      paymentCreatedInBackend,
      excludeTip
    );
  }

  return ecrResult;
};

export const getColorForStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return Colors.green;
    case "partially_refunded":
      return Colors.primaryLight;
    case "refunded":
      return Colors.yellow;
    case "pending":
      return Colors.grayActive;
    default:
      return Colors.primaryLight;
  }
};

export const getStatusLabel = (paymentStatus: string) => {
  let label = paymentStatus;

  if (paymentStatus == "partially_refunded") label = "Partially Refunded";

  return label;
};

export const getMethodLabel = (paymentMethod: string) => {
  if (paymentMethod == "ecr-cash") paymentMethod = "Cash";
  else if (paymentMethod == "ecr-card") paymentMethod = "Card";
  else if (paymentMethod == "evertec") paymentMethod = "P2P";
  else if (paymentMethod == "ath-movil") paymentMethod = "ATH Movil";

  return paymentMethod;
};

export const getEcrDataSubtotal = (payment?: Payment) => {
  if (!payment) return 0;

  let subtotal = 0;

  if (!isNaN(payment?.data?.base_reduced_tax))
    subtotal += Number(payment.data.base_reduced_tax);
  if (!isNaN(payment?.data?.base_state_tax))
    subtotal += Number(payment.data.base_state_tax);

  return subtotal;
};

export const getCreateTipAdjustStructureForBackend = (amount: string) => {
  const employeeLogged = useAuthStore.getState().employeeLogged;
  const currentEcrReference = useEcrStore.getState().setup.reference;

  const nextEcrReference =
    currentEcrReference == 999999 ? 1 : Number(currentEcrReference) + 1;

  if (!employeeLogged) throw "Employee must be logged";

  const tipAdjustStructure = {
    amount: amount,
    reference: nextEcrReference.toString(),
    employee: {
      id: (employeeLogged?.id || "").toString(),
      first_name: employeeLogged?.first_name,
      last_name: employeeLogged?.last_name,
    },
  };

  return tipAdjustStructure;
};

export const getAmountAvailableForSplit = (order: Order) => {
  return new Decimal(order.total).minus(order.paid).toNumber();
};

export const calculateAmountsForSplit = (
  checkTotal: number | string,
  persons = 1
) => {
  let amountsToPay = [];

  const total = new Decimal(checkTotal);
  let amountsSumatory = new Decimal(0);

  for (let i = 0; i < persons; i++) {
    let amount = total.dividedBy(persons).toFixed(2);

    if (i == persons - 1) {
      amount = total.minus(amountsSumatory).toFixed(2);
    }
    amountsSumatory = amountsSumatory.plus(amount);
    amountsToPay.push(amount);
  }

  return amountsToPay;
};

export const getBaseAmountToPay = (order: Order, amountsToPay: string[]) => {
  const checkTotal = new Decimal(order.total).minus(order.paid).toFixed();

  if (amountsToPay.length == 0) return checkTotal;
  if (isNaN(amountsToPay[0]) || amountsToPay[0] == "") return checkTotal;
  if (new Decimal(amountsToPay[0]).greaterThan(checkTotal)) return checkTotal;

  return amountsToPay[0];
};

export const getSubtotalAmountForTip = (
  order: Order,
  amountsToPay: string[]
) => {
  let totalAmountsToPay = amountsToPay.length || 1;

  let subtotalPendingToPay = new Decimal(order.cart.subtotal)
    .minus(new Decimal(order.paid).div(order.total).mul(order.cart.subtotal))
    .div(totalAmountsToPay);

  return subtotalPendingToPay.toNumber();
};

export const isNextPaymentAvailable = (splitAmountsToPay: string[]) => {
  if (splitAmountsToPay.length == 0) return false;

  if (isNaN(splitAmountsToPay[0]) || splitAmountsToPay[0] == "") return false;

  return true;
};

export const isNextPaymentAvailableBySplitOfProducts = (
  splitProductsToPay: any[]
) => {
  if (splitProductsToPay.length == 0) return false;

  return true;
};

export const convertEcrJournalIntoTransactionList = (ecrJournal: any) => {
  const transactions = [];

  for (const key in ecrJournal.reference_value) {
    if (ecrJournal.reference_value.hasOwnProperty(key)) {
      transactions.push(...ecrJournal.reference_value[key].trans);
    }
  }

  return transactions;
};
