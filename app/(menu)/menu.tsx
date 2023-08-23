import { StyleSheet } from "react-native";
import React from "react";
import { Colors, Text, View } from "react-native-ui-lib";
import CategoriesCarousel from "../../modules/menu/components/CategoriesCarousel";

const menu = () => {
  return (
    <View flex backgroundColor={Colors.graySoft}>
      <Text>menu</Text>
      <CategoriesCarousel />
      <Text>sss</Text>
    </View>
  );
};

export default menu;

const styles = StyleSheet.create({});
