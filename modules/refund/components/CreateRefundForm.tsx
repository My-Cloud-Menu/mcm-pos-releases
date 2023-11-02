import { ActivityIndicator, Alert, Platform, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { TextField } from "react-native-ui-lib/src/incubator";
import { Button, Colors, Picker, Text, View } from "react-native-ui-lib";
import Decimal from "decimal.js";
import CurrencyInput from "react-native-currency-input";
import { Payment } from "mcm-types";
import { getPaymentById, paymentQueryKey } from "../../payment/PaymentApi";
import {
  getAmountAvailableForRefund,
  getCreateRefundStructureForBackend,
  handleRefundInEcr,
  refundReasonsForSelect,
} from "../RefundHelper";
import { createRefund, handleEcrRefundSuccessful } from "../RefundApi";
import { onRequestError } from "../../common/PetitionsHelper";
import fonts from "../../common/theme/fonts";
import metrics from "../../common/theme/metrics";
import LabelValue from "../../common/components/LabelValue";
import { formatCurrency } from "../../common/UtilsHelper";
import TerminalConnectionChecker from "../../auth/components/TerminalConnectionChecker";
import MasterPasswordRequired from "../../common/components/MasterPasswordRequired";
import { handlePetitionError } from "../../common/AlertHelper";
import { queryClient } from "../../../app/_layout";

const initialInputValues = {
  amount: "0.00",
  reason: "",
  customReason: false,
  customReasonDetails: "",
};

type props = {
  paymentId: string;
};

const CreateRefundForm = (props: props) => {
  const paymentQuery = useQuery({
    queryKey: [paymentQueryKey, props.paymentId],
    queryFn: () => getPaymentById(props.paymentId),
  });

  const createRefundQuery = useMutation({
    onError: (error) => handlePetitionError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [paymentQueryKey, props.paymentId],
      });

      alert("salio bien :)");
    },
    mutationFn: async (params: {
      amountToRefund: string;
      reason: string;
      payment: Payment;
    }) => {
      const refundStructure = getCreateRefundStructureForBackend(
        params.amountToRefund.toString(),
        params.reason
      );
      const refundCreated = await createRefund(
        params.payment.id,
        refundStructure
      );

      const ecrRefundCreated = await handleRefundInEcr(
        refundCreated,
        params.payment
      );

      await handleEcrRefundSuccessful({
        refund: refundCreated,
        ecrRefundResult: ecrRefundCreated.ecrRefundResult,
        paymentInvoiceUpdated: ecrRefundCreated.paymentReceiptUpdated,
      });
    },
  });

  const [inputValues, setInputValues] = useState(initialInputValues);

  useEffect(() => {
    if (paymentQuery.data) {
      setInputValues({
        ...inputValues,
        amount: getAmountAvailableForRefund(paymentQuery.data),
      });
    }
  }, [paymentQuery.data]);

  //   useEffect(() => {
  //     // Helpers for Suggestions Bar
  //     const keyboardDidShowListener = Keyboard.addListener(
  //       "keyboardDidShow",
  //       () => {
  //         setShowRefundButton(false);
  //       }
  //     );
  //     const keyboardDidHideListener = Keyboard.addListener(
  //       "keyboardDidHide",
  //       () => {
  //         setShowRefundButton(true);
  //       }
  //     );

  //     return () => {
  //       keyboardDidHideListener.remove();
  //       keyboardDidShowListener.remove();
  //     };
  //   }, []);

  const amountAvailableForRefund = getAmountAvailableForRefund(
    paymentQuery.data
  );

  const validateAmountInputValue = (target: any) => {
    let inputValue = target.nativeEvent.text || "0.00";

    inputValue = inputValue.replace("$ ", "");

    if (isNaN(inputValue)) inputValue == "0.00";
    if (Number(inputValue) < 0.0) inputValue == "0.00";
    if (Number(inputValue) > Number(amountAvailableForRefund))
      inputValue = amountAvailableForRefund;

    inputValue = new Decimal(inputValue).toFixed(2);
    setInputValues({ ...inputValues, amount: inputValue });
  };

  const validateFields = () => {
    if (isNaN(inputValues.amount)) return false;
    if (Number(inputValues.amount) <= 0.0) return false;

    if (inputValues.reason.trim() == "") return false;

    if (
      inputValues.customReason &&
      inputValues.customReasonDetails.trim() == ""
    )
      return false;

    return true;
  };

  const getButtonLabel = () => {
    if (createRefundQuery.isLoading)
      return <ActivityIndicator color={Colors.white} />;

    if (createRefundQuery.isSuccess) return "Refund Created Succesfully";

    return inputValues.amount == amountAvailableForRefund
      ? "Make Full Refund"
      : `Refund $${inputValues.amount}`;
  };

  const onPressMakeRefund = () => {
    if (!validateFields()) return;

    if (Platform.OS == "web") {
      makeRefund();

      return;
    }

    Alert.alert(
      "Refund Payment",
      `Are you sure you want to ${getButtonLabel()}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes, Create Refund!",
          onPress: () => {
            makeRefund();
          },
        },
      ]
    );
  };

  const makeRefund = async () => {
    if (!validateFields()) return;
    if (createRefundQuery.isLoading) return;
    if (!paymentQuery?.data?.id) return;

    const refundReason = inputValues.customReason
      ? inputValues.customReasonDetails
      : inputValues.reason;

    createRefundQuery.mutate({
      payment: paymentQuery.data,
      amountToRefund: inputValues.amount,
      reason: refundReason,
    });
  };
  return (
    <MasterPasswordRequired>
      <TerminalConnectionChecker />
      <View style={{ backgroundColor: Colors.white, flex: 1 }}>
        <Text>Refund</Text>
        <View style={{ alignItems: "center" }}>
          <Text>Total to refund</Text>
          <CurrencyInput
            style={{
              fontWeight: "bold",
              fontSize: fonts.size.xxl,
              width: metrics.screenWidth,
              textAlign: "center",
            }}
            value={inputValues.amount}
            onChangeValue={(value) => {
              setInputValues({ ...inputValues, amount: value });
            }}
            prefix="$ "
            delimiter=","
            separator="."
            precision={2}
            minValue={0}
            maxValue={"999.99"}
            onEndEditing={validateAmountInputValue}
          />

          <View style={{ gap: 10 }}>
            <LabelValue
              label="Disponible para Reembolso"
              value={formatCurrency(
                getAmountAvailableForRefund(paymentQuery.data)
              )}
            />
          </View>

          {/* <RefundChargesDetails payment={paymentData} /> */}
          <Picker
            containerStyle={{
              marginTop: 30,
              backgroundColor: Colors.graySoft,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingTop: 5,
            }}
            label="Reason"
            // floatingPlaceholderColor="#000"
            floatingPlaceholderStyle={{
              fontSize: fonts.size.md,
            }}
            style={{
              width: metrics.screenWidth * 0.85,
              fontSize: fonts.size.sm + 2,
            }}
            migrate
            migrateTextField
            color={"#000"}
            placeholder={"Select a Refund Reason"}
            value={inputValues.reason}
            onChange={(value) => {
              setInputValues({
                ...inputValues,
                reason: value || "",
                customReason: value == "Other",
              });
            }}
          >
            {refundReasonsForSelect.map((reason) => (
              <Picker.Item key={reason} value={reason} label={reason} />
            ))}
          </Picker>
          {inputValues.customReason && (
            <TextField
              value={inputValues.customReasonDetails}
              onChangeText={(value) => {
                setInputValues({
                  ...inputValues,
                  customReasonDetails: value || "",
                });
              }}
              maxLength={150}
              containerStyle={{ marginTop: 15 }}
              style={{ width: metrics.screenWidth * 0.89 }}
              label="Details:"
              placeholder="Refund Reason"
              floatingPlaceholderStyle={{ fontSize: fonts.size.md }}
              fieldStyle={{
                borderBottomWidth: 1.8,
                borderColor: Colors.primary,
                paddingBottom: 4,
                borderRadius: 6,
              }}
            />
          )}
        </View>
      </View>

      <Button
        onPress={onPressMakeRefund}
        disabled={!validateFields()}
        label={getButtonLabel()}
        fullWidth
        backgroundColor={
          createRefundQuery.isSuccess ? Colors.green : Colors.primary
        }
        marginT-5
        style={{ borderRadius: 30, marginHorizontal: 10, marginBottom: 20 }}
      />
    </MasterPasswordRequired>
  );
};

export default CreateRefundForm;

const styles = StyleSheet.create({});
