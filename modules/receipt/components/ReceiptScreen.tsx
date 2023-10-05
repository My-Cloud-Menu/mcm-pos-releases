import { StyleSheet, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Stack } from "expo-router";
import ReceiptQrCode from "./ReceiptQrCode";
import { Payment } from "mcm-types/src/payment";

const receiptOptions = ["SMS", "SHOW"];

interface props {
  payment: Payment;
}

const ReceiptScreen = ({ payment }: props) => {
  const [selectedReceipt, setSelectedReceipt] = useState<string | undefined>(
    undefined
  );

  const onPressReceiptOption = (option: string) => {
    setSelectedReceipt(option);
  };

  return (
    <View flex backgroundColor={Colors.graySoft}>
      <Stack.Screen
        options={{
          title: `Receipt - Payment #${payment.id}`,
          headerLeft: () => undefined,
        }}
      />
      <View flex centerH>
        <Text text30L marginT-10 marginB-20>
          Thank You
        </Text>
        <ReceiptQrCode paymentId={payment.id} />
        <View
          row
          marginT-20
          centerH
          style={{ flexWrap: "wrap", maxWidth: 800 }}
        >
          {receiptOptions.map((option) => {
            const isActive = option == selectedReceipt;
            return (
              <Button
                key={`receiptoption-${option}`}
                onPress={() => onPressReceiptOption(option)}
                variant="iconButtonWithLabelCenterOutline"
                active={isActive}
                marginV-15
                marginH-25
                style={{ borderColor: Colors.primary, width: 150 }}
              >
                <Text
                  center
                  color={isActive ? Colors.primary : Colors.primary}
                  text60L
                >
                  {option}
                </Text>
              </Button>
            );
          })}
        </View>
      </View>
      <View paddingB-20></View>
    </View>
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({});
