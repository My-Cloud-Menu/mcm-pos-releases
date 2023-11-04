import { ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
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
import { Entypo, Feather } from "@expo/vector-icons";
import LineItemsList from "./LineItemsList";
import {
  decreaseLineItem,
  getOrderById,
  increaseLineItem,
  orderQueryKey,
} from "../OrdersApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatCurrency } from "../../common/UtilsHelper";
import { goToPaymentScreen } from "../../common/NavigationHelper";
import dayjs from "dayjs";
import { formatOrderStatus } from "../OrderUtils";
import { getPayments, paymentsQueryKey } from "../../payment/PaymentApi";
import TransactionsList from "../../payment/components/TransactionList";
import { handlePetitionError, showAlert } from "../../common/AlertHelper";
import { queryClient } from "../../../app/_layout";

type props = {
  orderId: string;
};

const OrderDetailsScreen = ({ orderId }: props) => {
  const { data: order, isLoading: isOrderLoading } = useQuery({
    queryKey: [orderQueryKey, orderId],
    queryFn: () => getOrderById(orderId),
  });

  const paymentsQuery = useQuery({
    queryKey: [paymentsQueryKey, orderId],
    queryFn: () => getPayments(orderId, true),
  });

  const editLineItemQuery = useMutation({
    onError: (error) => handlePetitionError(error),
    onSuccess: () => {
      showAlert({ title: "Orden actualizada exitosamente!", type: "success" });
      queryClient.invalidateQueries({ queryKey: [orderQueryKey, orderId] });
      setIsEditMode(false);
    },
    mutationFn: async () => {
      let itemIncreaseChanges = [];
      let itemDecreaseChanges = [];

      let availableToRemove = order.cart.line_items.reduce(
        (acc, cal) => acc + cal.quantity - (cal.paid || 0),
        0
      );

      for (const idx in lineItemsChanges) {
        const lineItemInCart = order.cart.line_items[idx];

        let quantity = lineItemsChanges[idx].quantity - lineItemInCart.quantity;

        if (quantity > 0) {
          itemIncreaseChanges.push({
            id: lineItemsChanges[idx].id,
            quantity: Math.abs(quantity),
          });
        } else if (quantity < 0) {
          itemDecreaseChanges.push({
            id: lineItemsChanges[idx].id,
            quantity: Math.abs(quantity),
          });
        }
        availableToRemove += quantity;
      }

      if (availableToRemove == 0) {
        throw "items cannot be deleted because the Check must have at least 1 item active";
      }

      if (itemDecreaseChanges.length > 0) {
        await decreaseLineItem(order.id, itemDecreaseChanges);
      }

      if (itemIncreaseChanges.length > 0) {
        await increaseLineItem(order.id, itemIncreaseChanges);
      }
    },
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [lineItemsChanges, setLineItemsChanges] = useState<any>({});

  const onPressCompletePayment = () => goToPaymentScreen(order.id, order);

  const onEditLineItem = (idx: number, quantity: number) => {
    const currentOrder = order;

    let newLineItemsChanges = JSON.parse(JSON.stringify(lineItemsChanges));

    newLineItemsChanges[idx] = {
      id: currentOrder.cart.line_items[idx].id,
      quantity: quantity,
    };

    setLineItemsChanges(newLineItemsChanges);
  };

  useEffect(() => {
    setLineItemsChanges({});
  }, [isEditMode, orderId]);

  useEffect(() => {
    setIsEditMode(false);
  }, [orderId]);

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

  return (
    <View flex>
      <View padding-10 flex>
        {isEditMode && (
          <View
            row
            center
            style={{
              backgroundColor: "#ffc745",
              borderRadius: 6,
              paddingVertical: 5,
              marginBottom: 5,
            }}
          >
            <Text text75 black>
              EDIT MODE
            </Text>
          </View>
        )}
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
          {order.status != "check-closed" &&
            order.payment_status == "not_fulfilled" && (
              <Feather
                onPress={() => setIsEditMode(!isEditMode)}
                style={{ marginLeft: "auto" }}
                name="edit"
                size={25}
                color={isEditMode ? Colors.yellow : Colors.black}
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
          <LineItemsList
            onEditLineItem={onEditLineItem}
            lineItemsChanges={lineItemsChanges}
            isEditMode={isEditMode}
            order={order}
          />
        </View>
        {!isEditMode && (
          <>
            <Text marginT-20 text70 marginB-8>
              Payments
            </Text>
            <TransactionsList
              isLoading={paymentsQuery.isLoading}
              payments={paymentsQuery.data?.payments || []}
            />
          </>
        )}
      </View>
      <View marginB-10>
        {!isEditMode && (
          <Button
            disabled={order.payment_status == "fulfilled"}
            marginV-4
            label="Complete Payment"
            useMinSize
            onPress={onPressCompletePayment}
          />
        )}
        {!isEditMode && (
          <Button disabled marginV-4 label="Cancel Order" useMinSize />
        )}

        {isEditMode && (
          <Button
            disabled={editLineItemQuery.isLoading}
            onPress={() => editLineItemQuery.mutate()}
            label={
              editLineItemQuery.isLoading ? (
                <ActivityIndicator color={"white"} />
              ) : (
                "Save Changes"
              )
            }
            marginV-4
          />
        )}
      </View>
    </View>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({});
