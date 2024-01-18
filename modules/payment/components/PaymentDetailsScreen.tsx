import { StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import React, { useRef, useState } from "react";
import { Button, Chip, Colors, Text, View } from "react-native-ui-lib";
import { Stack } from "expo-router";
import { Payment } from "mcm-types";
import LabelValue from "../../common/components/LabelValue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  capitalizeFirstLetter,
  formatCurrency,
} from "../../common/UtilsHelper";
import { getMethodLabel, getStatusLabel } from "../PaymentHelper";
import {
  goToOrderDetailsScreen,
  goToReceiptScreen,
} from "../../common/NavigationHelper";
import CreateRefundForm from "../../refund/components/CreateRefundForm";
import AdjustTipForm from "./AdjustTipForm";
import TransferPaymentForm from "./TransferPaymentForm";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getRefundsByPaymentId, refundsQueryKey } from "../../refund/RefundApi";
import RefundList from "./RefundList";
import Decimal from "decimal.js";
import {
  getTipAdjustmentsByPaymentId,
  tipAdjustsQueryKey,
} from "../PaymentApi";
import TipAdjustsList from "./TipAdjustsList";
import { getOrderById, orderQueryKey } from "../../orders/OrdersApi";
import { getTipFromOrder } from "../../orders/OrderHelper";
dayjs.extend(utc);

const paymentOptions = [
  { label: "Recibo", value: "receipt" },
  { label: "Reembolso", value: "refund" },
  { label: "Ajuste de Tip", value: "adjust_tip" },
  { label: "Transferir a otro cheque", value: "transfer" },
];

interface props {
  payment: Payment;
}

const PaymentDetailsScreen = ({ payment }: props) => {
  const refundsQuery = useQuery({
    queryKey: [refundsQueryKey, payment.id],
    queryFn: () => getRefundsByPaymentId(payment.id),
  });

  const tipAdjustsQuery = useQuery({
    queryKey: [tipAdjustsQueryKey, payment.id],
    queryFn: () => getTipAdjustmentsByPaymentId(payment.id),
  });

  const ordersQuery = useQueries({
    queries: payment.orders_ids.map((orderId) => {
      return {
        queryKey: [orderQueryKey, orderId],
        queryFn: () => getOrderById(orderId),
      };
    }),
  });

  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );

  const scrollRef = useRef();

  const onPressOption = (option: string) => {
    if (selectedOption == option && !["receipt"].includes(option)) {
      setSelectedOption(undefined);
      return;
    }

    setSelectedOption(option);

    if (option == "receipt") {
      goToReceiptScreen(payment.id, payment, true);
    }
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: 0,
        x: 0,
      });
    }, 300);
  };

  const isOptionDisabled = (option: string) => {
    if (!["ecr-cash", "ecr-card", "ecr"].includes(payment.method)) {
      return true;
    }
    if (
      option == "refund" &&
      ["refunded", "pending"].includes(payment.status)
    ) {
      return true;
    }

    if (option == "adjust_tip") {
      let amountToAdjustIsValid = new Decimal(payment.total)
        .minus(payment.total_refunded)
        .greaterThanOrEqualTo(payment.tip);

      if (
        !(
          ["completed", "partially_refunded"].includes(payment.status) &&
          payment.method == "ecr-cash" &&
          amountToAdjustIsValid
        )
      ) {
        return true;
      }
    }

    if (option == "transfer" && payment.status != "completed") {
      return true;
    }

    return false;
  };

  const getTipToShow = () => {
    if (
      payment.orders_ids.length == 1 &&
      ordersQuery.length == 1 &&
      ordersQuery[0].isSuccess &&
      ordersQuery[0].data.cart?.channel == "online"
    ) {
      return getTipFromOrder(ordersQuery[0].data) || payment.tip;
    }

    return payment.tip;
  };

  return (
    <ScrollView ref={scrollRef} style={{ backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          title: `Detalles del Pago - #${payment.id}`,
          headerShown: true,
        }}
      />
      <View row paddingB-50>
        <View
          flex
          paddingT-10
          paddingL-30
          br40
          style={{ backgroundColor: "#fff" }}
        >
          <View flex marginT-20>
            {/* <Text text40 marginB-30>
              Detalles de Pago - #{payment.id}
            </Text> */}

            <View row style={{ columnGap: 90 }}>
              <View style={{ rowGap: 15 }}>
                <LabelValue
                  label="Cheques Pagados"
                  value={
                    <View marginV-4 row style={{ flexWrap: "wrap", gap: 5 }}>
                      {(payment?.orders_ids || []).map((orderId) => (
                        <Chip
                          onPress={() => goToOrderDetailsScreen(orderId)}
                          backgroundColor={Colors.primary}
                          labelStyle={{ color: "#fff", fontWeight: "bold" }}
                          label={`${orderId}`}
                        />
                      ))}
                    </View>
                  }
                  vertical
                />
                <LabelValue
                  label="Status"
                  value={getStatusLabel(capitalizeFirstLetter(payment.status))}
                  vertical
                />

                <LabelValue
                  label="Tip"
                  value={formatCurrency(getTipToShow() || 0)}
                  vertical
                />
                <LabelValue
                  label="Total Refunded"
                  value={formatCurrency(payment.total_refunded)}
                  vertical
                />
                <LabelValue
                  label="Total"
                  value={formatCurrency(payment.total)}
                  vertical
                />
              </View>
              <View style={{ rowGap: 15 }}>
                <LabelValue
                  label="Fecha de Creacion"
                  value={dayjs(payment.date_created)
                    .utcOffset(-240)
                    .format("h:mm A - DD/MM/YYYY")}
                  vertical
                />
                <LabelValue
                  label="Ultima Actualizacion"
                  value={dayjs(payment.date_updated)
                    .utcOffset(-240)
                    .format("h:mm A - DD/MM/YYYY")}
                  vertical
                />
                <LabelValue
                  label="Metodo de Pago"
                  value={`${getMethodLabel(payment.method)} - ${
                    payment.source
                  }`}
                  vertical
                />

                <LabelValue label="Invoice" value={payment.invoice} vertical />
                <LabelValue
                  label="Referencia"
                  value={payment.reference}
                  vertical
                />
              </View>
            </View>

            {refundsQuery.isSuccess && refundsQuery?.data?.length > 0 && (
              <View>
                <Text marginT-20 text70 marginB-8>
                  Reembolsos ({refundsQuery.data.length})
                </Text>
                <RefundList refunds={refundsQuery.data} />
              </View>
            )}

            {tipAdjustsQuery.isSuccess && tipAdjustsQuery?.data?.length > 0 && (
              <View>
                <Text marginT-20 text70 marginB-8>
                  Ajuste de Propina ({tipAdjustsQuery.data.length})
                </Text>
                <TipAdjustsList tip_adjusts={tipAdjustsQuery.data} />
              </View>
            )}

            <View
              flex
              paddingH-10
              marginT-50
              style={{ rowGap: 20, maxWidth: 800 }}
            >
              {paymentOptions.map((option) => {
                const isOptionActive = selectedOption == option.value;
                const optionIsDisabled = isOptionDisabled(option.value);

                let textColor = isOptionActive
                  ? Colors.primary
                  : Colors.primary;

                if (optionIsDisabled) {
                  textColor = Colors.gray;
                }
                return (
                  <Button
                    disabled={optionIsDisabled}
                    fullWidth
                    onPress={() => onPressOption(option.value)}
                    variant="iconButtonWithLabelCenterOutline"
                    active={isOptionActive}
                    style={{ width: "100%" }}
                  >
                    <Text center color={textColor} text60L>
                      {option.label}
                    </Text>
                  </Button>
                );
              })}
            </View>

            {/* <ReceiptQrCode paymentId={payment.id} /> */}
          </View>
        </View>
        <View centerH flex>
          {selectedOption == "refund" && (
            <CreateRefundForm paymentId={payment.id} />
          )}

          {selectedOption == "adjust_tip" && (
            <AdjustTipForm paymentId={payment.id} />
          )}

          {selectedOption == "transfer" && (
            <TransferPaymentForm paymentId={payment.id} />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default PaymentDetailsScreen;

const styles = StyleSheet.create({});
