import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { TimeSheet } from "../../../types";
import { Avatar, Button, Text, View } from "react-native-ui-lib";
import dayjs from "dayjs";
import { initialGlobalSetupConfiguration } from "../../common/configurations";
import utc from "dayjs/plugin/utc";
import useAuthStore from "../AuthStore";
import { getInitials } from "../../common/UtilsHelper";
import { Employee } from "mcm-types";
import { showAlert } from "../../common/AlertHelper";
import { useMutation } from "@tanstack/react-query";
import { logout, timesSheetQueryKey } from "../AuthApi";
import { router, useNavigation } from "expo-router";
import { onRequestError } from "../../common/PetitionsHelper";
import { queryClient } from "../../../app/_layout";
dayjs.extend(utc);

type props = {
  timesSheet: TimeSheet[];
};

const ClocksInOutScreen = (props: props) => {
  const authStore = useAuthStore((state) => state);
  const navigation = useNavigation();

  const logoutQuery = useMutation({
    mutationFn: async (employee: Employee) => {
      if (props.timesSheet.length == 1) {
        await logout(employee.id);
        authStore.removeCurrentEmployeeLogged();
        navigation.dispatch({ type: "POP_TO_TOP" });
        return;
      } else if (props.timesSheet.length > 1) {
        let timeSheetOfEmployeeAvailable = props.timesSheet.filter(
          (timeSheet) => timeSheet.user.id != employee.id
        );
        await logout(employee.id);
        authStore.changeCurrentEmployeeLogged(
          timeSheetOfEmployeeAvailable[0].user
        );

        showAlert({
          type: "warning",
          title: `The employee ${
            employee.first_name || employee.middle_name
          } clocked out successfully`,
        });

        setTimeout(() => {
          showAlert({
            type: "success",
            title: `The employee ${
              timeSheetOfEmployeeAvailable[0].user.first_name ||
              timeSheetOfEmployeeAvailable[0].user.middle_name
            } is now the current user!`,
          });
        }, 4000);
      } else {
        throw "";
      }
    },
    onError: (error) => onRequestError(error, "Something went wrong"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [timesSheetQueryKey] });
    },
  });

  const onPressSetCurrentEmployee = (employee: Employee) => {
    authStore.changeCurrentEmployeeLogged(employee);
    showAlert({
      type: "success",
      title: `The employee ${
        employee.first_name || employee.middle_name
      } is now the current user!`,
    });
  };

  const onPressClockOutEmployee = (employee: Employee) => {
    if (logoutQuery.isLoading) return;

    logoutQuery.mutate(employee);
  };

  const onPressClockIn = () => {
    router.push("/(menu)/clockin");
  };

  return (
    <ScrollView style={styles.container}>
      <View row spread centerV marginB-25 paddingR-20>
        <Text text50>Active Employees ({props.timesSheet.length})</Text>
        <View>
          <Button onPress={onPressClockIn}>
            <Text white marginH-20>
              Clock In
            </Text>
          </Button>
        </View>
      </View>
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

        const isCurrent =
          authStore.employeeLogged?.id.toString() == item.user.id.toString();

        const name = item.user.first_name || item.user.middle_name;
        const isLogoutQueryLoading =
          logoutQuery.isLoading && logoutQuery.variables?.id == item.user.id;
        return (
          <View
            key={index}
            style={[styles.row, isCurrent ? styles.rowEven : styles.rowOdd]}
          >
            <View style={styles.cell}>
              <Avatar label={getInitials(name)} size={30} />
              <Text style={{ marginLeft: 5 }}> {name}</Text>
            </View>
            <Text style={styles.cell}>
              {dayjs(item.begin)
                .utcOffset(initialGlobalSetupConfiguration.timeOffSet)
                .format("hh:mm a")}
            </Text>
            <Text style={styles.cell}>{timeLoggedFormatted}</Text>
            <Text style={styles.cell}>{item.activity.name}</Text>
            <View style={styles.cell}>
              {!isCurrent && (
                <Button
                  onPress={() => onPressSetCurrentEmployee(item.user)}
                  style={{ backgroundColor: "#27ae60", marginRight: 10 }}
                >
                  <Text white>Set Current</Text>
                </Button>
              )}
              <Button
                onPress={() => onPressClockOutEmployee(item.user)}
                style={{ backgroundColor: "#E57373", marginRight: 10 }}
              >
                <Text white>
                  {isLogoutQueryLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    "Clock Out"
                  )}
                </Text>
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
