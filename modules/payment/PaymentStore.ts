import { create } from "zustand";
import { Payment } from "mcm-types";
import useAuthStore from "../auth/AuthStore";
import * as paymentApi from "./PaymentApi";
import useOrderStore from "../orders/OrdersStore";
import useEcrStore from "../ecr/EcrStore";

interface PaymentStore {
  inputValues: {
    tip?: number;
    selectedTip?: string | number;
  };
  showCustomTipModal: boolean;
  paymentCreated?: Payment;
  isLoading: boolean;
  createPayment: () => Promise<Payment>;
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

      console.log("payment fue creado :)", payment);
      set(() => ({ isLoading: false }));
    } catch (error) {
      console.log("ocurrio un error viejo :C");
      set(() => ({ isLoading: false }));

      throw error;
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
