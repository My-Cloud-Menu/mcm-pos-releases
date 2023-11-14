import { Order } from "mcm-types";
import { useCartStore } from "../../stores/cartStore";
import useAuthStore from "../auth/AuthStore";
import useOrderStore from "./OrdersStore";

export const checkOpenStatuses = [
  "new-order",
  "in-kitchen",
  "ready-for-pickup",
];

export const checkClosedStatuses = ["check-closed", "cancelled", "failed"];

export const getOrderStructure = () => {
  const cartStore = useCartStore.getState();

  const authStore = useAuthStore.getState();
  const inputValues = useOrderStore.getState().inputValues;

  let orderStructure: any = {
    payment_method: "ecr",
    experience: inputValues.experience,
    customer: {
      id: "",
      first_name: inputValues.first_name || "",
      last_name: "",
      phone: "",
    },
    employee: {
      id: (authStore.employeeLogged?.id || "").toString(),
      first_name:
        authStore.employeeLogged?.first_name ||
        authStore.employeeLogged?.middle_name ||
        "",
      last_name: authStore.employeeLogged?.last_name || "",
    },
    line_items: cartStore.cartProducts.map((cartProduct) => {
      return {
        product_id: cartProduct.product.id,
        variation_id: cartProduct.variation?.id || 0,
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

  if (inputValues.experience == "qe" && inputValues.table != undefined) {
    orderStructure = {
      ...orderStructure,
      table: {
        id: inputValues.table.id,
        label: inputValues.table?.name,
        revenue_center_id: inputValues.table?.revenueCenter.id,
      },
    };
  }
  return orderStructure;
};

export const getOrderExperienceLabel = (order: Order) => {
  if (
    order.cart.experience == "dl" &&
    order.cart.additional_properties?.isDropship
  )
    return "Dropship";
  else if (order.cart.experience == "dl") return "Delivery";
  else if (order.cart.experience == "qe")
    return `${order.cart.table.label || ""}`;
  else return "Pickup";
};

export const getOrderStatusLabel = (status: string) => {
  if (status == "new-order") return "New Order";
  else if (status == "pending-payment") return "Pending Payment";
  else if (status == "in-kitchen") return "Preparing";
  else if (status == "ready-for-pickup") return "Ready";
  else if (status == "check-closed") return "Closed";

  return status;
};

export const getOrderStatusColor = (status: string) => {
  if (status == "pending-payment") return "#000";
  else if (status == "new-order") return "#3865a3";
  else if (status == "in-kitchen") return "#FF8F00";
  else if (status == "ready-for-pickup") return "#FF8F00";
  else if (status == "check-closed") return "#2E7D32";

  return "#df490e";
};

export const getOrderNextStatus = (order: Order) => {
  if (order.status == "pending-payment") return "new-order";
  else if (order.status == "new-order") return "in-kitchen";
  else if (order.status == "in-kitchen") return "ready-for-pickup";
  else if (order.status == "ready-for-pickup") return "check-closed";
  else if (order.status == "check-closed") return null;

  return order.status;
};
