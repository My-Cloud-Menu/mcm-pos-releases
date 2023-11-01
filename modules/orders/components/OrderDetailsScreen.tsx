import { StyleSheet } from "react-native";
import React from "react";
import {
  Button,
  Chip,
  Colors,
  LoaderScreen,
  StateScreen,
  Text,
  View,
} from "react-native-ui-lib";
import LabelValue from "../../common/components/LabelValue";
import { Entypo } from "@expo/vector-icons";
import { Order } from "mcm-types/src/order";
import LineItemsList from "./LineItemsList";
import { getOrderById } from "../OrdersApi";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "../../common/UtilsHelper";
import { goToPaymentScreen } from "../../common/NavigationHelper";
import dayjs from "dayjs";
import { formatOrderPaymentStatus, formatOrderStatus } from "../OrderUtils";
import { getPayments, paymentsQueryKey } from "../../payment/PaymentApi";
import TransactionsList from "../../payment/components/TransactionList";
type props = {
  orderId: string;
};

const OrderDetailsScreen = ({ orderId }: props) => {
  const {
    data: order,
    isLoading: isOrderLoading,
    isSuccess: isOrderSuccess,
  } = useQuery<Order>({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderById(orderId),
  });

  const paymentsQuery = useQuery({
    queryKey: [paymentsQueryKey, orderId],
    queryFn: () => getPayments(orderId, true),
  });

  if (isOrderLoading && !order)
    return (
      <LoaderScreen
        message={"Loading Order for Payment"}
        color={Colors.grey40}
      />
    );

  if (!order)
    return (
      <StateScreen
        title={"Order Not Founded"}
        subtitle={"The order was not found or is no longer valid"}
      />
    );

  const onPressCompletePayment = () => goToPaymentScreen(order.id, order);

  return (
    <View flex>
      <View padding-10 flex>
        {/* <Text>OrderDetailsScreen</Text> */}
        <View row>
          <LabelValue label="Order ID" value={`#${order.id}`} />
          <LabelValue
            label="Hour"
            value={dayjs(order.date_created).format("hh:mm A - DD/MM/YYYY")}
          />
          <Chip
            label={formatOrderStatus[order.status]}
            backgroundColor="yellow"
            containerStyle={{ borderWidth: 0 }}
            marginR-10
            labelStyle={{ fontWeight: "bold" }}
          />
          {order.status != "check-closed" && (
            <Chip
              label={
                <View row centerV>
                  <Text white marginR-3>
                    Next Status
                  </Text>
                  <Entypo name="chevron-right" size={16} color="white" />
                </View>
              }
              backgroundColor="#000"
              containerStyle={{ borderWidth: 0, borderRadius: 8 }}
            />
          )}
        </View>
        <View row marginT-14 style={{ columnGap: 5 }}>
          <LabelValue label="Total" value={formatCurrency(order.total)} />
          <LabelValue label="Experience" value="Pickup" />
          <LabelValue
            label="Name"
            value={
              `${order.cart.customer.first_name} ${order.cart.customer.last_name}`.trim() ||
              "Sin Especificar"
            }
          />
          {/* <LabelValue
            
            label="Payment Status"
            value={formatOrderPaymentStatus[order.payment_status] || ""}
          /> */}
        </View>
        <Text marginT-20 text70>
          Items
        </Text>
        <View paddingR-30>
          <LineItemsList order={order} />
        </View>
        <Text marginT-20 text70 marginB-8>
          Payments
        </Text>
        <TransactionsList
          isLoading={paymentsQuery.isLoading}
          payments={paymentsQuery.data?.payments || []}
        />
      </View>
      <View marginB-10>
        <Button
          disabled={order.payment_status == "fulfilled"}
          marginV-4
          label="Complete Payment"
          useMinSize
          onPress={onPressCompletePayment}
        />
        <Button disabled marginV-4 label="Cancel Order" useMinSize />
      </View>
    </View>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({});
