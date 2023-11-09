import { StyleSheet } from "react-native";
import React from "react";
import { Image, Text, View } from "react-native-ui-lib";
import { formatCurrency } from "../../common/UtilsHelper";
import { ProductCart, useCartStore } from "../../../stores/cartStore";
import Counter from "./Counter";
import { getProductImage, getTotalProductInCart } from "../MenuHelper";

type Props = { product: ProductCart; productIdx: number };

const CartItem = ({ product, productIdx }: Props) => {
  const cartStore = useCartStore();
  return (
    <View
      style={{
        backgroundColor: "#f9f8fb",
        paddingVertical: 2,
        paddingHorizontal: 1,
        borderRadius: 8,
      }}
    >
      <View row>
        <Image
          source={{ uri: getProductImage(product.product) }}
          style={styles.image}
        />

        <View marginL-13 flex>
          <Text style={{ fontWeight: "bold", fontSize: 16 }} black>
            {product.product.name}
          </Text>
          {product.variation && (
            <Text text90 marginV-2>
              {product.variation.name}
            </Text>
          )}
          <View>
            {product.attributes.map((attrib) => {
              let extraPrice = Array.isArray(attrib.price)
                ? attrib.price.reduce((a, b) => a + Number(b), 0).toFixed(2)
                : attrib.price;

              return (
                <View marginV-4>
                  <Text text90 style={{ fontWeight: "bold" }}>
                    {attrib.label}{" "}
                  </Text>
                  <Text text90L grey20>
                    {attrib.value}
                    {extraPrice > 0.0 && (
                      <Text> ({formatCurrency(extraPrice)})</Text>
                    )}
                  </Text>
                </View>
              );
            })}
          </View>
          <View flex row bottom spread marginT-10 paddingR-8>
            <Text $textNeutralHeavy>
              <Text text100L>$</Text>{" "}
              {formatCurrency(getTotalProductInCart(product), true)}
            </Text>

            <Counter
              quantity={product.quantity}
              onIncrement={() => cartStore.increaseProduct(productIdx)}
              onDecrease={() => cartStore.decrementProduct(productIdx)}
              min={0}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});
