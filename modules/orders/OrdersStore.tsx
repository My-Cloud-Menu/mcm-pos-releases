import { create } from "zustand";
import { payment_method_available } from "../../types";
import { Table } from "mcm-types";

interface InputValues {
  first_name: string;
  payment_method: payment_method_available;
  experience: "pu" | "dl" | "qe";
  table?: Table;
  coupon_code: string;
}

interface OrderStore {
  isLoading: boolean;
  error: any;
  inputValues: InputValues;
  changeInputValue: (propertyName: string, value: any) => void;
  resetInputValues: () => void;
}

const initialInputValues: InputValues = {
  first_name: "",
  payment_method: "ecr-card",
  experience: "pu",
  table: undefined,
  coupon_code: "",
};

const useOrderStore = create<OrderStore>((set, get) => ({
  isLoading: false,
  error: null,
  inputValues: initialInputValues,
  changeInputValue: (propertyName, value) => {
    set((state) => ({
      inputValues: { ...state.inputValues, [propertyName]: value },
    }));
  },
  resetInputValues: () => {
    set(() => ({
      inputValues: initialInputValues,
    }));
  },
}));

export default useOrderStore;
