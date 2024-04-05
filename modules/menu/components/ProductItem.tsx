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
import { ProductCartVariation, useCartStore } from "../../../stores/cartStore";
import { formatCurrency } from "../../common/UtilsHelper";
import IngredientAccordion from "./IngredientAccordion";
import { Ingredient, IngredientGroup, Product } from "mcm-types";
import {
  calculateIngredientsPriceTotal,
  getIngredientsIncludedInProduct,
  getIngredientsSelectedFormattedForCart,
  getProductImage,
  isProductInStock,
  validateIngredientsSelection,
} from "../MenuHelper";
import { showAlert } from "../../common/AlertHelper";
import Counter from "./Counter";
import AllergiesChipSelector from "./AllergiesChipSelector";
import { Modal } from "react-native-ui-lib";
const getProductVariationsAvailable = (product: Product) => {
  return product.variations.filter(
    (variation) => variation.stock_status == "instock"
  );
};

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
  product: initialProduct,
  isActive = false,
  onPress = undefined,
  ingredients = [],
  ingredientsGroups = [],
}: props) => {
  const cartStore = useCartStore();

  const [product, setProduct] = useState(initialProduct);
  const [ingredientsSelected, setIngredientsSelected] = useState<any[]>([]);
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const [quantitySelected, setQuantitySelected] = useState(1);
  const [notes, setNotes] = useState("");
  const { isClose, toggleOpen } = useCartStore();
  const [allergiesSelected, setAllergiesSelected] = useState<string[]>([]);
  const [variationSelected, setVariationSelected] = useState<
    ProductCartVariation | undefined
  >(undefined);

  const variationsAvailable = getProductVariationsAvailable(initialProduct);
  const isInStock = isProductInStock(initialProduct);

  useEffect(() => {
    if (variationsAvailable.length > 0 && !variationSelected) {
      onChangeVariation(variationsAvailable[0]);
    }
  }, [initialProduct]);

  const onChangeVariation = (variation: any) => {
    setVariationSelected(variation);
    setProduct({
      ...product,
      price: variation.price,
      ingredients: variation.ingredients,
    });
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      variation: variationSelected,
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
    handleClose();
    toggleOpen();
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
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      <View paddingT-20 paddingH-10>
        <Pressable onPress={() => onPress && onPress()}>
          <View>
            {!product.isImageHidden && (
              <Image
                source={{ uri: getProductImage(product) }}
                style={styles.image}
              />
            )}
            <View style={{ width: "100%" }}>
              <Text
                text65
                black
                style={{
                  maxWidth: "100%",
                  fontWeight: "bold",
                  padding: 10,
                }}
              >
                {product.name.slice(0, 26)}
                {product.name.length > 26 ? "..." : ""}
              </Text>
              {product.description && (
                <Text text65 black style={{ padding: 10 }}>
                  {product.description?.slice(0, 100)}
                  ...
                </Text>
              )}
            </View>
          </View>
        </Pressable>
        <View>
          <Modal visible={open} onRequestClose={handleClose} transparent>
            <View
              style={{
                position: "absolute",
                top: "50%",
                left: "45%",
                width: "50%",
                backgroundColor: "white",
                borderRadius: 16,
                transform: "translate(-50%, -50%)",
                borderWidth: 2,
                borderColor: "black",
                padding: 16,
                overflowX: "auto",
                overflowY: "scroll",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: "75%",
                  }}
                >
                  <Text text65 marginB-3 style={{ fontWeight: "bold" }}>
                    Add Customization to {product.name}
                  </Text>
                  <Text>{product.description}</Text>
                </View>

                <Button
                  onPress={handleClose}
                  color="black"
                  style={{
                    backgroundColor: "white",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </Button>
              </View>

              <View marginB-30>
                {variationsAvailable.length > 0 && (
                  <View marginT-30>
                    <Text text80 marginB-3 style={{ fontWeight: "bold" }}>
                      Variation
                    </Text>
                    <View
                      row
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 8,
                        width: "100%",
                      }}
                    >
                      {variationsAvailable.map((variation: any) => (
                        <Button
                          flex
                          style={{
                            marginRight: 10,
                            marginTop: 5,
                            backgroundColor:
                              variationSelected?.id === variation.id
                                ? "#e0e0e0"
                                : "#ffffff",
                            borderColor: "rgb(0, 0, 0)",
                            paddingVertical: 2,
                            paddingHorizontal: 7,
                            borderRadius: 8,
                          }}
                          variant="iconButtonWithLabelCenterOutline"
                          active={variationSelected?.id == variation.id}
                          size="small"
                          useMinSize
                          onPress={() => {
                            onChangeVariation(variation);
                          }}
                          key={variation.id}
                        >
                          <Text>
                            {variation.name}{" "}
                            {variation.price != 0 &&
                              `(${formatCurrency(variation.price)})`}
                          </Text>
                        </Button>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <View paddingH-5>
                <IngredientAccordion
                  isActive={true}
                  product={product}
                  ingredients={ingredients}
                  ingredientsGroups={ingredientsGroups}
                  groupsForSelection={ingredientsSelected}
                  setGroupsForSelection={setIngredientsSelected}
                />
              </View>
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
              <View marginT-35>
                <Counter
                  min={1}
                  quantity={quantitySelected}
                  onDecrease={onDecreaseProductQuantity}
                  onIncrement={onIncrementProductQuantity}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  text65BL
                  black
                  marginT-12
                  style={{
                    padding: 10,
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text>$</Text>
                  {formatCurrency(product.price, true)}
                </Text>
                {isInStock ? (
                  <Button
                    onPress={onPressAddToCart}
                    marginT-20
                    size="medium"
                    label={
                      quantitySelected != 1
                        ? `Add ${quantitySelected} Item to Cart`
                        : "Add to Cart"
                    }
                    fullWidth
                  />
                ) : (
                  <Text center text60L style={{ color: "#FFA000" }}>
                    Not Available
                  </Text>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </View>

      <View
        paddingB-20
        paddingH-10
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <Text
          text65BL
          black
          marginT-12
          style={{
            padding: 10,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Text>$</Text>
          {formatCurrency(product.price, true)}
        </Text>
        <Button onPress={handleOpen} marginT-20 size="medium" fullWidth>
          {" "}
          <svg
            stroke="currentColor"
            fill="white"
            stroke-width="0"
            viewBox="0 0 24 24"
            color="silver"
            height="19"
            width="19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
          </svg>
        </Button>
      </View>
    </View>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 3,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.grey50,
    borderWidth: 1.25,
    ...shadowProps,
  },
  imageContainer: {
    backgroundColor: Colors.graySoft,
    textAlign: "center",
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});
