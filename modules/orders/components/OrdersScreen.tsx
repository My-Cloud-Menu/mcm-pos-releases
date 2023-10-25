import { FlatList, ScrollView, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Order } from "mcm-types/src/order";
import OrderCardItem from "./OrderCardItem";
import metrics from "../../common/theme/metrics";
import { Text, View } from "react-native-ui-lib";
import { goToOrderDetailsScreen } from "../../common/NavigationHelper";

const getColumnsNumbers = () => {
  if (metrics.screenWidth > 900) return 5;
  else if (metrics.screenWidth > 500) return 5;
  else return 4;
};

type props = {
  orders: Order[];
};

const OrdersScreen = ({ orders }: props) => {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  const onPressOrder = (order: Order) => {
    goToOrderDetailsScreen(order.id, order);
  };

  useEffect(() => {
    if (orders.length > 0 && !orderId) {
      onPressOrder(orders[0]);
    }
  });

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: `Orders (${orders.length})` }} />
      <View
        style={{
          marginTop: 20,
          marginHorizontal: 12,
          flexDirection: "row",
          flexWrap: "wrap",
          rowGap: 40,
          columnGap: 20,
        }}
      >
        {orders
          .sort((a, b) => Number(b.id) - Number(a.id))
          .map((order) => {
            let isActive = orderId == order.id;
            return (
              <View
                style={{
                  minWidth: 270,
                }}
              >
                <OrderCardItem
                  key={`order-${order.id}`}
                  order={order}
                  isActive={isActive}
                  onPress={onPressOrder}
                />
              </View>
            );
          })}
      </View>

      {/* <FlatList
        style={{ marginTop: 20, marginLeft: 19 }}
        key={`orderslist-${getColumnsNumbers()}`}
        numColumns={getColumnsNumbers()}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              marginVertical: 25,
              backgroundColor: "#E0E0E0",
            }}
          />
        )}
        scrollEnabled
        keyExtractor={(item) => item.id}
        data={orders.sort((a, b) => Number(b.id) - Number(a.id))}
        renderItem={({ item }) => {
          return (
            <View
              marginR-50
              flex
              style={{
                maxWidth: 230,
                borderRightWidth: 1,
                borderColor: "#E0E0E0",
              }}
            >
              <OrderCardItem order={item} />
            </View>
          );
        }}
      /> */}
      <View paddingB-150 />
    </ScrollView>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({});
