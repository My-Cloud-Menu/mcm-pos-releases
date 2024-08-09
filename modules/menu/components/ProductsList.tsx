import { StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
import ProductItem from "./ProductItem";
import metrics from "../../common/theme/metrics";
import { useQuery } from "@tanstack/react-query";
import { useGlobal } from "../../../stores/global";
import { onRequestError } from "../../common/PetitionsHelper";
import { FlatList } from "react-native-gesture-handler";
import {
  getIngredients,
  getIngredientsGroups,
  getProducts,
  ingredientsGroupsQueryKey,
  productsQueryKey,
} from "../MenuApi";
import { Product } from "mcm-types";

const getColumsNumbers = (): number => {
  console.log(metrics.screenWidth);
  if (metrics.screenWidth < 1250) {
    return 3;
  } else if (metrics.screenWidth < 1500) {
    return 4;
  } else if (metrics.screenWidth < 1700) {
    return 5;
  } else {
    return 6;
  }
};

type props = {
  showProductImage?: boolean;
};

const ProductsList = (props: props) => {
  const { data: productResponse } = useQuery({
    queryKey: [productsQueryKey],
    queryFn: () => getProducts(),
    initialData: {
      products: [],
    },
  });

  const ingredientsGroupsQuery = useQuery({
    queryKey: [ingredientsGroupsQueryKey],
    queryFn: () => getIngredientsGroups(),
    // refetchOnMount: false,
    initialData: {
      ingredients_groups: [],
    },
    onError: (error) => onRequestError(error, "Ingredients Groups"),
  });

  // Get Ingredients Query
  const ingredientsQuery = useQuery({
    queryKey: [`ingredients`],
    queryFn: () => getIngredients(),
    // refetchOnMount: false,
    initialData: {
      ingredients: [],
    },
    onError: (error) => onRequestError(error, "Ingredients"),
  });

  const [productIdsSelected, setProductIdsSelected] = useState<number[]>([]);
  const { selectedCategory } = useGlobal();

  const onPressProduct = (product: Product) => {
    let newProductIds = productIdsSelected.includes(product.id)
      ? productIdsSelected.filter(
          (productId: number) => productId != product.id
        )
      : [...productIdsSelected, product.id];

    setProductIdsSelected(newProductIds);
  };

  const products = useMemo(() => {
    if (selectedCategory) {
      return productResponse.products.filter((p) =>
        p.categories_id.some((c) => c === selectedCategory?.id)
      );
    }
    return productResponse.products;
  }, [productResponse, selectedCategory]);

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      style={{ height: 122 }}
      numColumns={getColumsNumbers()}
      data={products.map((item) => ({ ...item, image: item.images[0] }))}
      ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
      scrollEnabled
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        let isActive = productIdsSelected.includes(item.id);
        return (
          <View style={{ flex: 1, maxWidth: 400 }}>
            <ProductItem
              showImage={props?.showProductImage}
              ingredients={ingredientsQuery.data.ingredients}
              ingredientsGroups={ingredientsGroupsQuery.data.ingredients_groups}
              product={item}
              isActive={isActive}
              onPress={() => onPressProduct(item)}
            />
          </View>
        );
      }}
    />
  );
};

export default ProductsList;

const styles = StyleSheet.create({});
