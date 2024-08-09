import React from "react";
import { StyleSheet } from "react-native";
import fonts from "../../common/theme/fonts";
import { formatCurrency } from "../../common/UtilsHelper";
import { Text, View } from "react-native-ui-lib";
import { Order } from "mcm-types";
import usePaymentStore from "../PaymentStore";

const getFeeLabel = (feeName: string) => {
  if (feeName == "Digital Fee") return "Fees";

  return feeName;
};

interface props {
  order: Order;
}

const OrderChargesCard = ({ order }: props) => {
  const { tip } = usePaymentStore((state) => state.inputValues);

  return (
    <View style={[styles.container]}>
      <View style={styles.charge}>
        <Text text65L>Subtotal</Text>
        <Text text65L>{formatCurrency(order.cart.subtotal)}</Text>
      </View>
      <View style={styles.charge}>
        <Text text65L>Taxes</Text>
        <Text text65L>{formatCurrency(order.cart.total_tax)}</Text>
      </View>
      {order.cart.fee_lines
        .filter((fee) => fee.total != "0.00")
        .map((fee) => (
          <View key={`${fee.name}`} style={styles.charge}>
            <Text text65L>{getFeeLabel(fee.name)}</Text>
            <Text text65L>{formatCurrency(fee.total)}</Text>
          </View>
        ))}
      <View style={styles.charge}>
        <Text text65L>Tips</Text>
        <Text text65L>{formatCurrency(tip || 0)}</Text>
      </View>
      <View style={styles.charge}>
        <Text text65L>Descuentos</Text>
        <Text text65L> {formatCurrency(order.cart.discount_total)}</Text>
      </View>
      <View style={styles.charge}>
        <Text text65L>Pagado</Text>
        <Text text65L> {formatCurrency(order.paid)}</Text>
      </View>

      <View style={styles.charge}>
        <Text text60>Total</Text>
        <Text text60>{formatCurrency(order.total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  titles: { fontSize: fonts.size.lg, fontWeight: fonts.weight.semi },
  charge: {
    width: 280,
    marginVertical: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chargeTitle: {
    fontSize: fonts.size.sm,
  },
  chargeAmount: { fontSize: fonts.size.sm },
  total: { fontWeight: fonts.weight.bold, fontSize: fonts.size.md },
});

export default OrderChargesCard;
