import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-ui-lib";
import dayjs from "dayjs";

interface props {
  ecrJournal: any;
}

const EcrJournalList = (props: props) => {
  return (
    <View>
      <View style={[styles.row, styles.header]}>
        <Text style={styles.cellHeader}>Date</Text>
        <Text style={styles.cellHeader}>Time</Text>
        <Text style={styles.cellHeader}>Type</Text>
        <Text style={styles.cellHeader}>Invoice</Text>
        <Text style={styles.cellHeader}>Reference</Text>
        <Text style={styles.cellHeader}>Total</Text>
        <Text style={styles.cellHeader}>Action</Text>
      </View>
      {[].map((item, index) => {
        return (
          <View key={index} style={styles.rowOdd}>
            <View style={styles.cell}>
              <Text style={{ marginLeft: 5 }}>{dayjs(item)}</Text>
            </View>
            <Text style={styles.cell}>ss</Text>
            <Text
              style={{
                ...styles.cell,
                fontWeight: "bold",
              }}
            >
              sas{" "}
            </Text>
            <Text style={styles.cell}>asf</Text>
            <View style={styles.cell}></View>
          </View>
        );
      })}
    </View>
  );
};

export default EcrJournalList;

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
