import React from "react";
import { StyleSheet } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";
import { useCartStore } from "../../../stores/cartStore";
import { formatCurrency } from "../../common/UtilsHelper";

const CartCharges = () => {
  const { cartProducts } = useCartStore();
  const subTotal = cartProducts.reduce(
    (acc, curr) => acc + curr.product.price * curr.quantity,
    0
  );
  const tax = parseFloat((subTotal * 0.1).toFixed(2));

  return (
    <View paddingT-10 style={{}}>
      <View row spread>
        <Text text80>Subtotal</Text>
        <Text text80>
          <Text text100L>$ </Text>
          {formatCurrency(subTotal)}
        </Text>
      </View>
      {/* <View row spread marginT-13>
        <Text text80 $textNeutral>
          Tax (10%)
        </Text>
        <Text text80>
          <Text text100L>$ </Text>{tax}
        </Text>
      </View> */}
      <View
        style={{
          marginTop: 15,
          borderTopWidth: 1,
          borderTopColor: Colors.gray,
          borderStyle: "dashed",
        }}
      />
      <View row spread marginT-16 style={{}}>
        <Text text60>Total</Text>
        <Text text60 style={{ padding: 10 }}>
          <Text text100L style={{}}>
            ${" "}
          </Text>
          {formatCurrency(subTotal)}
        </Text>
      </View>
    </View>
  );
};

export default CartCharges;

const styles = StyleSheet.create({});
