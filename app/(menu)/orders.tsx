import { StyleSheet } from "react-native";
import React from "react";
import OrdersScreen from "../../modules/orders/components/OrdersScreen";
import { OrdersResponse } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { makeMcmRequest } from "../../modules/common/PetitionsHelper";
import { Colors, View } from "react-native-ui-lib";
import OrderDetailsScreen from "../../modules/orders/components/OrderDetailsScreen";
import { useLocalSearchParams } from "expo-router";

const orders = () => {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

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
    <View
      style={{
        flexDirection: "row",
        height: "100%",
        backgroundColor: Colors.graySoft,
      }}
    >
      <View style={{ flex: 1 }}>
        <OrdersScreen orders={ordersResponse.orders} />
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
