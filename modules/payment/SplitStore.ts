import { create } from "zustand";

interface SplitStore {
  quantityDesiredToPay: number;
  splitAmountsToPay: string[];
  splitProductsToPay: any[];
  setSplitAmountsToPay: (
    splitAmountsToPay: string[],
    quantityDesiredToPay?: number
  ) => void;
  setSplitProductsToPay: (
    splitAmountsToPay: any[],
    quantityDesiredToPay?: number
  ) => void;
  onSplitAmountPayFinish: () => void;
  onSplitProductsPayFinish: () => void;
  resetSplitPayment: () => void;
}

export const useSplitStore = create<SplitStore>((set, get) => ({
  quantityDesiredToPay: 1,
  splitAmountsToPay: [],
  splitProductsToPay: [],
  resetSplitPayment: () => {
    set(() => ({
      quantityDesiredToPay: 1,
      splitAmountsToPay: [],
      splitProductsToPay: [],
    }));
  },
  setSplitAmountsToPay: (splitAmountsToPay, quantityDesiredToPay = 1) => {
    set(() => ({
      splitAmountsToPay: splitAmountsToPay,
      quantityDesiredToPay: quantityDesiredToPay,
    }));
  },
  onSplitAmountPayFinish: () => {
    let { splitAmountsToPay, setSplitAmountsToPay } = get();
    splitAmountsToPay.shift();
    setSplitAmountsToPay(splitAmountsToPay);
  },
  setSplitProductsToPay: (splitProductsToPay, quantityDesiredToPay = 1) => {
    set(() => ({
      splitProductsToPay: splitProductsToPay,
      quantityDesiredToPay: quantityDesiredToPay,
    }));
  },
  onSplitProductsPayFinish: () => {
    let { splitProductsToPay, setSplitProductsToPay } = get();
    splitProductsToPay.shift();
    setSplitProductsToPay(splitProductsToPay);
  },
}));

export default useSplitStore;
