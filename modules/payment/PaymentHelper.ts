import useAuthStore from "../auth/AuthStore";
import useEcrStore from "../ecr/EcrStore";
import useOrderStore from "../orders/OrdersStore";
import usePaymentStore from "./PaymentStore";
import * as paymentApi from "./PaymentApi";

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
