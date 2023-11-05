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
import {
  createRefund,
  handleEcrRefundSuccessful,
  refundsQueryKey,
} from "../RefundApi";
import LabelValue from "../../common/components/LabelValue";
import { formatCurrency } from "../../common/UtilsHelper";
import TerminalConnectionChecker from "../../auth/components/TerminalConnectionChecker";
import MasterPasswordRequired from "../../common/components/MasterPasswordRequired";
import { handlePetitionError, showAlert } from "../../common/AlertHelper";
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

      queryClient.invalidateQueries({
        queryKey: [refundsQueryKey, props.paymentId],
      });

      showAlert({ title: "Refund creado exitosamente!", type: "success" });
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

    if (Number(inputValues.amount) > Number(amountAvailableForRefund))
      return false;

    return true;
  };

  const getButtonLabel = () => {
    if (createRefundQuery.isLoading)
      return <ActivityIndicator color={Colors.white} />;

    if (createRefundQuery.isSuccess) return "Reembolso creado exitosamente!";

    return inputValues.amount == amountAvailableForRefund
      ? "Make Full Refund"
      : `Refund $${inputValues.amount}`;
  };

  const onPressMakeRefund = () => {
    if (!validateFields()) return;

    if (createRefundQuery.isLoading || createRefundQuery.isSuccess) {
      return;
    }

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
      <View style={{ backgroundColor: Colors.white }}>
        <Text center marginT-10 text40 marginB-30>
          Reembolso
        </Text>
        <View style={{ alignItems: "center" }}>
          <Text>Total a reembolsar</Text>
          <CurrencyInput
            style={{
              fontWeight: "bold",
              fontSize: 65,
              // width: metrics.screenWidth,
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

          <View marginT-20 style={{ gap: 10 }}>
            <LabelValue
              label="Disponible para Reembolso:   "
              value={formatCurrency(
                getAmountAvailableForRefund(paymentQuery.data)
              )}
            />
          </View>

          {/* <RefundChargesDetails payment={paymentData} /> */}
          <Picker
            containerStyle={{
              marginTop: 60,
              backgroundColor: Colors.graySoft,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingTop: 5,
            }}
            label="Razon*"
            // floatingPlaceholderColor="#000"
            floatingPlaceholderStyle={{
              fontSize: 30,
            }}
            style={{
              width: 400,
              fontSize: 23,
            }}
            migrate
            migrateTextField
            color={"#000"}
            placeholder={"Seleccione la razon del reembolso"}
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
              <Picker.Item
                key={reason}
                value={reason}
                label={reason}
                labelStyle={{ padding: Platform.OS == "web" ? 15 : undefined }}
              />
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
              maxLength={200}
              containerStyle={{ marginTop: 15 }}
              style={{ width: 400 }}
              label="Detalles:"
              placeholder="Refund Reason"
              floatingPlaceholderStyle={{ fontSize: 23 }}
              fieldStyle={{
                borderBottomWidth: 1.8,
                borderColor: Colors.primary,
                paddingBottom: 10,
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
        style={{ marginTop: 70, marginBottom: 20, width: "80%" }}
      />
    </MasterPasswordRequired>
  );
};

export default CreateRefundForm;

const styles = StyleSheet.create({});
