import { create } from "zustand";

const initialInputValues = {
  tipAmount: undefined,
  selectedTip: undefined,
};
interface PaymentStore {
  inputValues: {
    tip?: number;
    selectedTip?: string | number;
  };
  showCustomTipModal: boolean;
  changeShowCustomTipModal: (show: boolean) => void;
  changeInputValue: (propertyName: string, value: any) => void;
  resetInputValues: () => void;
}

const usePaymentStore = create<PaymentStore>((set, get) => ({
  isLoading: false,
  inputValues: initialInputValues,
  showCustomTipModal: false,
  resetInputValues: () => {
    set(() => ({
      inputValues: initialInputValues,
    }));
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
