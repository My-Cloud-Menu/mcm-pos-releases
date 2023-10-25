import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import useOrderStore from "../../orders/OrdersStore";

const paymentMethods = [
  {
    name: "Takeout",
    value: "pu",
    icon: (props = {}) => (
      <Entypo name="shopping-bag" size={30} color={Colors.gray} {...props} />
    ),
  },
  {
    name: "Table",
    value: "qe",
    icon: (props = {}) => (
      <FontAwesome5 name="chair" size={30} color={Colors.gray} {...props} />
    ),
  },
  {
    name: "Delivery",
    value: "dl",
    icon: (props = {}) => (
      <MaterialIcons
        name="delivery-dining"
        size={30}
        color={Colors.gray}
        {...props}
      />
    ),
  },
];
const ExperienceSelector = () => {
  const experienceSelected = useOrderStore(
    (state) => state.inputValues.experience
  );
  const changeInputValue = useOrderStore((state) => state.changeInputValue);

  return (
    <View style={styles.container}>
      <Text text70 style={{ fontWeight: "bold" }}>
        Experience
      </Text>
      <View row centerH marginT-10 style={{ gap: 20 }}>
        {paymentMethods.map((item, idx) => {
          let isPaymentMethodActive = experienceSelected == item.value;

          return (
            <Button
              onPress={() => changeInputValue("experience", item.value)}
              useMinSize
              variant="iconButtonWithLabelCenterOutline"
              active={isPaymentMethodActive}
              style={{
                backgroundColor: isPaymentMethodActive ? "" : Colors.graySoft,
                paddingHorizontal: 19,
              }}
            >
              {item.icon({
                color: isPaymentMethodActive ? Colors.primary : Colors.gray,
              })}
              <Text
                center
                color={isPaymentMethodActive ? Colors.primary : Colors.primary}
                marginT-8
                text75
              >
                {item.name}
              </Text>
            </Button>
          );
        })}
      </View>
    </View>
  );
};

export default ExperienceSelector;

const styles = StyleSheet.create({
  container: {},
});
