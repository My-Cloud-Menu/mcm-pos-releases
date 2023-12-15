import { ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Chip,
  Colors,
  LoaderScreen,
  Modal,
  Text,
  View,
} from "react-native-ui-lib";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { convertEcrJournalIntoTransactionList } from "../PaymentHelper";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ecrJournalQueryKey,
  getEcrJournal,
  getPayments,
  makeEcrSettle,
  paymentsQueryKey,
} from "../PaymentApi";
import {
  goToOrderDetailsScreen,
  goToPaymentDetailsScreen,
} from "../../common/NavigationHelper";
import { handlePetitionError } from "../../common/AlertHelper";
import { getOrders, ordersQueryKey } from "../../orders/OrdersApi";
import { checkOpenStatuses } from "../../orders/OrderHelper";
import HtmlContent from "../../common/components/HtmlContent";
dayjs.extend(customParseFormat);

type props = {};

const JournalScreen = (props: props) => {
  const [showSettle, setShowSettle] = useState(false);
  const [printSettle, setPrintSettle] = useState(false);
  const [noTransactions, setNoTransactions] = useState(false);

  const ecrJournalQuery = useQuery({
    queryKey: [ecrJournalQueryKey],
    queryFn: getEcrJournal,
    onError: (error: any) => {
      if (error?.response_message == "NO TRANSACTIONS.") {
        setNoTransactions(true);
        return;
      }

      handlePetitionError(error, "Error loading Journal");
    },
    refetchOnMount: true,
  });

  const paymentsQuery = useQuery({
    queryKey: [paymentsQueryKey],
    queryFn: () => getPayments(undefined, true),
    onError: (error: any) => {
      handlePetitionError(error, "Error loading Payments");
    },
    initialData: {
      payments: [],
      count: 0,
    },
  });

  const makeSettleQuery = useMutation({
    mutationFn: async () => {
      const printPreference = printSettle ? "BOTH" : "HTML";
      const settleResult = await makeEcrSettle(printPreference);

      return settleResult;
    },
    onError: (error) => {
      handlePetitionError(
        error,
        "Error in Settle, please try again, if error persist contact to admin"
      );
    },
    onSuccess: () => {
      setShowSettle(true);
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
              makeSettleQuery.mutate();
            },
          },
        ]
      );

      return;
    }

    makeSettleQuery.mutate();
  };

  const getMakeSettleButtonLabel = () => {
    if (noTransactions) {
      return "NO TRANSACTIONS";
    }

    if (makeSettleQuery.isLoading) {
      return <ActivityIndicator color={"white"} />;
    }

    if (makeSettleQuery.isSuccess) {
      return "Settle realizado Exitosamente";
    }

    return "Settle";
  };

  if (ecrJournalQuery.isLoading || ecrJournalQuery.isRefetching) {
    return <LoaderScreen message="Loading Payments" />;
  }

  const journalTransactions = ecrJournalQuery?.isSuccess
    ? convertEcrJournalIntoTransactionList(ecrJournalQuery.data)
    : [];

  return (
    <ScrollView style={styles.container}>
      <View row spread centerV marginB-25 paddingR-20>
        <Text text50>Payments ({journalTransactions.length})</Text>
      </View>

      <View style={{ marginHorizontal: 10, marginBottom: 60 }}>
        <Button
          disabled={
            noTransactions ||
            makeSettleQuery.isSuccess ||
            ecrJournalQuery.isLoading ||
            ecrJournalQuery.isRefetching
          }
          onPress={onPressSettle}
          marginB-10
          label={getMakeSettleButtonLabel()}
        />

        {makeSettleQuery.isSuccess ? (
          <Button
            onPress={() => setShowSettle(true)}
            label="Mostrar Settle"
            size="xSmall"
            style={{ backgroundColor: Colors.primaryLight }}
          />
        ) : (
          <Checkbox
            labelStyle={{ fontSize: 20 }}
            color={Colors.primary}
            value={printSettle}
            label="Imprimir Resultado del Settle"
            onValueChange={(value) => {
              setPrintSettle(value);
            }}
          />
        )}
      </View>

      {noTransactions && (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text text80>No Transactions</Text>
        </View>
      )}

      {!noTransactions && (
        <>
          <View style={[styles.row, styles.header]}>
            <Text style={styles.cellHeader}>Time</Text>
            <Text style={styles.cellHeader}>Date</Text>
            <Text style={styles.cellHeader}>Type</Text>
            <Text style={styles.cellHeader}>Approval Code</Text>
            <Text style={styles.cellHeader}>Invoice</Text>
            <Text style={styles.cellHeader}>Reference</Text>
            <Text style={styles.cellHeader}>Total</Text>
            <Text style={styles.cellHeader}>Order #</Text>
            <Text style={styles.cellHeader}>Action</Text>
          </View>
          {journalTransactions
            .sort(
              (a, b) => Number(b.transaction_time) - Number(a.transaction_time)
            )
            .map((item, index) => {
              const paymentFounded = paymentsQuery.data.payments.find(
                (payment) => payment.reference == item.reference
              );

              return (
                <View key={index} style={[styles.row, styles.rowOdd]}>
                  <Text style={{ ...styles.cell, fontWeight: "bold" }}>
                    {dayjs(item.transaction_time, "HHmmss").format("HH:mm")}
                  </Text>

                  <Text style={styles.cell}>
                    {dayjs(item.transaction_date, "MMDDYYYY").format(
                      "DD-MM-YYYY"
                    )}
                  </Text>

                  <Text
                    style={{
                      ...styles.cell,
                      maxWidth: 100,
                      paddingRight: 30,
                    }}
                  >
                    {item.transaction_type}
                  </Text>

                  <Text style={styles.cell}>{item.approval_code}</Text>
                  <Text style={styles.cell}>{item.invoice}</Text>
                  <Text style={styles.cell}>{item.reference}</Text>
                  <Text style={styles.cell}>{item?.amounts?.total}</Text>
                  <View style={styles.cell}>
                    {(paymentFounded?.orders_ids || []).map((orderId) => (
                      <Chip
                        onPress={() => goToOrderDetailsScreen(orderId)}
                        backgroundColor={Colors.primary}
                        labelStyle={{ color: "#fff", fontWeight: "bold" }}
                        label={`${orderId}`}
                      />
                    ))}
                  </View>
                  <View style={styles.cell}>
                    {Boolean(paymentFounded) && (
                      <Button
                        size="small"
                        label="Details"
                        onPress={() =>
                          paymentFounded?.id &&
                          goToPaymentDetailsScreen(
                            paymentFounded.id,
                            paymentFounded
                          )
                        }
                      />
                    )}
                  </View>
                </View>
              );
            })}
        </>
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
              htmlContent={makeSettleQuery.data?.receipt_output?.settle || ""}
            />
          </ScrollView>
        )}
      </Modal>
    </ScrollView>
  );
};

export default JournalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    borderRadius: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 0.01,
    borderBottomColor: "#e0e0e0",
  },
  rowOdd: { backgroundColor: "#fff", borderRadius: 8 },
  rowEven: { backgroundColor: "#FFC107", borderRadius: 8 },
  header: { backgroundColor: "#e0e0e0", fontWeight: "bold", borderRadius: 8 },
  cellHeader: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
