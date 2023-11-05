import { Table } from "mcm-types";
import React, { useState } from "react";
import { StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Button, Colors, Picker, Text, View } from "react-native-ui-lib";
import { FontAwesome5 } from "@expo/vector-icons";
import { shadowProps } from "../../common/theme/shadows";
import useOrderStore from "../../orders/OrdersStore";
import { router } from "expo-router";

const initialFiltersValues = {
  seats: "all",
  center: "all",
};

type props = {
  tablesAvailable: Table[];
};

const TableSelectorScreen = ({ tablesAvailable }: props) => {
  const tableSelected = useOrderStore((state) => state.inputValues.table);
  const changeInputValue = useOrderStore((state) => state.changeInputValue);

  const [filtersValues, setFiltersValues] = useState(initialFiltersValues);

  const getListOfSeatsAvailable = () => {
    if (!tablesAvailable) return [];

    let seats = tablesAvailable.map((tableAvailable) => tableAvailable?.seats);

    return [...new Set(seats)].filter((seat) => seat != null);
  };

  const getListOfRevenuesCenterAvailable = () => {
    if (!tablesAvailable) return [];

    let revenueCenters = tablesAvailable.map(
      (tableAvailable) => tableAvailable?.revenueCenter?.name
    );

    return [...new Set(revenueCenters)].filter(
      (revenueCenter) => revenueCenter != null
    );
  };

  const getTablesFiltered = () => {
    let tablesFiltered = tablesAvailable;

    if (filtersValues.seats != "all") {
      tablesFiltered = tablesFiltered.filter(
        (table) => table?.seats.toString() == filtersValues.seats
      );
    }

    if (filtersValues.center != "all") {
      tablesFiltered = tablesFiltered.filter(
        (table) => table?.revenueCenter.name == filtersValues.center
      );
    }

    return tablesFiltered;
  };

  const onPressTable = (table: Table) => {
    changeInputValue("table", table);
    router.push("/(menu)");
  };

  return (
    <View row flex>
      <View paddingH-10 br40 style={{ width: "30%", backgroundColor: "#fff" }}>
        <Text center text30 marginV-40 style={{ fontWeight: "bold" }}>
          Select Table
        </Text>
        <Text text80 black marginL-5 marginB-15 style={{ fontWeight: "bold" }}>
          Filters
        </Text>
        <Picker
          containerStyle={{
            backgroundColor: Colors.graySoft,
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: 20,
          }}
          floatingPlaceholderColor="#000"
          style={{ maxWidth: "100%" }}
          floatingPlaceholder
          value={filtersValues.seats}
          placeholder={"Seats"}
          onChange={(value) =>
            setFiltersValues({ ...filtersValues, seats: value })
          }
        >
          <Picker.Item
            key={`tableseat-default`}
            value={"all"}
            label={"All Seats"}
            labelStyle={{ padding: Platform.OS == "web" ? 15 : undefined }}
          />
          {getListOfSeatsAvailable().map((seat) => (
            <Picker.Item
              key={`tableseat-${seat}`}
              value={`${seat}`}
              label={`${seat} Seats`}
              labelStyle={{ padding: Platform.OS == "web" ? 15 : undefined }}
            />
          ))}
        </Picker>

        <Picker
          containerStyle={{
            backgroundColor: Colors.graySoft,
            borderRadius: 10,
            paddingHorizontal: 10,
          }}
          floatingPlaceholderColor="#000"
          style={{ maxWidth: "100%" }}
          floatingPlaceholder
          value={filtersValues.center}
          placeholder={"Centers"}
          onChange={(value) =>
            setFiltersValues({ ...filtersValues, center: value })
          }
        >
          <Picker.Item
            key={`tablerevenue-default`}
            value={"all"}
            label={"All Centers"}
            labelStyle={{ padding: Platform.OS == "web" ? 15 : undefined }}
          />
          {getListOfRevenuesCenterAvailable().map((revenueCenter) => (
            <Picker.Item
              key={`tablerevenue-${revenueCenter}`}
              value={`${revenueCenter}`}
              label={`${revenueCenter}`}
              labelStyle={{ padding: Platform.OS == "web" ? 15 : undefined }}
            />
          ))}
        </Picker>
        <Button
          variant="iconButtonWithLabelCenterOutline"
          marginH-5
          marginT-15
          onPress={() => setFiltersValues(initialFiltersValues)}
        >
          <Text black>Clear Filters</Text>
        </Button>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexWrap: "wrap",
          flexDirection: "row",
          gap: 30,
          //   justifyContent: "space-around",
          paddingHorizontal: 30,
          paddingVertical: 20,
        }}
      >
        {getTablesFiltered().map((tableAvailable, key) => (
          <Pressable
            onPress={() => onPressTable(tableAvailable)}
            key={`tableavailable-${key}`}
            style={{
              justifyContent: "center",
              width: 180,
              height: 130,
              padding: 10,
              paddingTop: 20,
              borderRadius: 8,
              ...shadowProps,
              backgroundColor:
                tableAvailable?.id == tableSelected?.id
                  ? Colors.primary
                  : tableAvailable?.available
                  ? "#00ae4c"
                  : "#F44336",
            }}
          >
            <Text white text50L center>
              Table {tableAvailable.name || tableAvailable.number}
            </Text>
            <Text white text10 center marginT-1>
              {tableAvailable.seats || "-"}{" "}
              <FontAwesome5 name="chair" size={17} color="#fff" />
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default TableSelectorScreen;
