import { ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { Button, Text, View } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteOrder as deleteOrderInBackend,
  ordersQueryKey,
} from "../../modules/orders/OrdersApi";
import {
  handlePetitionError,
  showAlert,
} from "../../modules/common/AlertHelper";
import { queryClient } from "../_layout";
import MasterPasswordRequired from "../../modules/common/components/MasterPasswordRequired";

const deleteorder = () => {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();

  const deleteOrderQuery = useMutation({
    mutationFn: () => deleteOrderInBackend(orderId),
    onSuccess: () => {
      showAlert({
        type: "success",
        title: `Order #${orderId} deleted successfully`,
      });
      queryClient.invalidateQueries({ queryKey: [ordersQueryKey] });
      router.push("/(menu)/orders");
    },
    onError: (error) => handlePetitionError(error),
  });

  return (
    <View flex>
      <View row centerV marginL-10>
        <Ionicons
          name="arrow-back"
          size={50}
          color="#000"
          onPress={() => router.back()}
        />
        <Text>Volver</Text>
      </View>

      <MasterPasswordRequired>
        <View center>
          <Text text40L>
            Are you sure you want to delete the order:
            <Text style={{ fontWeight: "bold" }}> #{orderId} </Text>?
          </Text>
          <Button
            onPress={() => deleteOrderQuery.mutate()}
            marginT-30
            size="large"
            style={{ backgroundColor: "#D84315" }}
            label={
              deleteOrderQuery.isLoading ? (
                <ActivityIndicator color={"white"} />
              ) : (
                "Yes, delete order"
              )
            }
          />
        </View>
      </MasterPasswordRequired>
    </View>
  );
};

export default deleteorder;

const styles = StyleSheet.create({});
