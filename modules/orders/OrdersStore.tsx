import { create } from "zustand";
import { createOrderInBackend } from "./OrdersApi";
import useAuthStore from "../auth/AuthStore";
import { useCartStore } from "../../stores/cartStore";
import { OrderStore } from "../../types";
import { queryClient } from "../../app/_layout";

const useOrderStore = create<OrderStore>((set, get) => ({
  isLoading: false,
  error: null,
  inputValues: {
    first_name: "",
  },
  isCreateOrderAvailable: () => {
    const cartStore = useCartStore.getState();
    const isLoading = get().isLoading;

    return cartStore.cartProducts.length > 0 && !isLoading;
  },
  changeInputValue: (propertyName: string, value: string) => {
    set((state) => ({
      inputValues: { ...state.inputValues, [propertyName]: value },
    }));
  },
  createOrder: async () => {
    set(() => ({ isLoading: true, error: null }));

    try {
      // Create Body Structure
      const cartStore = useCartStore.getState();
      const authStore = useAuthStore.getState();
      const inputValues = get().inputValues;

      let orderStructure = {
        payment_method: "cod",
        customer: {
          id: "",
          first_name: inputValues.first_name,
          last_name: "",
          phone: "",
        },
        employee: {
          id: (authStore.employeeLogged?.id || "").toString(),
          first_name: authStore.employeeLogged?.first_name,
          last_name: authStore.employeeLogged?.last_name,
        },
        line_items: cartStore.cartProducts.map((cartProduct) => {
          return {
            product_id: cartProduct.product.id,
            variation_id: 0,
            quantity: cartProduct.quantity,
            notes: "",
            attributes: [],
            additional_properties: {},
          };
        }),
      };

      const result = await createOrderInBackend(orderStructure);

      cartStore.clearCart();
      queryClient.invalidateQueries({ queryKey: ["/orders"] });

      set((state) => ({
        isLoading: false,
        inputValues: { ...state.inputValues, first_name: "" },
      }));

      return result.order;
    } catch (error: any) {
      let errorMessage = "Something went wrong";

      set(() => ({ isLoading: false, error: errorMessage }));

      throw error;
    }
  },
}));

export default useOrderStore;
