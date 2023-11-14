import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import { Button, Chip, Colors, Text, View } from "react-native-ui-lib";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { convertEcrJournalIntoTransactionList } from "../PaymentHelper";
import { useQuery } from "@tanstack/react-query";
import { getPayments, paymentsQueryKey } from "../PaymentApi";
import {
  goToOrderDetailsScreen,
  goToPaymentDetailsScreen,
} from "../../common/NavigationHelper";
dayjs.extend(customParseFormat);

type props = {
  ecrJournal: any;
};

const JournalScreen = (props: props) => {
  const paymentsQuery = useQuery({
    queryKey: [paymentsQueryKey],
    queryFn: () => getPayments(undefined, true),
    initialData: {
      payments: [],
      count: 0,
    },
  });

  const journalTransactions = convertEcrJournalIntoTransactionList(
    props.ecrJournal
  );

  return (
    <ScrollView style={styles.container}>
      <View row spread centerV marginB-25 paddingR-20>
        <Text text50>Journal ({journalTransactions.length})</Text>
      </View>
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
        .sort((a, b) => Number(b.transaction_time) - Number(a.transaction_time))
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
                {dayjs(item.transaction_date, "mmddyy").format("DD-mm-YYYY")}
              </Text>

              <Text
                style={{
                  ...styles.cell,
                  maxWidth: 100,
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
