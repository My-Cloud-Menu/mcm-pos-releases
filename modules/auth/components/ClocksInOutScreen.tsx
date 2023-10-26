import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import { TimeSheet } from "../../../types";
import { Avatar, Button, Text, View } from "react-native-ui-lib";
import dayjs from "dayjs";
import { initialGlobalSetupConfiguration } from "../../common/configurations";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type props = {
  timesSheet: TimeSheet[];
};

const ClocksInOutScreen = (props: props) => {
  return (
    <ScrollView style={styles.container}>
      <Text text50 marginB-25>
        Active Employees ({props.timesSheet.length})
      </Text>
      <View style={[styles.row, styles.header]}>
        <Text style={styles.cellHeader}>Employee</Text>
        <Text style={styles.cellHeader}>Begin</Text>
        <Text style={styles.cellHeader}>Time Logged</Text>
        <Text style={styles.cellHeader}>Activity</Text>
        <Text style={styles.cellHeader}>Actions</Text>
      </View>
      {props.timesSheet.map((item, index) => {
        const timeLogged = dayjs()
          .utcOffset(initialGlobalSetupConfiguration.timeOffSet)
          .diff(
            dayjs(item.begin).utcOffset(
              initialGlobalSetupConfiguration.timeOffSet
            ),
            "minutes"
          );

        // Convierte la diferencia en minutos a formato hh:mm
        const hours = Math.floor(timeLogged / 60);
        const minutes = timeLogged % 60;

        // Formatea la hora y los minutos
        const timeLoggedFormatted = `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}`;

        const isCurrent = index == 0;

        return (
          <View
            key={index}
            style={[styles.row, isCurrent ? styles.rowEven : styles.rowOdd]}
          >
            <View style={styles.cell}>
              <Avatar label={item.user.initials} size={30} />
              <Text style={{ marginLeft: 5 }}> {item.user.alias}</Text>
            </View>
            <Text style={styles.cell}>
              {dayjs(item.begin)
                .utcOffset(initialGlobalSetupConfiguration.timeOffSet)
                .format("hh:m a")}
            </Text>
            <Text style={styles.cell}>{timeLoggedFormatted}</Text>
            <Text style={styles.cell}>{item.activity.name}</Text>
            <View style={styles.cell}>
              {!isCurrent && (
                <Button style={{ backgroundColor: "#27ae60", marginRight: 10 }}>
                  <Text white>Set Current</Text>
                </Button>
              )}
              <Button style={{ backgroundColor: "#E57373", marginRight: 10 }}>
                <Text white>Clock Out</Text>
              </Button>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default ClocksInOutScreen;

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
