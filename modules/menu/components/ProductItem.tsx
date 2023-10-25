import { Pressable, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Colors,
  Image,
  Text,
  TextField,
  View,
} from "react-native-ui-lib";
import { shadowProps } from "../../common/theme/shadows";
import { useCartStore } from "../../../stores/cartStore";
import { formatCurrency } from "../../common/UtilsHelper";
import IngredientAccordion from "./IngredientAccordion";
import { Ingredient, IngredientGroup, Product } from "mcm-types";
import {
  calculateIngredientsPriceTotal,
  getIngredientsIncludedInProduct,
  getIngredientsSelectedFormattedForCart,
  validateIngredientsSelection,
} from "../MenuHelper";
import { showAlert } from "../../common/AlertHelper";
import Counter from "./Counter";
import AllergiesChipSelector from "./AllergiesChipSelector";

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

type props = {
  product: Product;
  isActive?: boolean;
  onPress?: () => void;
  ingredients: Ingredient[];
  ingredientsGroups: IngredientGroup[];
};

const ProductItem = ({
  product,
  isActive = false,
  onPress = undefined,
  ingredients = [],
  ingredientsGroups = [],
}: props) => {
  const cartStore = useCartStore();

  const [ingredientsSelected, setIngredientsSelected] = useState<any[]>([]);
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const [quantitySelected, setQuantitySelected] = useState(1);
  const [notes, setNotes] = useState("");
  const [allergiesSelected, setAllergiesSelected] = useState<string[]>([]);

  useEffect(() => {
    setAdditionalPrice(calculateIngredientsPriceTotal(ingredientsSelected));
  }, [ingredientsSelected]);

  const onIncrementProductQuantity = () =>
    setQuantitySelected(quantitySelected + 1);

  const onDecreaseProductQuantity = () =>
    setQuantitySelected(quantitySelected - 1);

  const onPressAddToCart = () => {
    if (!validateIngredientsSelection(ingredientsSelected)) {
      if (!isActive && onPress) onPress();

      return;
    }
    cartStore.addProduct({
      product: product,
      quantity: quantitySelected,
      attributes: getIngredientsSelectedFormattedForCart(
        ingredientsSelected,
        notes,
        allergiesSelected
      ).attributesFormatted,
    });
    setQuantitySelected(1);
    setNotes("");
    setAllergiesSelected([]);
    showAlert({
      type: "success",
      title: `(${quantitySelected}) ${product.name} added successfully`,
    });
  };

  useEffect(() => {
    if (!isActive) {
      setQuantitySelected(1);
      setNotes("");
      setAllergiesSelected([]);
      // setIngredientsSelected([]);
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      <View flex>
        <Pressable onPress={() => onPress && onPress()}>
          <View row marginB-12>
            <Image
              source={{ uri: product.image.normal }}
              style={styles.image}
            />
            <View marginL-20 style={{ width: "100%" }}>
              <Text text60 black style={{ maxWidth: "40%" }}>
                {product.name.slice(0, 26)}
                {product.name.length > 26 ? "..." : ""}
              </Text>
              <View row style={{ maxWidth: "50%", flexWrap: "wrap" }}>
                {getIngredientsIncludedInProduct(product, ingredients).map(
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
        </Pressable>

        <View paddingH-5>
          <IngredientAccordion
            isActive={isActive}
            product={product}
            ingredients={ingredients}
            ingredientsGroups={ingredientsGroups}
            groupsForSelection={ingredientsSelected}
            setGroupsForSelection={setIngredientsSelected}
          />
        </View>

        {isActive && (
          <View marginT-20 paddingH-10>
            <TextField
              value={notes}
              onChangeText={(value) => {
                setNotes(value);
              }}
              maxLength={150}
              placeholder="Comments"
              floatingPlaceholder
              fieldStyle={{
                borderBottomWidth: 1,
                borderColor: Colors.black,
                paddingBottom: 4,
              }}
            />
            <View style={{ marginTop: 30 }}>
              <Text style={{ marginBottom: 10 }}>Allergies</Text>
              <AllergiesChipSelector
                allergiesSelected={allergiesSelected}
                onChangeAllergiesSelected={setAllergiesSelected}
              />
            </View>
          </View>
        )}
      </View>
      <View marginV-20 />
      {isActive && (
        <Counter
          min={1}
          quantity={quantitySelected}
          onDecrease={onDecreaseProductQuantity}
          onIncrement={onIncrementProductQuantity}
        />
      )}
      <Button
        onPress={onPressAddToCart}
        marginT-20
        marginH-5
        size="medium"
        label={
          quantitySelected != 1
            ? `Add ${quantitySelected} Item to Cart`
            : "Add to Cart"
        }
        fullWidth
      />
    </View>
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
