import { ScrollView, StyleSheet } from "react-native";
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
import OrderCardItem from "../../modules/orders/components/OrderCardItem";

const Menu = () => {
  const { categoryName = "" } = useLocalSearchParams();

  return (
    <View style={{ width: "100%", backgroundColor: Colors.graySoft }} flex row>
      <View flex paddingT-25 paddingB-3 paddingL-20 paddingR-15>
        <View flex>
          <CategoriesCarousel />
          <Text marginT-23 marginB-15 text50L>
            {`${categoryName} Menu`.trim()}
          </Text>
          <ProductsList />
        </View>
        <View
          style={{
            height: 0.5,
            backgroundColor: "#E0E0E0",
            marginTop: 15,
            marginBottom: 15,
          }}
        />
        <FlashList
          style={{ maxHeight: 100 }}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: 0.5,
                marginHorizontal: 23,
                backgroundColor: "#E0E0E0",
              }}
            />
          )}
          data={[
            { name: "Leslie K." },
            { name: "Jacob J." },
            { name: "Cameron W." },
            { name: "Leslie K." },
          ]}
          renderItem={({ item }) => {
            return <OrderCardItem order={item} />;
          }}
        />
      </View>
      <View
        flex
        paddingT-30
        paddingR-10
        paddingL-15
        style={{
          maxWidth: 320,
          backgroundColor: Colors.white,
          borderTopStartRadius: 12,
          borderBottomStartRadius: 12,
        }}
      >
        <View flex>
          <UserProfileCard />
          <ScrollView>
            <Text text60 marginT-10>
              Bills
            </Text>

            <View style={{ maxHeight: "75%" }}>
              <FlashList
                contentContainerStyle={{ paddingTop: 20, paddingBottom: 50 }}
                ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
                data={[{ name: "Size" }, { name: "Sugar" }, { name: "Ice" }]}
                renderItem={({ item }) => {
                  return <CartItem />;
                }}
              />
            </View>
            <CartCharges />
          </ScrollView>
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
