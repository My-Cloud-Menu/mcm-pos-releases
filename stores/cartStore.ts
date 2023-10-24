import { create } from "zustand";
import { UpdateProductCart } from "../types";
import { Item_attibute, Product } from "mcm-types";

export interface ProductCart {
  product: Product;
  quantity: number;
  attributes: Item_attibute[];
}
export interface CartStore {
  cartProducts: Array<ProductCart>;
  addProduct: (cartProduct: ProductCart) => void;
  increaseProduct: (cartProductId: number) => void;
  decrementProduct: (cartProductId: number) => void;
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
    const { getSimilarProductIndex, cartProducts } = get();

    const similarProductIdx = getSimilarProductIndex(newCartProduct);

    if (typeof similarProductIdx == "number") {
      cartProducts[similarProductIdx].quantity += newCartProduct.quantity;
    } else {
      cartProducts.push(newCartProduct);
    }

    set(() => ({
      cartProducts: [...cartProducts],
    }));
  },
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
