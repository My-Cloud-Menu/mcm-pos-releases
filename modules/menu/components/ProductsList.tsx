import { StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import ProductItem from "./ProductItem";
import metrics from "../../common/theme/metrics";
import { useQuery } from "@tanstack/react-query";
import { Product, ProductResponse } from "../../../types";
import axios from "../../common/axios";
import { useGlobal } from "../../../stores/global";
import { makeMcmRequest } from "../../common/PetitionsHelper";

const getColumsNumbers = () => {
  if (metrics.screenWidth > 900) return 4;
  else if (metrics.screenWidth > 500) return 3;
  else return 2;
};

const ProductsList = () => {
  const { data: productResponse } = useQuery<ProductResponse>({
    queryKey: ["/products"],
    queryFn: () => makeMcmRequest("front/products?withoutPaginate=true"),
    initialData: {
      products: [],
      count: 0,
      lastEvaluatedKey: null,
    },
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
    <FlashList
      showsHorizontalScrollIndicator={false}
      numColumns={getColumsNumbers()}
      data={products.map((item) => ({ ...item, image: item.images[0] }))}
      ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
      scrollEnabled
      renderItem={({ item }) => {
        let isActive = productIdsSelected.includes(item.id);
        return (
          <ProductItem
            product={item}
            isActive={isActive}
            onPress={() => onPressProduct(item)}
          />
        );
      }}
      estimatedItemSize={20}
    />
  );
};

export default ProductsList;

const styles = StyleSheet.create({});
