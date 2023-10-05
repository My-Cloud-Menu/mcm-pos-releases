import { create } from "zustand";
import { createOrderInBackend } from "./OrdersApi";
import useAuthStore from "../auth/AuthStore";
import { useCartStore } from "../../stores/cartStore";
import { payment_method_available } from "../../types";
import { Order } from "mcm-types/src/order";

interface OrderStore {
  isLoading: boolean;
  error: any;
  inputValues: {
    first_name: string;
    payment_method: payment_method_available;
  };
  // selectedOrderId?: string;
  // changeSelectedOrderId: () => void;
  createOrder: () => Promise<Order>;
  changeInputValue: (propertyName: string, value: any) => void;
  isCreateOrderAvailable: () => boolean;
}

const useOrderStore = create<OrderStore>((set, get) => ({
  isLoading: false,
  error: null,
  // selectedOrderId: undefined,
  inputValues: {
    first_name: "",
    payment_method: "ecr-card",
  },
  // changeSelectedOrderId: (orderId?: string) =>
  //   set(() => ({ selectedOrderId: orderId })),
  isCreateOrderAvailable: () => {
    const cartStore = useCartStore.getState();
    const isLoading = get().isLoading;

    return cartStore.cartProducts.length > 0 && !isLoading;
  },
  changeInputValue: (propertyName, value) => {
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
        payment_method: "ecr",
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
