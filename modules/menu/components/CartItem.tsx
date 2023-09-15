import { StyleSheet } from "react-native";
import React from "react";
import { Badge, Button, Colors, Image, Text, View } from "react-native-ui-lib";
import { FlashList } from "@shopify/flash-list";
import { Feather } from "@expo/vector-icons";
import { ProductCart } from "../../../types";
import { formatCurrency } from "../../common/UtilsHelper";

const imageUrl =
  "https://comeperuano.b-cdn.net/wp-content/uploads/2020/10/receta-frappuccino.jpg";
type Props = { product: ProductCart };
const CartItem = ({ product }: Props) => {
  return (
    <View style={styles.container}>
      <View row>
        <Image
          source={{ uri: product.product.images[0].normal }}
          style={styles.image}
        />

        <View marginL-13>
          <Text text65>{product.product.name}</Text>

          <View row bottom marginT-10>
            <Text text90 marginL-1>
              x{product.quantity}
            </Text>
            <Text text90L marginL-20>
              Notes <Feather name="edit-3" color={Colors.primary} />
            </Text>
            <Text $textNeutralHeavy marginL-50>
              <Text text100L>$</Text>{" "}
              {formatCurrency(
                Number(product.product.price * product.quantity),
                true
              )}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});
