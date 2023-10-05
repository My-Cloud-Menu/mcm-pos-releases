import { create } from "zustand";
import useAuthStore from "../auth/AuthStore";
import * as paymentApi from "./PaymentApi";
import useOrderStore from "../orders/OrdersStore";
import useEcrStore from "../ecr/EcrStore";
import { ecrSaleResponse } from "../../types";
import { Payment } from "mcm-types/src/payment";

interface PaymentStore {
  inputValues: {
    tip?: number;
    selectedTip?: string | number;
  };
  showCustomTipModal: boolean;
  paymentCreated?: Payment;
  ecrResult?: ecrSaleResponse;
  isLoading: boolean;
  updatePaymentPaidSuccessfully: () => Promise<Payment>;
  createPayment: (orderId: string) => Promise<Payment>;
  handlePaymentInEcr: () => Promise<any>;
  changeShowCustomTipModal: (show: boolean) => void;
  changeInputValue: (propertyName: string, value: any) => void;
}

const usePaymentStore = create<PaymentStore>((set, get) => ({
  isLoading: false,
  inputValues: {
    tipAmount: undefined,
    selectedTip: undefined,
  },
  showCustomTipModal: false,
  paymentCreated: undefined,
  ecrResult: undefined,
  updatePaymentPaidSuccessfully: async () => {
    set(() => ({ isLoading: true }));

    const { paymentCreated, ecrResult } = get();

    if (ecrResult == undefined || paymentCreated == undefined)
      throw "Payment error";

    try {
      const result = await paymentApi.updatePaymentPaidSuccessfullyInBackend(
        paymentCreated,
        ecrResult
      );

      console.log("Payment Updated in Backend :3");
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  createPayment: async (orderId: string) => {
    set(() => ({ isLoading: true }));

    const inputValues = get().inputValues;
    const employeeLogged = useAuthStore.getState().employeeLogged;
    const payment_method_selected =
      useOrderStore.getState().inputValues.payment_method;
    const currentEcrReference = useEcrStore.getState().setup.reference;

    const nextEcrReference =
      currentEcrReference == 999999 ? 1 : currentEcrReference + 1;

    if (!employeeLogged) throw "Employee must be logged";

    try {
      const payment = await paymentApi.createPayment({
        orders_ids: [orderId],
        method: payment_method_selected,
        employee: {
          id: employeeLogged?.id,
          first_name: employeeLogged?.first_name,
          last_name: employeeLogged?.last_name,
        },
        reference: nextEcrReference.toString(),
        tip: inputValues?.tip?.toString(),
      });

      console.log("pago creado en backend mcm");
      set(() => ({ paymentCreated: payment }));
      return payment;
    } catch (error) {
      throw error;
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  handlePaymentInEcr: async () => {
    set(() => ({ isLoading: true }));

    const { paymentCreated, inputValues } = get();
    const paymentMethodSelected =
      useOrderStore.getState().inputValues.payment_method;

    const excludeTip = inputValues.selectedTip === 0;

    if (paymentCreated == undefined) throw "Payment error";

    try {
      let ecrResult: any;

      if (paymentMethodSelected == "ecr-card") {
        ecrResult = await paymentApi.makeEcrCardSale(
          paymentCreated,
          excludeTip
        );
      } else {
        ecrResult = await paymentApi.makeEcrCashSale(
          paymentCreated,
          excludeTip
        );
      }

      console.log("ECR Handled");
      set(() => ({ ecrResult: ecrResult }));
      console.log(ecrResult);
      return ecrResult;
    } catch (error) {
      throw error;
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
  changeShowCustomTipModal: (show = false) => {
    set(() => ({
      showCustomTipModal: show,
    }));
  },
  changeInputValue: (propertyName, value) => {
    set((state) => ({
      inputValues: { ...state.inputValues, [propertyName]: value },
    }));
  },
}));

export default usePaymentStore;
