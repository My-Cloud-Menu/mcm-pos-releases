import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Cart } from "mcm-types";
import { Button, Colors, Text, TextField, View } from "react-native-ui-lib";
import useOrderStore from "../../orders/OrdersStore";
import { TouchableOpacity } from "react-native-gesture-handler";

const getFeedbackColor = (feedback: string) => {
  if (feedback.toLowerCase() == "el cupon se ha aplicado exitosamente")
    return Colors.green;

  return Colors.red;
};

type props = {
  onPressApply?: () => void;
  cartSummary: Cart & {
    coupon_feedback: any;
  };
};

const CouponCodeInput = (props: props) => {
  const [isCouponCollapsed, setCouponCollapsed] = useState(false);
  const toggleCoupon = () => {
    setCouponCollapsed(!isCouponCollapsed);
  };
  const orderStore = useOrderStore();

  return (
    <View marginB-10>
      <View
        row
        spread
        style={{
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        <TouchableOpacity onPress={toggleCoupon}>
          <Text
            style={{ fontWeight: "600", marginBottom: 10 }}
            color={Colors.primary}
          >
            Coupon
          </Text>
        </TouchableOpacity>
        {!isCouponCollapsed && (
          <TextField
            style={{ width: "100%" }}
            placeholder="Enter coupon code"
            color={Colors.primary}
            labelColor={"#000"}
            labelStyle={{ fontWeight: "600" }}
            placeholderTextColor={Colors.gray}
            value={orderStore.inputValues.coupon_code}
            onChangeText={(value) => {
              orderStore.changeInputValue(
                "coupon_code",
                value.toUpperCase().replace(/ /g, "")
              );
            }}
          />
        )}
        {orderStore.inputValues.coupon_code && (
          <Button
            size="small"
            label="Apply"
            onPress={() => props.onPressApply && props.onPressApply()}
          />
        )}
      </View>
      {props.cartSummary?.coupon_feedback?.feedback && (
        <Text
          marginT-5
          style={{
            color: getFeedbackColor(
              props.cartSummary?.coupon_feedback?.feedback
            ),
          }}
        >
          {props.cartSummary?.coupon_feedback?.feedback}
        </Text>
      )}
    </View>
  );
};

export default CouponCodeInput;

const styles = StyleSheet.create({});
