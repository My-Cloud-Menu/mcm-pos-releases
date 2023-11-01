import { StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import React, { useState } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Stack } from "expo-router";
import ReceiptQrCode from "./ReceiptQrCode";
import { Payment } from "mcm-types";
import HtmlContent from "../../common/components/HtmlContent";
import { useMutation } from "@tanstack/react-query";
import { printECRCustomReceipt } from "../../payment/PaymentApi";
import { handlePetitionError, showAlert } from "../../common/AlertHelper";
import LabelValue from "../../common/components/LabelValue";
import { formatCurrency } from "../../common/UtilsHelper";

const receiptOptions = ["SHOW", "SMS"];

interface props {
  payment: Payment;
}

const ReceiptScreen = ({ payment }: props) => {
  const [selectedReceipt, setSelectedReceipt] = useState<string | undefined>(
    undefined
  );

  const printReceiptQuery = useMutation({
    mutationFn: printECRCustomReceipt,
    onError: (error) => handlePetitionError(error),
    onSuccess: () => {
      showAlert({ title: "Receipt Printed Successfully", type: "success" });
    },
  });

  const onPressReceiptOption = (option: string) => {
    if (selectedReceipt == option) {
      setSelectedReceipt(undefined);
      return;
    }

    setSelectedReceipt(option);
  };

  const paymentDetailsLabelValues = [
    { label: "Status", value: "Approved." },
    { label: "Invoice", value: payment.invoice },
    { label: "Reference", value: payment.reference },
    { label: "Total", value: formatCurrency(payment.total) },
  ];

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: `Receipt - Payment #${payment.id}`,
          headerLeft: () => undefined,
        }}
      />
      <View row>
        <View
          paddingT-20
          paddingL-30
          br40
          style={{ backgroundColor: "#fff", minHeight: 1200 }}
        >
          <View flex centerH>
            <Text text20L marginT-10 marginB-20>
              Thank You
            </Text>
            <ReceiptQrCode paymentId={payment.id} />
            <View
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
                    style={{ borderColor: Colors.primary, width: 300 }}
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
        </View>
        <View centerH flex>
          {selectedReceipt == undefined && (
            <View marginT-30>
              <Text center text30 marginB-60>
                Details
              </Text>
              <View style={{ rowGap: 24, width: 340 }}>
                {paymentDetailsLabelValues.map((item) => (
                  <View row spread>
                    <Text text50L>{item.label}</Text>
                    <Text text50L>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedReceipt == "SHOW" && (
            <View>
              <Button
                marginT-5
                marginB-20
                size="small"
                disabled={printReceiptQuery.isLoading}
                onPress={() => printReceiptQuery.mutate(payment.receipt_html)}
                label={
                  printReceiptQuery.isLoading ? (
                    <ActivityIndicator color={"white"} />
                  ) : (
                    "Print Receipt"
                  )
                }
              />
              <HtmlContent htmlContent={payment.receipt_html} />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({});
