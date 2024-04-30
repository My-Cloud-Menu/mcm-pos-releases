import { FlatList, Pressable, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Colors,
  Image,
  Text,
  TextField,
  View,
  Modal,
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
import { AntDesign } from "@expo/vector-icons";

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

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

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
      <View paddingT-5 paddingH-5>
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
              {/* {product.description && (
                <Text text65 black style={{ padding: 10 }}>
                  {product.description?.slice(0, 100)}
                  ...
                </Text>
              )} */}
            </View>
          </View>
        </Pressable>
        <View>
          <Modal
            visible={open}
            onRequestClose={handleClose}
            transparent
            animationType="fade"
          >
            <View
              style={{
                position: "absolute",
                height: 650,
                top: "15%",
                left: "15%",
                width: "75%",
                backgroundColor: "white",
                borderRadius: 20,
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                padding: 16,
                overflowX: "auto",
                flexDirection: "row",
                transitionDelay: "10s",
                transitionDuration: "10s",
                transitionProperty: "opacity",
                transitionTimingFunction: "ease-in-out",
                opacity: open ? 1 : 0,
              }}
            >
              <View
                style={{
                  width: "40%",
                }}
              >
                <Image
                  source={{ uri: getProductImage(product) }}
                  style={{
                    width: "95%",
                    height: "100%",
                    borderRadius: 20,
                  }}
                />
              </View>
              <View
                style={{
                  width: "60%",
                }}
              >
                <ScrollView
                  style={{ marginBottom: 40 }}
                  showsVerticalScrollIndicator={false}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ width: "75%" }}>
                      <Text text65 marginB-3 style={{ fontWeight: "bold" }}>
                        {product.name}
                      </Text>
                      <Text style={{ lineHeight: 20 }}>
                        {showFullDescription ||
                        !product.description ||
                        product.description.length <= 100
                          ? `${product.description}`
                          : `${product.description?.slice(0, 100)}... `}
                        {product.description &&
                          product.description.length > 100 && (
                            <Text
                              style={{
                                paddingVertical: 1.5,
                                paddingHorizontal: 6,
                                borderRadius: 6,
                                color: "#002C51",
                                fontWeight: "bold",
                              }}
                              onPress={toggleDescription}
                            >
                              {showFullDescription ? "Show Less" : "Show More"}
                            </Text>
                          )}
                      </Text>
                      <Text
                        text65BL
                        black
                        marginR-10
                        marginT-10
                        style={{
                          right: 0,
                          borderRadius: 8,
                          width: "fit-content",
                          padding: 10,
                        }}
                      >
                        <Text>$</Text>
                        {formatCurrency(product.price, true)}
                      </Text>
                    </View>
                    <View
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        zIndex: 1,
                      }}
                    >
                      <Button
                        onPress={handleClose}
                        color="black"
                        style={{
                          backgroundColor: "white",
                        }}
                      >
                        <AntDesign name="close" size={24} color="black" />
                      </Button>
                    </View>
                  </View>

                  <View marginB-30>
                    {variationsAvailable.length > 0 && (
                      <View marginT-30>
                        <Text text80 marginB-3 style={{ fontWeight: "bold" }}>
                          Variation
                        </Text>

                        <FlatList
                          data={variationsAvailable}
                          renderItem={({ item: variation }) => (
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
                                paddingVertical: 8,
                                paddingHorizontal: 7,
                                borderRadius: 8,
                              }}
                              // variant="iconButtonWithLabelCenterOutline"
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
                                {variation.price !== 0 &&
                                  `(${formatCurrency(variation.price)})`}
                              </Text>
                            </Button>
                          )}
                          keyExtractor={(item) => item.id.toString()}
                          numColumns={3}
                        />
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

                  <View marginT-20 paddingH-10 marginB-20>
                    <View style={{ marginTop: 30 }}>
                      <AllergiesChipSelector
                        allergiesSelected={allergiesSelected}
                        onChangeAllergiesSelected={setAllergiesSelected}
                      />
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
                    </View>
                  </View>
                </ScrollView>

                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingHorizontal: 10,
                    marginTop: 20,
                    flexDirection: "row",
                    justifyContent: "space-between",

                    alignItems: "center",
                  }}
                >
                  <Counter
                    min={1}
                    quantity={quantitySelected}
                    onDecrease={onDecreaseProductQuantity}
                    onIncrement={onIncrementProductQuantity}
                  />
                  {isInStock ? (
                    <Button
                      onPress={onPressAddToCart}
                      size="medium"
                      style={{ marginTop: 10, marginLeft: 10 }}
                      label={
                        quantitySelected !== 1
                          ? `Add ${quantitySelected} Item to Cart`
                          : "Add to Cart"
                      }
                      backgroundColor={Colors.green30}
                    />
                  ) : (
                    <Text
                      center
                      text60L
                      style={{ color: "#FFA000", marginLeft: 10 }}
                    >
                      Not Available
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>

      <View
        paddingH-10
        paddingB-5
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
          <AntDesign name="plus" size={24} color="white" />
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
    height: 160,
    borderRadius: 8,
  },
});
