import { ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Order } from "mcm-types";
import {
  calculateAmountsForSplit,
  getAmountAvailableForSplit,
} from "../PaymentHelper";
import { goToPaymentScreen } from "../../common/NavigationHelper";
import useSplitStore from "../SplitStore";

const options = [
  { label: "Full Amount", value: 1 },
  { label: "2 Ways", value: 2 },
  { label: "3 Ways", value: 3 },
  { label: "4 Ways", value: 4 },
  { label: "5 Ways", value: 5 },
  { label: "6 Ways", value: 6 },
];

type props = { order: Order };

const SplitPaymentScreen = (props: props) => {
  const { setSplitAmountsToPay, resetSplitPayment } = useSplitStore();

  const [splitWaySelected, setSplitWaySelected] = useState(1);

  const onPressSplitWay = (option: any) => {
    setSplitWaySelected(option.value);
  };

  const onPressSplitButton = async () => {
    if (splitWaySelected == 1) {
      resetSplitPayment();
      goToPaymentScreen(props.order.id, props.order);
      return;
    }

    const amountsToPay = calculateAmountsForSplit(
      getAmountAvailableForSplit(props.order),
      splitWaySelected
    );

    setSplitAmountsToPay(amountsToPay);
    goToPaymentScreen(props.order.id, props.order);
  };

  const totalSplited =
    getAmountAvailableForSplit(props.order) / splitWaySelected;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View centerH flex>
        <Text text50 marginT-10 marginB-15>
          {splitWaySelected} Way Split Amount
        </Text>
        <Button
          variant="iconButtonWithLabelCenterOutline"
          style={{ borderColor: "#000", width: 250, paddingVertical: 5 }}
        >
          <Text center text50L>
            $ {totalSplited.toFixed(2)}
          </Text>
        </Button>

        <View
          row
          marginT-60
          centerH
          style={{
            flexWrap: "wrap",
            maxWidth: 600,
            columnGap: 30,
            rowGap: 25,
          }}
        >
          {options.map((option, idx) => {
            let isOptionActive = option.value == splitWaySelected;

            return (
              <Button
                onPress={() => onPressSplitWay(option)}
                variant="iconButtonWithLabelCenterOutline"
                active={isOptionActive}
                style={{ borderColor: Colors.primary, width: 180 }}
              >
                <Text
                  center
                  color={isOptionActive ? Colors.primary : Colors.primary}
                  text60L
                >
                  {option.label}
                </Text>
              </Button>
            );
          })}
        </View>
        {/* <Button
          fullWidth
          style={{ backgroundColor: Colors.green, marginTop: 30, width: 590 }}
          label="Products"
        /> */}

        <Button
          onPress={onPressSplitButton}
          fullWidth
          style={{
            width: "85%",
            marginTop: 150,
          }}
          label="SPLIT"
        />
      </View>
    </ScrollView>
  );
};

export default SplitPaymentScreen;

const styles = StyleSheet.create({});
