import { useCartStore } from "../../stores/cartStore";
import useAuthStore from "../auth/AuthStore";
import useOrderStore from "./OrdersStore";

export const getOrderStructure = () => {
  const cartStore = useCartStore.getState();

  const authStore = useAuthStore.getState();
  const inputValues = useOrderStore.getState().inputValues;

  let orderStructure: any = {
    payment_method: "ecr",
    experience: inputValues.experience,
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
        attributes: cartProduct.attributes,
        additional_properties: {},
      };
    }),
  };

  if (inputValues.experience == "dl") {
    orderStructure = {
      ...orderStructure,
      shipping_address: {
        latitude: "0",
        longitude: "0",
        reference: "test",
      },
    };
  }

  return orderStructure;
};
