import useAuthStore from "../auth/AuthStore";
import useEcrStore from "../ecr/EcrStore";
import useOrderStore from "../orders/OrdersStore";
import usePaymentStore from "./PaymentStore";
import * as paymentApi from "./PaymentApi";
import { Colors } from "react-native-ui-lib";
import { Payment } from "mcm-types";

export const getCreatePaymentStructureForBackend = ({
  orderId,
}: {
  orderId: string;
}) => {
  const inputValues = usePaymentStore.getState().inputValues;
  const employeeLogged = useAuthStore.getState().employeeLogged;
  const payment_method_selected =
    useOrderStore.getState().inputValues.payment_method;
  const currentEcrReference = useEcrStore.getState().setup.reference;

  const nextEcrReference =
    currentEcrReference == 999999 ? 1 : currentEcrReference + 1;

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
  if (paymentMethod == "ecr-card") paymentMethod = "Card";

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
    currentEcrReference == 999999 ? 1 : currentEcrReference + 1;

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
