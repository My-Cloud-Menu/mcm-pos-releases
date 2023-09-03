import { create } from "zustand";
import { Category, GlobalStore } from "../types";

export const useGlobal = create<GlobalStore>(set => ({
  selectedCategory: null,
  setSelectedCategory: (category: Category | null, cb?: Function) => {
   set(() => ({ selectedCategory: category }))
   cb && cb();
  }
}))