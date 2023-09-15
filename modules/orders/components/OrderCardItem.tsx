import { StyleSheet } from "react-native";
import React from "react";
import { Chip, Colors, Text, View } from "react-native-ui-lib";
import { MaterialIcons } from "@expo/vector-icons";
import { Order, ProductCart } from "../../../types";

const getTitleLabel = (order: Order) => {
  return order.id.slice(order.id.length - 2, order.id.length);
};

const getOrderNameLabel = (order: Order) => {
  return (
    `${order.cart.customer.first_name} ${order.cart.customer.last_name}`.trim() ||
    order.id
  );
};

const orderStatusLabel: any = {
  "new-order": "New Order",
  "in-kitchen": "In Kitchen",
  "ready-for-pickup": "Ready For Pickup",
  "delivery-in-progress": "Delivery In Progress",
  "check-closed": "Closed",
  cancelled: "Cancelled",
};

type Props = {
  order: any;
};

const OrderCardItem = ({ order }: Props) => {
  return (
    <View style={styles.container}>
      <View row centerV>
        <View style={styles.titleContainer}>
          <Text text60L>{getTitleLabel(order)}</Text>
        </View>

        <View marginL-15>
          <View row spread>
            <Text text70>{getOrderNameLabel(order)}</Text>
            <Chip
              containerStyle={{ borderWidth: 0 }}
              backgroundColor={Colors.secondary}
              label={orderStatusLabel[order.status]}
              marginL-15
              padding-0
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
            <MaterialIcons
              name="arrow-right-alt"
              size={22}
              color="black"
              style={{ marginHorizontal: 3 }}
            />
            <Text text85>{orderStatusLabel[order.status] || "New Order"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default OrderCardItem;

const styles = StyleSheet.create({
  container: {},
  titleContainer: {
    width: 55,
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
  },
});
