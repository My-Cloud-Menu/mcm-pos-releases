import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPaymentById,
  paymentQueryKey,
  transferPayment,
} from "../PaymentApi";
import { queryClient } from "../../../app/_layout";
import { handlePetitionError, showAlert } from "../../common/AlertHelper";
import { getOrders, ordersQueryKey } from "../../orders/OrdersApi";
import Decimal from "decimal.js";
import { checkOpenStatuses } from "../../orders/OrderHelper";
import { Order } from "mcm-types";
import MasterPasswordRequired from "../../common/components/MasterPasswordRequired";
import { Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import fonts from "../../common/theme/fonts";
import metrics from "../../common/theme/metrics";

type props = {
  paymentId: string;
};

const TransferPaymentForm = (props: props) => {
  const paymentQuery = useQuery({
    queryKey: [paymentQueryKey, props.paymentId],
    queryFn: () => getPaymentById(props.paymentId),
  });

  const ordersQuery = useQuery({
    queryKey: [ordersQueryKey],
    queryFn: getOrders,
    initialData: {
      orders: [],
      count: 0,
    },
  });

  const transferPaymentQuery = useMutation({
    onError: (error) => handlePetitionError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [paymentQueryKey, props.paymentId],
      });

      showAlert({
        title: "El pago se ha transferido exitosamente",
        type: "success",
      });
    },
    mutationFn: async (params: { paymentId: string; orderId: string }) => {
      return await transferPayment(params.paymentId, params.orderId);
    },
  });

  const getOrdersAvailableForSelect = () => {
    let checksForSelect: Order[] = [];

    ordersQuery.data.orders.forEach((check) => {
      let checkPendingToPay = new Decimal(check.total).minus(check.paid);

      let totalToTransfer = new Decimal(paymentQuery?.data?.total || 0).minus(
        paymentQuery?.data?.tip || 0
      );

      if (
        checkOpenStatuses.includes(check.status) &&
        checkPendingToPay.greaterThanOrEqualTo(totalToTransfer) &&
        !paymentQuery?.data?.orders_ids.includes(check.id)
      ) {
        checksForSelect.push(check);
      }
    });

    return checksForSelect;
  };

  const onPressCheck = (checkSelected: Order) => {
    if (transferPaymentQuery.isLoading) return;
    if (!paymentQuery?.data?.id) return;

    if (Platform.OS == "web") {
      console.log(
        "web",
        `¿Estas seguro que deseas transferir el Pago #${paymentQuery?.data?.id} a la orden #${checkSelected.id}?`,
        `Nota: Esta accion movera el Pago a la orden seleccionada y reabrira la orden original en caso de que este cerrada`
      );

      transferPaymentQuery.mutate({
        orderId: checkSelected.id,
        paymentId: paymentQuery.data.id,
      });
      return;
    }

    Alert.alert(
      `¿Estas seguro que deseas transferir el Pago #${paymentQuery?.data?.id} a la orden #${checkSelected.id}?`,
      `Nota: Esta accion movera el Pago a la orden seleccionada y reabrira la orden original en caso de que este cerrada`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Si, Transferir Pago!",
          onPress: () => {
            transferPaymentQuery.mutate({
              orderId: checkSelected.id,
              paymentId: paymentQuery.data.id,
            });
          },
        },
      ]
    );
  };

  if (!paymentQuery.data) return <LoaderScreen />;

  const ordersAvailableForSelect = getOrdersAvailableForSelect();

  return (
    <MasterPasswordRequired>
      <ScrollView>
        <Text>Transferir pago</Text>
        <Text style={{ textAlign: "center" }}>Total a Transferir</Text>
        <Text
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: fonts.size.xl,
          }}
        >
          {paymentQuery.data.total}
        </Text>

        <Text style={styles.selectTableTitle}>Seleccione la Mesa</Text>
        <View>
          {ordersAvailableForSelect.length == 0 ? (
            <Text style={{ marginHorizontal: 6 }}>
              No hay mesas disponible para transferir este pago
            </Text>
          ) : (
            ordersAvailableForSelect.map((checkForSelect, idx) => (
              <Pressable
                style={styles.table}
                key={`checkforselect-${idx}`}
                onPress={() => onPressCheck(checkForSelect)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.tableTitle}>{checkForSelect.id}</Text>

                  <View style={{}}>
                    <Text>Total: {checkForSelect.total}</Text>
                    <Text>
                      Pendiente por Pagar: $
                      {new Decimal(checkForSelect.total)
                        .minus(checkForSelect.paid)
                        .toFixed(2)}
                    </Text>
                    <Text style={{ maxWidth: metrics.screenWidth * 0.6 }}>
                      Abierto por: {checkForSelect.cart.employee.first_name}{" "}
                      {checkForSelect.cart.employee.last_name} (#
                      {checkForSelect.cart.employee.id})
                    </Text>
                  </View>
                </View>
                <View style={{ marginRight: 10 }}>
                  <Text style={{}}>Items</Text>
                  <Text
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: fonts.size.lg,
                    }}
                  >
                    {checkForSelect.cart.line_items.reduce(
                      (acc, cal) => acc + cal.quantity,
                      0
                    )}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
        {transferPaymentQuery.isLoading && (
          <ActivityIndicator color={Colors.primary} size={30} />
        )}
        <View style={{ marginBottom: 100 }} />
      </ScrollView>
    </MasterPasswordRequired>
  );
};

const styles = StyleSheet.create({
  selectTableTitle: {
    marginTop: 20,
    marginHorizontal: 5,
    fontSize: fonts.size.md,
    fontWeight: "bold",
  },
  table: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 5,
    paddingHorizontal: 8,
    margin: 5,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tableTitle: {
    fontSize: fonts.size.md,
    fontWeight: "bold",
    marginRight: 20,
  },
});

export default TransferPaymentForm;
