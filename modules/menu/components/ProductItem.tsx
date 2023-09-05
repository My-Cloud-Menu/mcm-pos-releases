import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { Button, Colors, Image, Text, View } from "react-native-ui-lib";
import { FlashList } from "@shopify/flash-list";
import IngredientGroupItem from "./IngredientGroupItem";
import { shadowProps } from "../../common/theme/shadows";
import { useCart } from "../../../stores/cart";
import { AntDesign } from "@expo/vector-icons";

const ProductItem = ({ product, isActive = false, onPress = null }: any) => {
  const { addProduct, updateProduct, cartProducts, increaseProduct, decrementProduct } = useCart();
  const quantity = cartProducts.find(cartProduct => cartProduct.product.id === product.id)?.quantity || 0;

  return (
    <Pressable onPress={() => onPress && onPress()} style={styles.container}>
      <View row>
        <Image source={{ uri: product.image.normal }} style={styles.image} />
        <View marginL-20 style={{ width: "100%" }}>
          <Text text60L black style={{ maxWidth: "40%" }}>
            {product.name}
          </Text>
          <Text
            marginT-10
            text90L
            color={Colors.gray}
            style={{ maxWidth: "55%", padding: 5 }}
          >
            {product.description}
          </Text>
          <Text text65BL black marginT-12 style={{ padding: 5 }}>
            <Text text100 black $textNeutralLight text65BL>
              ${" "}
            </Text>
            {product.price}
          </Text>
        </View>

      </View>

      {isActive && (
        <FlashList
          contentContainerStyle={{ paddingTop: 15, paddingHorizontal: 10 }}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          data={[
            { name: "Size" },
            { name: "Sugar" },
            { name: "Ice" },
            { name: "Mood" },
          ]}
          renderItem={({ item }) => {
            return <IngredientGroupItem ingredient={item} />;
          }}
          estimatedItemSize={4}
        />
      )}
      {quantity ? (
        <View
          style={{
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            marginTop: 10
          }}
        >
          <AntDesign
            onPress={() => quantity > 0 && decrementProduct(product.id)}
            name="minus"
            size={20}
            color="rgb(119,198,159)"
            style={{
              padding: 5,
              borderWidth: 1,
              borderColor: 'rgb(119,198,159)',
              borderRadius: 5,
              textAlign: 'center'
            }}
          />
          <Text
            style={{
              fontWeight: 'bold',
              paddingHorizontal: (10),
              paddingVertical: (2),
              borderRadius: (1),
              fontSize: (20)
            }}
          >{quantity}</Text>
          <AntDesign
            onPress={() => increaseProduct(product.id)}
            name="plus"
            size={(20)}
            color="rgb(119,198,159)"
            style={{
              padding: 5,
              color: 'white',
              backgroundColor: `rgb(119,198,159)`,
              borderRadius: 5,
              textAlign: 'center'
            }}
          />
        </View>
      )
        : (
          <Button
            onPress={() => addProduct({ product, quantity: 1 })}
            marginT-20
            marginH-5
            size="medium"
            label="Add to Billing"
            fullWidth
          />
        )}
    </Pressable>

  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 3,
    paddingVertical: 8,
    marginHorizontal: 3,
    borderRadius: 8,
    backgroundColor: Colors.white,
    ...shadowProps,
  },
  imageContainer: {
    backgroundColor: Colors.graySoft,
    textAlign: "center",
    borderRadius: 8,
  },
  image: {
    marginLeft: 10,
    width: 110,
    height: 110,
    borderRadius: 8,
  },
});
