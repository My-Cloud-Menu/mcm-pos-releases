import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import React from "react";
import { Button, Colors, Text, TextField, View } from "react-native-ui-lib";
import CategoriesCarousel from "../../modules/menu/components/CategoriesCarousel";
import { useLocalSearchParams } from "expo-router";
import ProductsList from "../../modules/menu/components/ProductsList";
import UserProfileCard from "../../modules/auth/components/UserProfileCard";
import { FlashList } from "@shopify/flash-list";
import CartItem from "../../modules/menu/components/CartItem";
import CartCharges from "../../modules/menu/components/CartCharges";
import PaymentMethodSelector from "../../modules/menu/components/PaymentMethodSelector";
import OrderCardItem from "../../modules/orders/components/OrderCardItem";
import { useCartStore } from "../../stores/cartStore";
import { useGlobal } from "../../stores/global";
import useOrderStore from "../../modules/orders/OrdersStore";
import { useQuery } from "@tanstack/react-query";
import { OrdersResponse } from "../../types";
import { makeMcmRequest } from "../../modules/common/PetitionsHelper";

const Menu = () => {
  const { cartProducts } = useCartStore();
  const { selectedCategory } = useGlobal();
  const orderStore = useOrderStore();

  const { data: ordersResponse, isLoading: isOrdersLoading } =
    useQuery<OrdersResponse>({
      queryKey: ["/orders"],
      queryFn: () => makeMcmRequest("admin/orders?withoutPaginate=true"),
      initialData: {
        orders: [],
        count: 0,
        lastEvaluatedKey: null,
      },
    });

  return (
    <View style={{ width: "100%", backgroundColor: Colors.graySoft }} flex row>
      <View flex paddingT-25 paddingB-0 paddingL-20 paddingR-15>
        <View flex>
          <CategoriesCarousel />
          <Text marginT-23 marginB-15 text50L>
            {selectedCategory?.name || "All"}
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
        {/* <FlashList
          style={{ maxHeight: 100 }}
          keyExtractor={(item) => item.id}
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
          refreshing={isOrdersLoading}
          data={ordersResponse.orders}
          renderItem={({ item }) => {
            return <OrderCardItem order={item} />;
          }}
        /> */}

        <FlatList
          style={{ maxHeight: 100 }}
          keyExtractor={(item) => item.id}
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
          refreshing={isOrdersLoading}
          data={ordersResponse.orders.sort(
            (a, b) => Number(b.id) - Number(a.id)
          )}
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
          <ScrollView style={{}}>
            {cartProducts.length ? (
              <>
                <Text text60 marginT-10>
                  Cart
                </Text>

                <View style={{}}>
                  <FlashList
                    contentContainerStyle={{
                      paddingTop: 20,
                      paddingBottom: 50,
                    }}
                    ItemSeparatorComponent={() => (
                      <View style={{ height: 25 }} />
                    )}
                    data={cartProducts}
                    renderItem={({ item }) => {
                      return <CartItem product={item} />;
                    }}
                  />
                </View>
                <CartCharges />
              </>
            ) : (
              <Text>No products Added</Text>
            )}
          </ScrollView>
        </View>

        <View paddingB-10>
          <TextField
            marginV-30
            label="Customer Name"
            placeholder="Enter the Customer Name"
            color={Colors.primary}
            labelColor={"#000"}
            placeholderTextColor={Colors.gray}
            value={orderStore.inputValues.first_name}
            onChange={({ target }) =>
              orderStore.changeInputValue("first_name", target.value)
            }
          />
          <PaymentMethodSelector />
          <Button
            disabled={!orderStore.isCreateOrderAvailable()}
            onPress={orderStore.createOrder}
            marginT-35
            labelStyle={{ color: "#fff" }}
            label={
              orderStore.isLoading ? (
                <ActivityIndicator color={"white"} />
              ) : (
                "Send Order"
              )
            }
          />
        </View>
      </View>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({});
