import { Pressable, StyleSheet } from "react-native";
import React from "react";
import {
  Badge,
  Button,
  Chip,
  Colors,
  Image,
  Text,
  View,
} from "react-native-ui-lib";
import { FlashList } from "@shopify/flash-list";
import IngredientGroupItem from "./IngredientGroupItem";
import { shadowProps } from "../../common/theme/shadows";
import { useCartStore } from "../../../stores/cartStore";
import { AntDesign } from "@expo/vector-icons";
import { Ingredient } from "../../../types";
import { formatCurrency } from "../../common/UtilsHelper";

const ProductChip = ({
  label = "",
  backgroundColor = "#e0e0e0",
}: {
  label: string;
  backgroundColor?: string;
}) => {
  return (
    <View
      style={{
        marginRight: 10,
        marginTop: 5,
        backgroundColor: backgroundColor,
        paddingVertical: 2,
        paddingHorizontal: 7,
        borderRadius: 8,
      }}
    >
      <Text text100L style={{ color: "#000" }}>
        {label}
      </Text>
    </View>
  );
};

const ProductItem = ({
  product,
  isActive = false,
  onPress = null,
  ingredients = [],
}: any) => {
  const {
    addProduct,
    updateProduct,
    cartProducts,
    increaseProduct,
    decrementProduct,
  } = useCartStore();

  const quantity =
    cartProducts.find((cartProduct) => cartProduct.product.id === product.id)
      ?.quantity || 0;

  const getIngredientsIncludedInProduct = () => {
    let ingredientsIncluded = [];

    if (Array.isArray(product?.ingredients)) {
      let ingredientsIncludedIds = product.ingredients.map(
        (ingredient: Ingredient) => ingredient.id
      );

      ingredientsIncluded = ingredients.filter((ingredient: Ingredient) =>
        ingredientsIncludedIds.includes(ingredient.id)
      );
    }

    return ingredientsIncluded;
  };

  return (
    <Pressable onPress={() => onPress && onPress()} style={styles.container}>
      <View flex>
        <View row>
          <Image source={{ uri: product.image.normal }} style={styles.image} />
          <View marginL-20 style={{ width: "100%" }}>
            <Text text60 black style={{ maxWidth: "40%" }}>
              {product.name.slice(0, 26)}
              {product.name.length > 26 ? "..." : ""}
            </Text>
            <View row style={{ maxWidth: "50%", flexWrap: "wrap" }}>
              {getIngredientsIncludedInProduct().map(
                (ingredient: Ingredient) => (
                  <ProductChip
                    key={`product-${product.id}-ingredientincluded-${ingredient.id}`}
                    label={ingredient.name}
                    backgroundColor={
                      ingredient.stock_status == "instock"
                        ? "#e0e0e0"
                        : "#E57373"
                    }
                  />
                )
              )}
            </View>
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
              {formatCurrency(product.price, true)}
            </Text>
          </View>
        </View>

        {isActive && false && (
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
      </View>
      {quantity ? (
        <View centerH>
          <View
            style={{
              flexDirection: "row",
              gap: 5,
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <AntDesign
              onPress={() => quantity > 0 && decrementProduct(product.id)}
              name="minus"
              size={20}
              color={Colors.primary}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 7,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: Colors.primary,
                textAlign: "center",
              }}
            />
            <Text
              style={{
                fontWeight: "bold",
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 1,
                fontSize: 20,
              }}
            >
              {quantity}
            </Text>
            <AntDesign
              onPress={() => increaseProduct(product.id)}
              name="plus"
              size={20}
              color={Colors.primary}
              style={{
                paddingVertical: 5,
                paddingHorizontal: 7,
                color: "white",
                backgroundColor: Colors.primary,
                borderRadius: 5,
                textAlign: "center",
              }}
            />
          </View>
        </View>
      ) : (
        <Button
          onPress={() => addProduct({ product, quantity: 1 })}
          marginT-20
          marginH-5
          size="medium"
          label="Add to Cart"
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
