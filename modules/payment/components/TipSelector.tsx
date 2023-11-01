import { StyleSheet } from "react-native";
import React from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import usePaymentStore from "../PaymentStore";
import CurrencyInput from "react-native-currency-input";
import fonts from "../../common/theme/fonts";

const options = [
  { label: "10%", value: 10 },
  { label: "20%", value: 20 },
  { label: "30%", value: 30 },
  { label: "40%", value: 40 },
  // { label: "Custom", value: "custom" },
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
    } else if (tipOption.value == "custom") {
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
    <View centerH>
      <View
        row
        marginT-10
        centerH
        style={{ flexWrap: "wrap", maxWidth: 1200, columnGap: 30, rowGap: 20 }}
      >
        {options.map((option, idx) => {
          let isOptionActive =
            paymentStore.inputValues.selectedTip == option.value;

          return (
            <Button
              onPress={() => onPressTip(option)}
              variant="iconButtonWithLabelCenterOutline"
              active={isOptionActive}
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
        <CurrencyInput
          style={{
            borderColor: Colors.primary,
            width: 150,
            minHeight: 50,
            borderRadius: 8,
            borderWidth: 0.08,
            textAlign: "center",
            color: Colors.primary,
            fontSize: 19,
          }}
          value={
            paymentStore.inputValues.selectedTip == "custom"
              ? Number(paymentStore.inputValues.tip)
              : null
          }
          onChangeValue={(newAmount) => {
            newAmount = newAmount || 0;
            paymentStore.changeInputValue("tip", Math.abs(newAmount));
            paymentStore.changeInputValue("selectedTip", "custom");

            // setAmount(Math.abs(newAmount).toString());
          }}
          prefix="$ "
          delimiter=","
          separator="."
          precision={2}
          minValue={0}
          maxValue={999.99}
          placeholder="Custom Tip"
        />
      </View>
    </View>
  );
};

export default TipSelector;

const styles = StyleSheet.create({
  container: {},
});
