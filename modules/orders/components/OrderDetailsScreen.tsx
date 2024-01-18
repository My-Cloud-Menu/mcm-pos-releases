import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
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
import { Feather } from "@expo/vector-icons";
import LineItemsList from "./LineItemsList";
import {
  decreaseLineItem,
  getOrderById,
  increaseLineItem,
  orderQueryKey,
  ordersQueryKey,
  updateOrder,
} from "../OrdersApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatCurrency } from "../../common/UtilsHelper";
import {
  goToDeleteOrderScreen,
  goToPaymentScreen,
} from "../../common/NavigationHelper";
import dayjs from "dayjs";
import { getPayments, paymentsQueryKey } from "../../payment/PaymentApi";
import TransactionsList from "../../payment/components/TransactionList";
import { handlePetitionError, showAlert } from "../../common/AlertHelper";
import { queryClient } from "../../../app/_layout";
import {
  getOrderExperienceLabel,
  getOrderSourceBadge,
  getOrderStatusColor,
  getOrderStatusLabel,
  getTipFromOrder,
  isOrderMadeFromWebapp,
} from "../OrderHelper";

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

      queryClient.invalidateQueries({
        queryKey: [ordersQueryKey],
      });

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
        throw {
          message:
            "items cannot be deleted because the Check must have at least 1 item active",
        };
      }

      if (itemDecreaseChanges.length > 0) {
        await decreaseLineItem(order.id, itemDecreaseChanges);
      }

      if (itemIncreaseChanges.length > 0) {
        await increaseLineItem(order.id, itemIncreaseChanges);
      }
    },
  });

  const moveToCompletedQuery = useMutation({
    mutationFn: async () => {
      return await updateOrder(orderId, { status: "check-closed" });
    },
    onSuccess: () => {
      showAlert({
        title: "Order moved to completed successfully!",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: [orderQueryKey, orderId] });

      queryClient.invalidateQueries({
        queryKey: [ordersQueryKey],
      });
    },
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [lineItemsChanges, setLineItemsChanges] = useState<any>({});

  const onPressCompletePayment = () => goToPaymentScreen(order.id, order);
  const onPressDeleteOrder = () => goToDeleteOrderScreen(order.id);

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
    <ScrollView>
      <View flex>
        <View padding-10 row centerV>
          <View row>
            <Chip
              label={getOrderStatusLabel(order)}
              backgroundColor={getOrderStatusColor(order)}
              containerStyle={{ borderWidth: 0 }}
              marginR-10
              labelStyle={{ fontWeight: "bold", color: "#fff" }}
            />
            {getOrderSourceBadge(order)}
          </View>
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
          <View row centerV marginB-5>
            <LabelValue label="Order ID" value={`#${order.id}`} />
            <LabelValue
              label="Hour"
              value={dayjs(order.date_created).format("hh:mm A - DD/MM/YYYY")}
            />
          </View>
          <View row>
            <LabelValue label="Total" value={formatCurrency(order.total)} />
            <LabelValue
              label="Experience"
              value={getOrderExperienceLabel(order)}
            />

            {/* {order.status != "check-closed" && (
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
          )} */}
          </View>
          <View row marginT-14 style={{ gap: 7, flexWrap: "wrap" }}>
            <LabelValue
              label="Name"
              value={
                `${order.cart.customer.first_name} ${order.cart.customer.last_name}`.trim() ||
                "Sin Especificar"
              }
            />
            {Boolean(order.cart.customer.phone) && (
              <LabelValue label="Phone" value={order.cart.customer.phone} />
            )}

            {Boolean(order.cart.customer.email) && (
              <LabelValue label="Email" value={order.cart.customer.email} />
            )}

            {/* <LabelValue
            
            label="Payment Status"
            value={formatOrderPaymentStatus[order.payment_status] || ""}
          /> */}
          </View>

          {Boolean(order.cart.customer_notes) && (
            <View marginT-20>
              <Text text70 style={{ fontWeight: "bold" }}>
                Customer Notes:
              </Text>
              <Text text70>{order.cart.customer_notes}</Text>
            </View>
          )}

          <Text marginT-20 text70>
            Items (
            {order.cart.line_items.reduce((acc, cal) => acc + cal.quantity, 0)})
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
                Payments ({(paymentsQuery?.data?.payments || []).length})
              </Text>
              <TransactionsList
                tip={getTipFromOrder(order)}
                isLoading={paymentsQuery.isLoading}
                payments={paymentsQuery.data?.payments || []}
              />
            </>
          )}
        </View>
        <View marginB-10>
          {!isEditMode &&
            order.status == "in-kitchen" &&
            isOrderMadeFromWebapp(order) && (
              <Button
                marginV-4
                label={
                  moveToCompletedQuery.isLoading ? (
                    <ActivityIndicator color={"white"} />
                  ) : (
                    "Move to Completed"
                  )
                }
                useMinSize
                style={{ backgroundColor: Colors.green10 }}
                onPress={() => moveToCompletedQuery.mutate()}
              />
            )}
          {!isEditMode && order.payment_status != "fulfilled" && (
            <Button
              marginV-4
              label="Complete Payment"
              useMinSize
              onPress={onPressCompletePayment}
            />
          )}

          {!isEditMode && (
            <Button
              marginV-10
              label="Delete Order"
              useMinSize
              style={{ backgroundColor: "#D84315" }}
              onPress={onPressDeleteOrder}
            />
          )}
          {/* {!isEditMode && (
          <Button disabled marginV-4 label="Cancel Order" useMinSize />
        )} */}

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
    </ScrollView>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({});
