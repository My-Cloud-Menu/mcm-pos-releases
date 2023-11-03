import { StyleSheet } from "react-native";
import React from "react";
import OrdersScreen from "../../modules/orders/components/OrdersScreen";
import { useQuery } from "@tanstack/react-query";
import { Colors, View } from "react-native-ui-lib";
import OrderDetailsScreen from "../../modules/orders/components/OrderDetailsScreen";
import { useLocalSearchParams } from "expo-router";
import { getOrders, ordersQueryKey } from "../../modules/orders/OrdersApi";

const orders = () => {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  const ordersQuery = useQuery({
    queryKey: [ordersQueryKey],
    queryFn: getOrders,
    initialData: {
      orders: [],
      count: 0,
    },
  });

  return (
    <View
      style={{
        flexDirection: "row",
        height: "100%",
        backgroundColor: Colors.graySoft,
      }}
    >
      <View style={{ flex: 1 }}>
        <OrdersScreen orders={ordersQuery.data.orders} />
      </View>
      {orderId && (
        <View
          paddingH-10
          style={{
            borderStartStartRadius: 8,
            borderEndStartRadius: 8,
            backgroundColor: Colors.white,
            width: 580,
          }}
        >
          <OrderDetailsScreen orderId={orderId} />
        </View>
      )}
    </View>
  );
};

export default orders;

const styles = StyleSheet.create({});
