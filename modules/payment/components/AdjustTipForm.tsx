import { ActivityIndicator, Alert, Platform, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import Decimal from "decimal.js";
import CurrencyInput from "react-native-currency-input";
import {
  createTipAdjustment,
  getPaymentById,
  handleEcrTipAdjustmentSuccessful,
  makeEcrTipAdjust,
  paymentQueryKey,
  tipAdjustsQueryKey,
} from "../PaymentApi";
import { Payment } from "mcm-types";
import { handlePetitionError, showAlert } from "../../common/AlertHelper";
import {
  getCreateTipAdjustStructureForBackend,
  getEcrDataSubtotal,
} from "../PaymentHelper";
import { reprintEcrReceipt } from "../../receipt/ReceiptApi";
import fonts from "../../common/theme/fonts";
import metrics from "../../common/theme/metrics";
import TerminalConnectionChecker from "../../auth/components/TerminalConnectionChecker";
import { queryClient } from "../../../app/_layout";
import MasterPasswordRequired from "../../common/components/MasterPasswordRequired";

const initialInputValues = {
  amount: "0.00",
  reason: "",
  customReason: false,
  customReasonDetails: "",
};

type props = {
  paymentId: string;
};

const AdjustTipForm = (props: props) => {
  const [inputValues, setInputValues] = useState(initialInputValues);

  const paymentQuery = useQuery({
    queryKey: [paymentQueryKey, props.paymentId],
    queryFn: () => getPaymentById(props.paymentId),
  });

  const createAdjustTipQuery = useMutation({
    onError: (error) => handlePetitionError(error),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [paymentQueryKey, props.paymentId],
      });

      queryClient.invalidateQueries({
        queryKey: [tipAdjustsQueryKey, props.paymentId],
      });

      showAlert({
        title: "Ajuste de Propina creado exitosamente!",
        type: "success",
      });
    },
    mutationFn: async (params: { amount: string; payment: Payment }) => {
      const adjustTipStructure = getCreateTipAdjustStructureForBackend(
        params.amount
      );
      const adjustTipCreated = await createTipAdjustment(
        params.payment.id,
        adjustTipStructure
      );

      const ecrAdjustTipCreated = await makeEcrTipAdjust(
        params.payment.reference,
        adjustTipCreated.new_tip
      );

      let paymentECRReceiptUpdated = null;

      try {
        const getReceiptResult = await reprintEcrReceipt("html");

        paymentECRReceiptUpdated =
          getReceiptResult?.receipt_output?.customer ||
          getReceiptResult?.receipt_output?.merchant;
      } catch (err) {
        console.log(err);
      }

      await handleEcrTipAdjustmentSuccessful({
        tipAdjustment: adjustTipCreated,
        payment_receipt_html_updated: paymentECRReceiptUpdated,
      });
    },
  });

  if (!Boolean(paymentQuery.data)) return <ActivityIndicator />;

  const validateAmountInputValue = (target: any) => {
    let inputValue = target.nativeEvent.text || "0.00";

    inputValue = inputValue.replace("$ ", "");

    if (isNaN(inputValue)) inputValue == "0.00";
    if (Number(inputValue) < 0.0) inputValue == "0.00";

    const subtotal =
      getEcrDataSubtotal(paymentQuery.data) || paymentQuery.data?.total;

    if (Number(inputValue) > Number(subtotal)) {
      showAlert({
        type: "warning",
        title: "Monto de Propina Excedido",
        description:
          "El monto de propina no puede ser mayor al 100% del subtotal de la venta",
      });

      inputValue = subtotal;
    }

    inputValue = new Decimal(inputValue).toFixed(2);
    setInputValues({ ...inputValues, amount: inputValue });
  };

  const validateFields = () => {
    if (isNaN(inputValues.amount)) return false;
    if (Number(inputValues.amount) == Number(paymentQuery?.data?.tip))
      return false;

    return true;
  };

  const getButtonLabel = () => {
    if (createAdjustTipQuery.isLoading)
      return <ActivityIndicator color={Colors.white} />;

    if (createAdjustTipQuery.isSuccess) return "Propina Ajustada Exitosamente!";

    return "Ajustar Propina";
  };

  const onPressMakeAdjustTip = () => {
    if (!validateFields()) return;
    if (createAdjustTipQuery.isLoading || createAdjustTipQuery.isSuccess)
      return;

    if (Platform.OS == "web") {
      makeAdjustTip();
      return;
    }

    Alert.alert(
      "Adjust Tip",
      `Are you sure you want to Adjust Tip to $${inputValues.amount}?`,
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Yes, Adjust Tip!",
          onPress: () => {
            makeAdjustTip();
          },
        },
      ]
    );
  };

  const makeAdjustTip = async () => {
    if (!validateFields()) return;
    if (!paymentQuery.data) return;

    createAdjustTipQuery.mutate({
      payment: paymentQuery.data,
      amount: inputValues.amount.toString(),
    });
  };

  return (
    <MasterPasswordRequired>
      <TerminalConnectionChecker />
      <View style={{ backgroundColor: Colors.white }}>
        <Text center marginT-10 text40 marginB-30>
          Ajuste de Propina
        </Text>
        <View style={{ alignItems: "center" }}>
          <Text marginB-4>Ingrese nueva Propina</Text>

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
        </View>
      </View>

      <Button
        onPress={onPressMakeAdjustTip}
        disabled={!validateFields()}
        label={getButtonLabel()}
        fullWidth
        backgroundColor={
          createAdjustTipQuery.isSuccess ? Colors.green : Colors.primary
        }
        style={{ marginTop: 90, marginBottom: 20, width: "80%" }}
      />
    </MasterPasswordRequired>
  );
};

export default AdjustTipForm;

const styles = StyleSheet.create({});
