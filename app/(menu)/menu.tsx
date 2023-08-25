import { StyleSheet } from "react-native";
import React from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import CategoriesCarousel from "../../modules/menu/components/CategoriesCarousel";
import { useLocalSearchParams } from "expo-router";
import ProductsList from "../../modules/menu/components/ProductsList";
import UserProfileCard from "../../modules/auth/components/UserProfileCard";
import { FlashList } from "@shopify/flash-list";
import CartItem from "../../modules/menu/components/CartItem";
import CartCharges from "../../modules/menu/components/CartCharges";
import PaymentMethodSelector from "../../modules/menu/components/PaymentMethodSelector";

const Menu = () => {
  const { categoryName = "" } =
    useLocalSearchParams();


  return (
    <View style={{ width: "100%" }} row backgroundColor={Colors.graySoft}>
      <View flex paddingV-25 paddingL-20>
        <CategoriesCarousel />
        <Text marginV-18 text60L>{`${categoryName} Menu`.trim()}</Text>
        <ProductsList />
      </View>
      <View flex paddingT-30 paddingR-10 style={{ maxWidth: 320 }}>
        <View flex>
          <UserProfileCard />
          <Text text60 marginT-10>Bills</Text>

          <View style={{ maxHeight: "70%" }}>
            <FlashList
              contentContainerStyle={{ paddingTop: 20, paddingBottom: 50, }}
              ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
              data={[{ name: "Size" }, { name: "Sugar" }, { name: "Ice" }, { name: "Mood" }]}
              renderItem={({ item }) => {
                return (
                  <CartItem />
                );
              }}
            /></View>
          <CartCharges />
        </View>

        <View paddingB-10>
          <PaymentMethodSelector />
          <Button marginT-35 label="Send Order" />
        </View>
      </View>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({});
