import { ScrollView, StyleSheet } from "react-native";
import React, { useRef, useState } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import fonts from "../../modules/common/theme/fonts";
import { Entypo, FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesWithProducts } from "../../modules/menu/MenuApi";
import CategoriesScrolleable from "../../modules/menu/components/CategoriesScrolleable";

const MenuScreen = () => {
  const thereIsItemInCart = true;
  const goToCheck = () => {};
  const goToSearch = () => {};
  const scrollViewRef = useRef(null);
  const subtotal = 10.21;

  const [categorySelected, setCategorySelected] = useState(null);

  const { data: categoriesWithProducts = [], isLoading: isDataLoading } =
    useQuery({
      queryKey: [`categoriesWithProducts`],
      queryFn: () => getCategoriesWithProducts(),
      onError: (error) => {
        console.log(error);
        //        handleMcmError(error, false, "Error Getting Products", null, "info"),
      },
      onSuccess: (categories) => {
        console.log(categories);
        if (categories.length > 0) setCategorySelected(categories[0].id);
      },
    });

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={{ marginBottom: 10 }}>
          <CategoriesScrolleable
            categorySelected={categorySelected}
            onCategorySelect={(categorySelected) => {
              setCategorySelected(categorySelected);
              let index = 0;
              let total = 0;
              categoriesWithProducts.some((cat) => {
                if (cat.id == categorySelected) {
                  return true;
                }
                index += cat.products.length;
                total++;
                return false;
              });

              scrollViewRef.current?.scrollTo({
                x: 0,
                y: (index / 4) * 202 + 150 * total,
                animated: true,
              });
            }}
            categories={categoriesWithProducts || []}
          />
        </View>
        <ScrollView showsHorizontalScrollIndicator ref={scrollViewRef}>
          {/* {isDataLoading ? (
              <Text style={{ textAlign: "center" }}>
                Loading Products <ActivityIndicator color={Colors.primary} />
              </Text>
            ) : (
              categoriesWithProducts.map((category) => (
                <ProductsGroupPOS
                  products={category.products}
                  maxLength={12}
                  title={category.name}
                  ingredientsSets={
                    ingredientsGroupsData?.ingredients_groups || []
                  }
                  customTitleStyle={{ fontSize: fonts.size.md }}
                />
              ))
            )} */}

          <View style={{ height: 200 }} />
        </ScrollView>
      </View>
      <View style={styles.sidebar}>
        <View style={{ height: "68%" }}>
          <Text
            style={{
              fontSize: fonts.size.sm,
              textAlign: "center",
              marginBottom: 5,
              borderBottomColor: Colors.gray,
              borderBottomWidth: 1,
            }}
          >
            Your Order
          </Text>
          {/* <TableSelector /> */}
          <ScrollView>{/* <CartCollapsiblePOS /> */}</ScrollView>
        </View>
        {/* <CartCollapsible /> */}
        <View style={{ height: "32%" }}>
          <View
            style={{
              paddingTop: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 10,
            }}
          >
            <Text style={{ fontSize: 20 }}>Subtotal</Text>
            <Text style={{ fontSize: 20 }}>${subtotal}</Text>
          </View>
          <Button
            variant="primary"
            //   onPress={removeAllCarts}
            label="Clear Cart"
            style={{ marginVertical: 10 }}
          />
          <Button
            disabled={!thereIsItemInCart}
            //   onPress={onSendOrder}
            label="SEND"
            fullWidth
            backgroundColor={Colors.primary}
            style={{ height: 70 }}
          />
        </View>
      </View>
      {/* <ProductScreenOverlay /> */}
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    flexDirection: "row",
    // minHeight: "100%",
  },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginBottom: 2,
  },
  title: { textAlign: "center", marginVertical: 13, fontSize: fonts.size.md },
  sidebar: {
    // maxHeight: "90%",
    justifyContent: "space-between",
    width: "25%",
    borderLeftColor: Colors.gray,
    borderLeftWidth: 1,
    paddingLeft: 10,
  },
});
