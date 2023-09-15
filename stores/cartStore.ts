import { create } from "zustand";
import { CartStore, ProductCart, UpdateProductCart } from "../types";

export const useCartStore = create<CartStore>((set) => ({
  cartProducts: [],

  addProduct: (cartProduct) =>
    set(({ cartProducts }) => ({
      cartProducts: [...cartProducts, cartProduct],
    })),
  increaseProduct: (cartProductId) => {
    set(({ cartProducts }) => ({
      cartProducts: cartProducts.map((cardProduct) =>
        cardProduct.product.id === cartProductId
          ? {
              ...cardProduct,
              quantity: cardProduct.quantity + 1,
            }
          : cardProduct
      ),
    }));
  },
  decrementProduct: (cartProductId) => {
    set(({ cartProducts }) => {
      const d: ProductCart[] = cartProducts
        .map((cardProduct) => {
          if (
            cardProduct.quantity === 1 &&
            cardProduct.product.id === cartProductId
          ) {
            return null;
          }
          if (cardProduct.product.id === cartProductId) {
            return {
              ...cardProduct,
              quantity: cardProduct.quantity - 1,
            };
          }
          return cardProduct;
        })
        .filter((x) => x !== null) as ProductCart[];

      return {
        cartProducts: d,
      };
    });
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
