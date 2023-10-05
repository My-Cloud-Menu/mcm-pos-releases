import { StyleSheet } from "react-native";
import React from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import usePaymentStore from "../PaymentStore";

const options = [
  { label: "10%", value: 10 },
  { label: "20%", value: 20 },
  { label: "30%", value: 30 },
  { label: "40%", value: 40 },
  { label: "Custom", value: "Custom" },
  { label: "NO", value: 0 },
];

interface props {
  paymentTotal: number;
}

const TipSelector = ({ paymentTotal }: props) => {
  const paymentStore = usePaymentStore();

  const onPressTip = (tipOption: any) => {
    if (tipOption.value == 0) {
      paymentStore.changeInputValue("tip", 0);
      paymentStore.changeInputValue("selectedTip", 0);
    } else if (tipOption.value == "Custom") {
      paymentStore.changeShowCustomTipModal(true);
      paymentStore.changeInputValue("tip", 0);
      paymentStore.changeInputValue("selectedTip", tipOption.value);
    } else {
      paymentStore.changeInputValue(
        "tip",
        (tipOption.value / 100) * paymentTotal
      );
      paymentStore.changeInputValue("selectedTip", tipOption.value);
    }
  };

  return (
    <View style={styles.container}>
      <View row marginT-20 centerH style={{ flexWrap: "wrap", maxWidth: 800 }}>
        {options.map((option, idx) => {
          let isOptionActive =
            paymentStore.inputValues.selectedTip == option.value;

          return (
            <Button
              onPress={() => onPressTip(option)}
              variant="iconButtonWithLabelCenterOutline"
              active={isOptionActive}
              marginV-15
              marginH-25
              style={{ borderColor: Colors.primary, width: 150 }}
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
    </View>
  );
};

export default TipSelector;

const styles = StyleSheet.create({
  container: {},
});
