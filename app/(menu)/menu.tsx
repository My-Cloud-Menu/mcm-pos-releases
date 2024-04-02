import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Colors,
  Text,
  TextField,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import CategoriesCarousel from "../../modules/menu/components/CategoriesCarousel";
import ProductsList from "../../modules/menu/components/ProductsList";
import UserProfileCard from "../../modules/auth/components/UserProfileCard";
import { FlashList } from "@shopify/flash-list";
import CartItem from "../../modules/menu/components/CartItem";
import CartCharges from "../../modules/menu/components/CartCharges";
import OrderCardItem from "../../modules/orders/components/OrderCardItem";
import { useCartStore } from "../../stores/cartStore";
import { useGlobal } from "../../stores/global";
import useOrderStore from "../../modules/orders/OrdersStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { onRequestError } from "../../modules/common/PetitionsHelper";
import {
  goToOrderDetailsScreen,
  goToPaymentScreen,
} from "../../modules/common/NavigationHelper";
import {
  createOrderInBackend,
  getOrderSummary,
  getOrders,
  orderSummaryQueryKey,
  ordersQueryKey,
} from "../../modules/orders/OrdersApi";
import ExperienceSelector from "../../modules/menu/components/ExperienceSelector";
import useSplitStore from "../../modules/payment/SplitStore";
import { useIsFocused } from "@react-navigation/native";
import {
  checkClosedStatuses,
  checkOpenStatuses,
} from "../../modules/orders/OrderHelper";
import CouponCodeInput from "../../modules/menu/components/CouponCodeInput";
import { Entypo, FontAwesome5 } from "@expo/vector-icons";

const Menu = () => {
  const isFocused = useIsFocused();
  const { cartProducts, clearCart } = useCartStore();
  const { selectedCategory } = useGlobal();
  const orderStore = useOrderStore();
  const { resetSplitPayment } = useSplitStore();
  const [isMenuVisible, setMenuVisible] = useState(true);
  const [isCustomerNameCollapsed, setCustomerNameCollapsed] = useState(false);

  const toggleCustomerName = () => {
    setCustomerNameCollapsed(!isCustomerNameCollapsed);
  };

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };
  const setToggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const ordersQuery = useQuery({
    queryKey: [ordersQueryKey],
    queryFn: getOrders,
    initialData: {
      orders: [],
      count: 0,
    },
    refetchInterval: 40000,
  });

  const orderSummaryQuery = useQuery({
    queryKey: [orderSummaryQueryKey],
    keepPreviousData: false,
    queryFn: () => getOrderSummary(),
    enabled: cartProducts.length > 0,
  });

  const createOrderQuery = useMutation({
    mutationFn: createOrderInBackend,
    onError: (error) =>
      onRequestError(error, "Something went wrong Creating Order"),
    onSuccess: ({ order }) => {
      goToPaymentScreen(order.id, order);
      clearCart();
      orderStore.resetInputValues();
    },
  });

  const isCreateOrderAvailable = () => {
    if (createOrderQuery.isLoading) return false;
    if (cartProducts.length == 0) return false;

    if (
      orderStore.inputValues.experience == "qe" &&
      !Boolean(orderStore.inputValues.table)
    ) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    resetSplitPayment();
  }, [isFocused]);

  return (
    <View style={{ width: "100%", backgroundColor: Colors.graySoft }} flex row>
      <View flex paddingT-5 paddingB-0 paddingL-5 paddingR-5>
        <View flex>
          <View
            row
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: 10,
              alignItems: "center",
            }}
          >
            <CategoriesCarousel />
            {!isMenuVisible && (
              <Entypo
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                  borderColor: "#EAEAEA",
                  borderWidth: 0.5,
                }}
                name="shopping-cart"
                size={32}
                color="#606060"
                onPress={setToggleMenu}
              />
            )}
          </View>
          <Text marginT-15 marginB-10 text70L>
            {selectedCategory?.name || "All"}
          </Text>
          <ProductsList />
        </View>
        <View
          style={{
            height: 0.5,
            backgroundColor: "#E0E0E0",
            marginTop: 10,
            marginBottom: 5,
          }}
        />

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
          refreshing={ordersQuery.isLoading}
          data={ordersQuery.data.orders
            .sort((a, b) => Number(a.id) - Number(b.id))
            .sort((a, b) => (checkClosedStatuses.includes(a.status) ? 1 : -1))}
          renderItem={({ item }) => {
            return (
              <OrderCardItem
                onPress={(order) => goToOrderDetailsScreen(order.id, order)}
                order={item}
              />
            );
          }}
        />
      </View>
      {isMenuVisible && (
        <View
          flex
          paddingT-10
          paddingR-10
          paddingL-10
          style={{
            maxWidth: 295,
            backgroundColor: Colors.white,
            borderTopStartRadius: 12,
            borderBottomStartRadius: 12,
          }}
        >
          <View flex>
            <View
              row
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <UserProfileCard />
              <FontAwesome5
                onPress={toggleMenu}
                name="window-minimize"
                size={24}
                color="black"
              />
            </View>
            <ScrollView style={{ paddingRight: 3 }}>
              {cartProducts.length ? (
                <>
                  <Text text60 marginT-10>
                    Cart{" "}
                    <Text text70>
                      (
                      {cartProducts.reduce((acc, cal) => acc + cal.quantity, 0)}
                      )
                    </Text>
                  </Text>

                  <View>
                    <FlashList
                      contentContainerStyle={{
                        paddingTop: 20,
                        paddingBottom: 50,
                      }}
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 25 }} />
                      )}
                      data={cartProducts}
                      renderItem={({ item, index }) => {
                        return <CartItem product={item} productIdx={index} />;
                      }}
                    />
                  </View>

                  <CartCharges
                    cartSummary={orderSummaryQuery.data}
                    isLoading={
                      orderSummaryQuery.isLoading ||
                      orderSummaryQuery.isRefetching
                    }
                  />
                </>
              ) : (
                <View marginT-30>
                  <Text center text85>
                    No products Added
                  </Text>
                  <Text $textNeutralLight center>
                    Add items to start order
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
          <View paddingB-10>
            <View style={{ marginTop: 15, marginBottom: 15 }}>
              <View>
                <TouchableOpacity onPress={toggleCustomerName}>
                  <Text
                    style={{ fontWeight: "600", marginBottom: 10 }}
                    color={Colors.primary}
                  >
                    Customer Name
                  </Text>
                </TouchableOpacity>
                {!isCustomerNameCollapsed && (
                  <TextField
                    placeholder="Enter the Customer Name"
                    color={Colors.primary}
                    labelColor={"#000"}
                    placeholderTextColor={Colors.gray}
                    value={orderStore.inputValues.first_name}
                    onChangeText={(value) => {
                      orderStore.changeInputValue("first_name", value);
                    }}
                  />
                )}
              </View>
            </View>
            <CouponCodeInput
              cartSummary={orderSummaryQuery.data}
              onPressApply={() => orderSummaryQuery.refetch()}
            />
            <ExperienceSelector />
            <Button
              disabled={!isCreateOrderAvailable()}
              onPress={() => createOrderQuery.mutate()}
              marginT-35
              labelStyle={{ color: "#fff" }}
              label={
                createOrderQuery.isLoading ? (
                  <ActivityIndicator color={"white"} />
                ) : (
                  "Send Order"
                )
              }
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({});
