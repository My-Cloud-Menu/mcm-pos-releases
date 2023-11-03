import { ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Colors,
  Modal,
  Text,
  View,
} from "react-native-ui-lib";
import WebView from "react-native-webview";
import TextField from "react-native-ui-lib/textField";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPayments, makeEcrSettle, paymentsQueryKey } from "../PaymentApi";
import { handlePetitionError } from "../../common/AlertHelper";
import { getOrders, ordersQueryKey } from "../../orders/OrdersApi";
import { checkOpenStatuses } from "../../orders/OrderHelper";
import useEcrStore from "../../ecr/EcrStore";
import { queryClient } from "../../../app/_layout";
import MasterPasswordRequired from "../../common/components/MasterPasswordRequired";
import fonts from "../../common/theme/fonts";
import TransactionsList from "./TransactionList";
import HtmlContent from "../../common/components/HtmlContent";
import TerminalConnectionChecker from "../../auth/components/TerminalConnectionChecker";

const PaymentsScreen = () => {
  const paymentsQuery = useQuery({
    queryKey: [paymentsQueryKey],
    queryFn: () => getPayments(undefined, true),
    onError: (error) =>
      handlePetitionError(
        error,
        "Something went wrong loading Payments",
        "",
        "warning"
      ),
    initialData: {
      payments: [],
      count: 0,
    },
  });

  const ordersQuery = useQuery({
    queryKey: [ordersQueryKey],
    queryFn: getOrders,

    initialData: {
      orders: [],
      count: 0,
    },
  });

  const { setup, increaseCurrentBatchNumber } = useEcrStore((state) => state);

  const makeSettleQuery = useMutation({
    mutationFn: async (params: { receipt_output: string }) => {
      const ecrSettleResult = await makeEcrSettle(params.receipt_output);

      return ecrSettleResult;
    },
    onSuccess: () => {
      increaseCurrentBatchNumber();
      queryClient.invalidateQueries({ queryKey: [ordersQueryKey] });
      setShowSettle(true);
    },
    onError: (error) =>
      handlePetitionError(error, "Something went wrong in Settle"),
  });

  const [showSettle, setShowSettle] = useState(false);
  const [printSettle, setPrintSettle] = useState(false);
  const [filterText, setFilterText] = useState("");

  const getPaymentsFiltered = () => {
    let result = paymentsQuery.data.payments;
    console.log(setup.batch_number);
    if (setup.batch_number) {
      result = result.filter(
        (payment) =>
          payment?.additional_properties?.batch_number == setup.batch_number
      );
    }

    if (filterText) {
      result = result.filter((payment) => {
        return (
          payment.invoice.toString().includes(filterText) ||
          payment.reference.toString().includes(filterText)
        );
      });
    }

    return result;
  };

  const isSettleAvailable =
    paymentsQuery.data.payments.filter(
      (payment) =>
        payment?.additional_properties?.batch_number == setup.batch_number
    ).length > 0;

  const onPressSettle = () => {
    let tablesStillOpen = 0;

    ordersQuery.data.orders.forEach((order) => {
      if (checkOpenStatuses.includes(order.status)) {
        tablesStillOpen++;
      }
    });

    if (tablesStillOpen > 0 && !Boolean(makeSettleQuery.data)) {
      console.log(
        "web version",
        `Se encontraron ${tablesStillOpen} mesa(s) con cuentas abiertas. Estas seguro que deseas hacer el Settle?`
      );
      Alert.alert(
        "WARNING - Mesas Abiertas",
        `Se encontraron ${tablesStillOpen} mesa(s) con cuentas abiertas. Estas seguro que deseas hacer el Settle?`,
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Si, Hacer Settle!",
            onPress: () => {
              makeSettle();
            },
          },
        ]
      );

      return;
    }

    makeSettle();
  };

  const makeSettle = async () => {
    if (makeSettleQuery.isSuccess) {
      setShowSettle(true);
      return;
    }

    const printPreference = printSettle ? "BOTH" : "HTML";
    makeSettleQuery.mutate({ receipt_output: printPreference });
  };

  return (
    <MasterPasswordRequired>
      <TerminalConnectionChecker />
      <ScrollView style={{ backgroundColor: "white" }}>
        <Text>Payments</Text>
        <View marginH-10>
          <Button
            onPress={onPressSettle}
            marginB-10
            disabled={!isSettleAvailable && !makeSettleQuery.isSuccess}
          >
            {isSettleAvailable ? (
              makeSettleQuery.isLoading ? (
                <ActivityIndicator color={"white"} />
              ) : (
                <Text style={{ color: "white", fontSize: fonts.size.sm }}>
                  {"Settle"}
                </Text>
              )
            ) : (
              <Text
                style={{ color: makeSettleQuery.isSuccess ? "#fff" : "#000" }}
              >
                {makeSettleQuery.isSuccess ? "Show Settle" : "NO TRANSACTIONS"}
              </Text>
            )}
          </Button>
          {makeSettleQuery.isSuccess ? (
            <Text color={Colors.green}>Settle realizado exitosamente!!</Text>
          ) : (
            isSettleAvailable && (
              <Checkbox
                labelStyle={{ fontSize: fonts.size.sm }}
                color={Colors.primary}
                value={printSettle}
                label="Imprimir Resultado del Settle"
                onValueChange={(value) => {
                  setPrintSettle(value);
                }}
              />
            )
          )}
        </View>
        <TextField
          onChangeText={(value) => setFilterText(value)}
          containerStyle={{ paddingHorizontal: 15, marginTop: 13 }}
          placeholder={"Buscar por Reference o ID"}
          floatingPlaceholder
          maxLength={30}
        />
        {paymentsQuery.isLoading || paymentsQuery.isFetching ? (
          <View center marginT-30>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text>Loading Payments</Text>
          </View>
        ) : (
          <TransactionsList payments={getPaymentsFiltered()} />
        )}
        <Modal visible={showSettle}>
          <Modal.TopBar
            title={"SETTLE"}
            onCancel={() => {
              setShowSettle(false);
            }}
          />
          {showSettle && (
            <ScrollView style={{ maxWidth: 1200, marginHorizontal: "auto" }}>
              <HtmlContent
                htmlContent={makeSettleQuery.data?.receipt_output?.settle}
              />
            </ScrollView>
          )}
        </Modal>
      </ScrollView>
    </MasterPasswordRequired>
  );
};

export default PaymentsScreen;

const styles = StyleSheet.create({
  title: { textAlign: "center", marginVertical: 13, fontSize: fonts.size.md },
  containerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
});
