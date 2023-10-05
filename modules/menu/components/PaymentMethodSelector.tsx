import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import useOrderStore from "../../orders/OrdersStore";

const paymentMethods = [
  {
    name: "Cash",
    value: "ecr-cash",
    icon: (props = {}) => (
      <MaterialCommunityIcons
        name="cash"
        size={35}
        color={Colors.gray}
        {...props}
      />
    ),
  },
  {
    name: "Credit Card",
    value: "ecr-card",
    icon: (props = {}) => (
      <FontAwesome
        name="credit-card-alt"
        size={21}
        color={Colors.gray}
        {...props}
      />
    ),
  },
];
const PaymentMethodSelector = () => {
  const paymentMethodSelected = useOrderStore(
    (state) => state.inputValues.payment_method
  );
  const changeInputValue = useOrderStore((state) => state.changeInputValue);

  return (
    <View style={styles.container}>
      <Text text70>Payment Method</Text>
      <View row marginT-20>
        {paymentMethods.map((paymentMethodItem, idx) => {
          let isPaymentMethodActive =
            paymentMethodSelected == paymentMethodItem.value;

          return (
            <Button
              onPress={() =>
                changeInputValue("payment_method", paymentMethodItem.value)
              }
              useMinSize
              variant="iconButtonWithLabelCenterOutline"
              active={isPaymentMethodActive}
              style={{
                backgroundColor: isPaymentMethodActive ? "" : Colors.graySoft,
                paddingHorizontal: 15,
                marginRight: 20,
              }}
            >
              {paymentMethodItem.icon({
                color: isPaymentMethodActive ? Colors.primary : Colors.gray,
              })}
              <Text
                center
                color={isPaymentMethodActive ? Colors.primary : Colors.primary}
                marginT-14
                text80BL
              >
                {paymentMethodItem.name}
              </Text>
            </Button>
          );
        })}
      </View>
    </View>
  );
};

export default PaymentMethodSelector;

const styles = StyleSheet.create({
  container: {},
});
