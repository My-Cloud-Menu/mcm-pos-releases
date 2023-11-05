import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { Chip, Colors, Text, View } from "react-native-ui-lib";
import { MaterialIcons } from "@expo/vector-icons";
import { shadowProps } from "../../common/theme/shadows";
import {
  getOrderNextStatus,
  getOrderStatusColor,
  getOrderStatusLabel,
} from "../OrderHelper";
import { Order } from "mcm-types";

const getTitleLabel = (order: Order) => {
  return order.id.slice(order.id.length - 2, order.id.length);
};

const getOrderNameLabel = (order: Order) => {
  return (
    `${order.cart.customer.first_name} ${order.cart.customer.last_name}`.trim() ||
    order.id
  );
};

type Props = {
  order: Order;
  isActive?: boolean;
  onPress?: (order: Order) => void;
};

const OrderCardItem = ({
  order,
  isActive = false,
  onPress = undefined,
}: Props) => {
  return (
    <Pressable
      onPress={() => onPress && onPress(order)}
      style={{
        backgroundColor: isActive ? "#E0E0E0" : Colors.white,
        paddingRight: 12,
        paddingLeft: 6,
        paddingVertical: 10,
        borderRadius: 8,
        ...shadowProps,
      }}
    >
      <View row centerV>
        <View
          style={{
            width: 55,
            height: 55,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isActive ? Colors.white : "#E0E0E0",
          }}
        >
          <Text text60L>{getTitleLabel(order)}</Text>
        </View>

        <View marginL-15>
          <View row spread>
            <Text text70>{getOrderNameLabel(order)}</Text>
            <Chip
              containerStyle={{ borderWidth: 0 }}
              backgroundColor={getOrderStatusColor(order.status)}
              label={getOrderStatusLabel(order.status)}
              marginL-15
              padding-0
              labelStyle={{ color: "#fff" }}
            />
          </View>
          <View row centerV marginT-6>
            <Text text85>
              {order.cart.line_items.reduce(
                (acc, cal) => acc + cal.quantity,
                0
              )}{" "}
              items
            </Text>
            {order.status != "check-closed" && (
              <MaterialIcons
                name="arrow-right-alt"
                size={22}
                color="black"
                style={{ marginHorizontal: 3 }}
              />
            )}
            <Text text85>{getOrderStatusLabel(getOrderNextStatus(order))}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default OrderCardItem;

const styles = StyleSheet.create({});
