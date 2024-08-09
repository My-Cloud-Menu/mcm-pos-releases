import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import useOrderStore from "../../orders/OrdersStore";
import { router } from "expo-router";
import { Table } from "mcm-types";
import { shadowProps } from "../../common/theme/shadows";
const paymentMethods = [
  {
    name: "Takeout",
    value: "pu",
    icon: (props = {}) => (
      <Entypo name="shopping-bag" size={28} color={Colors.gray} {...props} />
    ),
  },
  {
    name: "Table",
    value: "qe",
    icon: (props = {}) => (
      <FontAwesome5 name="chair" size={28} color={Colors.gray} {...props} />
    ),
  },
  {
    name: "Delivery",
    value: "dl",
    icon: (props = {}) => (
      <MaterialIcons
        name="delivery-dining"
        size={28}
        color={Colors.gray}
        {...props}
      />
    ),
  },
];

const TableCard = ({ table }: { table?: Table }) => {
  const onPressChangeTable = () => {
    router.push("/(menu)/table-selector");
  };

  if (!table)
    return (
      <Button
        variant="iconButtonWithLabelCenterOutline"
        marginT-15
        onPress={onPressChangeTable}
      >
        <Text black style={{ fontWeight: "bold" }}>
          Select Table
        </Text>
      </Button>
    );

  return (
    <View
      row
      centerV
      spread
      padding-10
      marginT-10
      marginH-5
      br20
      style={{
        backgroundColor: "#f9f8fb",
        ...shadowProps,
      }}
    >
      <View>
        <Text style={{ fontWeight: "bold" }}>Table {table.name}</Text>
      </View>
      <Button
        variant="iconButtonWithLabelCenterOutline"
        onPress={onPressChangeTable}
      >
        <Text black>Change</Text>
      </Button>
    </View>
  );
};

const ExperienceSelector = () => {
  const inputValues = useOrderStore((state) => state.inputValues);
  const changeInputValue = useOrderStore((state) => state.changeInputValue);

  const onPressExperience = (experience: any) => {
    changeInputValue("experience", experience.value);

    if (experience.value == "qe") {
      router.push("/(menu)/table-selector");
    }
  };

  return (
    <View style={styles.container}>
      <Text text70 style={{ fontWeight: "bold" }}>
        Experience
      </Text>
      <View row centerH marginT-10 style={{ gap: 10 }}>
        {paymentMethods.map((item, idx) => {
          let isPaymentMethodActive = inputValues.experience == item.value;

          return (
            <Button
              onPress={() => onPressExperience(item)}
              useMinSize
              variant="iconButtonWithLabelCenterOutline"
              active={isPaymentMethodActive}
              style={{
                backgroundColor: isPaymentMethodActive ? "" : Colors.graySoft,
                paddingHorizontal: 12,
              }}
            >
              {item.icon({
                color: isPaymentMethodActive ? Colors.primary : Colors.gray,
              })}
              <Text
                center
                color={isPaymentMethodActive ? Colors.primary : Colors.primary}
                text75
              >
                {item.name}
              </Text>
            </Button>
          );
        })}
      </View>
      {inputValues.experience == "qe" && (
        <TableCard table={inputValues.table} />
      )}
    </View>
  );
};

export default ExperienceSelector;

const styles = StyleSheet.create({
  container: {},
});
