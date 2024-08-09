import { StyleSheet } from "react-native";
import React from "react";
import { Cart } from "mcm-types";
import { Button, Colors, Text, TextField, View } from "react-native-ui-lib";
import useOrderStore from "../../orders/OrdersStore";

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
        <View row style={{ alignItems: "center" }}>
          <TextField
            leadingAccessory={<Text text100>Code</Text>}
            style={{ marginLeft: 6, width: 140 }}
            placeholder="Enter Coupon Code"
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
          {orderStore.inputValues.coupon_code && (
            <Button
              size="xSmall"
              label="Apply"
              onPress={() => props.onPressApply && props.onPressApply()}
            />
          )}
        </View>
      </View>
      {props.cartSummary?.coupon_feedback?.feedback && (
        <Text
          marginT-5
          style={{
            marginLeft: 6,
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
