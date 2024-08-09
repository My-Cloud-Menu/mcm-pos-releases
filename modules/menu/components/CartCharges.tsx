import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";
import { formatCurrency } from "../../common/UtilsHelper";
import { Cart } from "mcm-types";
import Decimal from "decimal.js";

type props = {
  cartSummary: Cart;
  isLoading: boolean;
};

const CartCharges = ({ cartSummary, isLoading }: props) => {
  if (isLoading || !Boolean(cartSummary)) return <ActivityIndicator />;

  return (
    <View paddingT-10 flex style={{ rowGap: 4 }}>
      <View row spread>
        <Text text80>Subtotal</Text>
        <Text text80>
          <Text text100L>$ </Text>
          {cartSummary.subtotal}
        </Text>
      </View>

      <View row spread>
        <Text text80 $textNeutral>
          Taxes
        </Text>
        <Text text80>
          <Text text100L>$ </Text>
          {cartSummary.total_tax}
        </Text>
      </View>

      {/* {cartSummary.tax_lines.map((taxLine) => (
        <View row spread>
          <Text text80 $textNeutral>
            {taxLine.label} ({taxLine.rate}%)
          </Text>
          <Text text80>
            <Text text100L>$ </Text>
            {taxLine.tax_total}
          </Text>
        </View>
      ))} */}

      {Number(cartSummary?.fee_total) > 0 && (
        <View row spread>
          <Text text80 $textNeutral>
            Fees
          </Text>
          <Text text80>
            <Text text100L>$ </Text>
            {cartSummary.fee_total}
          </Text>
        </View>
      )}
      {/* {cartSummary.fee_lines
        .filter((fee_line) => new Decimal(fee_line.total).greaterThan("0.00"))
        .map((fee_lines) => (
          <View row spread>
            <Text text80 $textNeutral>
              {fee_lines.name}
            </Text>
            <Text text80>
              <Text text100L>$ </Text>
              {fee_lines.total}
            </Text>
          </View>
        ))} */}

      {cartSummary.coupon_lines.map((coupon: any) => (
        <View row spread>
          <Text text80 green10>
            COUPON: {coupon.code}
          </Text>
          <Text text80 green10>
            <Text text80 green10>
              ${" "}
            </Text>
            {coupon.total}
          </Text>
        </View>
      ))}

      <View
        style={{
          marginTop: 3,
          borderTopWidth: 1,
          borderTopColor: Colors.gray,
          borderStyle: "dashed",
        }}
      />
      <View row spread centerV marginT-3>
        <Text text60>Total</Text>
        <Text text60>
          <Text text100L style={{}}>
            ${" "}
          </Text>
          {cartSummary.total}
        </Text>
      </View>
    </View>
  );
};

export default CartCharges;

const styles = StyleSheet.create({});
