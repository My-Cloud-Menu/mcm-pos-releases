import { StyleSheet } from "react-native";
import React from "react";
import { Colors, Text, View } from "react-native-ui-lib";
import CategoriesCarousel from "../../modules/menu/components/CategoriesCarousel";
import { useLocalSearchParams } from "expo-router";
import ProductsList from "../../modules/menu/components/ProductsList";

const menu = () => {
  const { categoryName = "" } =
    useLocalSearchParams();


  return (
    <View row backgroundColor={Colors.graySoft}>
      <View flex-1 paddingV-25 paddingH-20>
        <CategoriesCarousel />
        <Text marginV-18 text60L>{`${categoryName} Menu`.trim()}</Text>
        <ProductsList />
      </View>
      <View>
      </View>
    </View>
  );
};

export default menu;

const styles = StyleSheet.create({});
