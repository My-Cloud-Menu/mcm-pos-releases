import { create } from "zustand";
import { UpdateProductCart } from "../types";
import { Item_attibute, Product } from "mcm-types";
import { queryClient } from "../app/_layout";
import { orderSummaryQueryKey } from "../modules/orders/OrdersApi";

export interface ProductCartVariation {
  id: string;
  name: string;
  price: string;
}
export interface ProductCart {
  product: Product;
  quantity: number;
  attributes: Item_attibute[];
  variation?: ProductCartVariation;
}
export interface CartStore {
  cartProducts: Array<ProductCart>;
  addProduct: (cartProduct: ProductCart) => void;
  increaseProduct: (productIdx: number) => void;
  decrementProduct: (productIdx: number) => void;
  removeProduct: (cartProductId: number) => void;
  updateProduct: (cartProductId: number, product: UpdateProductCart) => void;
  clearCart: () => void;
  getSimilarProductIndex: (cartProduct: ProductCart) => number | boolean;
}

export const useCartStore = create<CartStore>((set, get) => ({
  cartProducts: [],
  getSimilarProductIndex: (product) => {
    const cartProducts = get().cartProducts;
    let idxFounded: number | boolean = false;

    cartProducts.forEach((item, idx) => {
      let isSimilar = true;

      if (
        item.product.id == product.product.id &&
        item.variation?.id == product.variation?.id &&
        item.attributes.length == product.attributes.length
      ) {
        for (let i = 0; i < item.attributes.length; i++) {
          if (
            item.attributes[i].label != product.attributes[i].label ||
            item.attributes[i].value != product.attributes[i].value
          ) {
            isSimilar = false;
          }
        }
      } else {
        isSimilar = false;
      }

      if (isSimilar) {
        idxFounded = idx;
      }
    });

    return idxFounded;
  },
  addProduct: (newCartProduct) => {
    let { getSimilarProductIndex, cartProducts } = get();

    const similarProductIdx = getSimilarProductIndex(newCartProduct);

    if (typeof similarProductIdx == "number") {
      cartProducts[similarProductIdx].quantity += newCartProduct.quantity;
    } else {
      cartProducts.push(newCartProduct);
    }

    set(() => ({
      cartProducts: [...cartProducts],
    }));

    queryClient.invalidateQueries([orderSummaryQueryKey]);
  },
  increaseProduct: (productIdx) => {
    let { cartProducts } = get();

    cartProducts[productIdx].quantity++;

    set(() => ({
      cartProducts: [...cartProducts],
    }));
    queryClient.invalidateQueries([orderSummaryQueryKey]);
  },
  decrementProduct: (productIdx) => {
    let { cartProducts } = get();

    const newQuantity = cartProducts[productIdx].quantity - 1;

    if (newQuantity >= 1) {
      cartProducts[productIdx].quantity = newQuantity;
    } else {
      cartProducts = cartProducts.filter(
        (cartProduct, idx) => idx != productIdx
      );
    }

    set(() => ({
      cartProducts: [...cartProducts],
    }));
    queryClient.invalidateQueries([orderSummaryQueryKey]);
  },
  updateProduct: (cartProductId: number, product: UpdateProductCart) => {
    set(({ cartProducts }) => ({
      cartProducts: cartProducts.map((cardProduct) => {
        if (cardProduct.product.id === cartProductId) {
          return {
            ...cardProduct,
            ...product,
          };
        }
        return cardProduct;
      }),
    }));
  },
  removeProduct: (cartProductId) => {
    set(({ cartProducts }) => ({
      cartProducts: cartProducts.filter(
        (cartProduct) => cartProduct.product.id !== cartProductId
      ),
    }));
  },
  clearCart: () => {
    set(() => ({
      cartProducts: [],
    }));
  },
}));
