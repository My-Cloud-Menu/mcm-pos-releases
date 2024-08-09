import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Colors, Text, TextField, View } from "react-native-ui-lib";
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
import { checkClosedStatuses } from "../../modules/orders/OrderHelper";
import CouponCodeInput from "../../modules/menu/components/CouponCodeInput";
import { FontAwesome5 } from "@expo/vector-icons";
import useSetting from "../../modules/settings/hooks/useSetting";

const Menu = () => {
  const isFocused = useIsFocused();
  const { cartProducts, clearCart, isClose, toggleClose, toggleOpen } =
    useCartStore();
  const { selectedCategory } = useGlobal();
  const orderStore = useOrderStore();
  const { settings, getFeatureFlag } = useSetting();
  const { resetSplitPayment } = useSplitStore();
  const [isCustomerNameCollapsed, setCustomerNameCollapsed] = useState(true);
  const [isCouponCollapsed, setCouponCollapsed] = useState(true);

  const toggleCoupon = () => {
    setCouponCollapsed(!isCouponCollapsed);
    orderStore.changeInputValue("coupon_code", "");
  };

  const toggleCustomerName = () => {
    setCustomerNameCollapsed(!isCustomerNameCollapsed);
    orderStore.changeInputValue("first_name", "");
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

  const shouldShowCategoriesAndProductImages = useMemo(() => {
    return !getFeatureFlag("pos_prod_menu_no_image");
  }, [settings]);

  return (
    <View style={{ width: "100%", backgroundColor: Colors.graySoft }} flex row>
      <View flex paddingT-5 paddingB-0 paddingL-5 paddingR-5>
        <View flex>
          <View
            row
            style={
              {
                // display: "flex",
                // justifyContent: "center",
                // marginRight: 10,
                // alignItems: "center",
              }
            }
          >
            <CategoriesCarousel
              showCategoryImage={shouldShowCategoriesAndProductImages}
            />
            {/* {!isClose && (
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
                onPress={toggleOpen}
              />
            )} */}
          </View>
          <Text marginT-15 marginB-10 text70L>
            {selectedCategory?.name || "All"}
          </Text>
          <ProductsList
            showProductImage={shouldShowCategoriesAndProductImages}
          />
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
          style={{
            maxHeight: 80,
            display: ordersQuery.data.orders.length == 0 ? "none" : "flex",
          }}
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
      {isClose && (
        <View
          flex
          paddingT-10
          paddingR-10
          paddingL-10
          style={{
            maxWidth: 250,
            backgroundColor: Colors.white,
            borderTopStartRadius: 12,
            borderBottomStartRadius: 12,
          }}
        >
          <View flex>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 5,
              }}
            >
              <UserProfileCard />
              <FontAwesome5
                onPress={toggleClose}
                name="window-minimize"
                size={24}
                color="black"
              />
            </View>
            <ScrollView style={{ paddingRight: 3, paddingBottom: 20 }}>
              {cartProducts.length ? (
                <>
                  <Text text65L marginT-10>
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
                        paddingTop: 5,
                        paddingBottom: 20,
                      }}
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 7 }} />
                      )}
                      data={cartProducts}
                      renderItem={({ item, index }) => {
                        return (
                          <CartItem
                            product={item}
                            productIdx={index}
                            showImage={shouldShowCategoriesAndProductImages}
                          />
                        );
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
            <View row>
              <Button
                marginR-12
                size="xSmall"
                variant={"iconButtonWithLabelCenterOutline"}
                style={{
                  backgroundColor: isCustomerNameCollapsed ? null : "#f9f8fb",
                  height: 32,
                }}
                onPress={toggleCustomerName}
              >
                <Text black>Customer Name</Text>
              </Button>

              <Button
                size="xSmall"
                variant={"iconButtonWithLabelCenterOutline"}
                style={{
                  height: 32,

                  backgroundColor: isCouponCollapsed ? null : "#f9f8fb",
                }}
                onPress={toggleCoupon}
              >
                <Text black>Coupon</Text>
              </Button>
            </View>

            {!isCustomerNameCollapsed && (
              <TextField
                leadingAccessory={<Text text100>Name</Text>}
                placeholder="Enter the Customer Name"
                color={Colors.primary}
                labelColor={"#000"}
                style={{
                  marginVertical: 10,
                  marginLeft: 6,
                }}
                placeholderTextColor={Colors.gray}
                value={orderStore.inputValues.first_name}
                onChangeText={(value) => {
                  orderStore.changeInputValue("first_name", value);
                }}
              />
            )}

            {!isCouponCollapsed && (
              <CouponCodeInput
                cartSummary={orderSummaryQuery.data}
                onPressApply={() => orderSummaryQuery.refetch()}
              />
            )}
            <ExperienceSelector />
            <Button
              disabled={!isCreateOrderAvailable()}
              onPress={() => createOrderQuery.mutate()}
              marginT-10
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
