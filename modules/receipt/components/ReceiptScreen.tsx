import { StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import React, { useState } from "react";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Payment } from "mcm-types";
import HtmlContent from "../../common/components/HtmlContent";
import { useMutation } from "@tanstack/react-query";
import { handlePetitionError, showAlert } from "../../common/AlertHelper";
import { formatCurrency } from "../../common/UtilsHelper";
import { printECRCustomReceipt } from "../ReceiptApi";
import SendReceiptBySmsForm from "./SendReceiptBySmsForm";
import { getPaymentStatusForReceipt } from "../ReceiptHelper";
import { Ionicons } from "@expo/vector-icons";
import {
  isNextPaymentAvailable,
  isNextPaymentAvailableBySplitOfProducts,
} from "../../payment/PaymentHelper";
import useSplitStore from "../../payment/SplitStore";
import { goToPaymentScreen } from "../../common/NavigationHelper";

const receiptOptions = ["Show Payment Receipt", "Show Order Receipt", "SMS"];

interface props {
  payment: Payment;
}

const ReceiptScreen = ({ payment }: props) => {
  const [selectedReceipt, setSelectedReceipt] = useState<string | undefined>(
    undefined
  );
  const { splitProductsToPay, splitAmountsToPay } = useSplitStore();

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

  const onPressPayNext = () => {
    goToPaymentScreen(payment.orders_ids[0]);
  };

  const paymentDetailsLabelValues = [
    {
      label: "Status",
      value: getPaymentStatusForReceipt(payment.status),
    },
    { label: "Invoice", value: payment.invoice },
    { label: "Reference", value: payment.reference },
    { label: "Total", value: formatCurrency(payment.total) },
  ];

  const isSplitByProduct = false;

  let isPayNextIsAvailable = isSplitByProduct
    ? isNextPaymentAvailableBySplitOfProducts(splitProductsToPay)
    : isNextPaymentAvailable(splitAmountsToPay);

  return (
    <ScrollView>
      <View row>
        <View
          paddingT-20
          paddingL-30
          br40
          style={{ backgroundColor: "#fff", minHeight: 1000 }}
        >
          <View flex centerH paddingR-40>
            <Text text20L marginT-10 marginB-20>
              Thank You
            </Text>
            {/* <ReceiptQrCode paymentId={payment.id} /> */}
            <View
              marginT-20
              centerH
              style={{ flexWrap: "wrap", maxWidth: 800 }}
            >
              <Button
                key={`receiptoption-printitemizedreceipt`}
                onPress={() =>
                  printReceiptQuery.mutate(payment.receipt_itemized_html)
                }
                marginV-10
                marginH-25
                style={{ borderColor: Colors.primary, width: 300 }}
                label="Print Order Receipt"
              />

              {receiptOptions.map((option) => {
                const isActive = option == selectedReceipt;
                return (
                  <Button
                    key={`receiptoption-${option}`}
                    onPress={() => onPressReceiptOption(option)}
                    variant="iconButtonWithLabelCenterOutline"
                    active={isActive}
                    marginV-10
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
              {isPayNextIsAvailable && (
                <Button
                  onPress={onPressPayNext}
                  style={{ width: 300, marginTop: 40 }}
                  label="PAY NEXT"
                  text70
                  iconSource={() => (
                    <Ionicons
                      name="person-sharp"
                      size={14}
                      color="white"
                      style={{ marginRight: 10 }}
                    />
                  )}
                />
              )}
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

          {selectedReceipt == "Show Payment Receipt" && (
            <View
              flex
              style={{
                minWidth: 430,
                paddingHorizontal: 20,
                backgroundColor: "#fff",
              }}
            >
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

          {selectedReceipt == "Show Order Receipt" && (
            <View
              flex
              style={{
                minWidth: 430,
                paddingHorizontal: 20,
                backgroundColor: "#fff",
              }}
            >
              <Button
                marginT-5
                marginB-20
                size="small"
                disabled={printReceiptQuery.isLoading}
                onPress={() =>
                  printReceiptQuery.mutate(payment.receipt_itemized_html)
                }
                label={
                  printReceiptQuery.isLoading ? (
                    <ActivityIndicator color={"white"} />
                  ) : (
                    "Print Receipt"
                  )
                }
              />
              <HtmlContent htmlContent={payment.receipt_itemized_html} />
            </View>
          )}

          {selectedReceipt == "SMS" && (
            <SendReceiptBySmsForm paymentId={payment.id} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ReceiptScreen;

const styles = StyleSheet.create({});
