import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { Button, Chip, Colors, Drawer, Text, View } from "react-native-ui-lib";
import { Payment } from "mcm-types";
import { goToPaymentDetailsScreen } from "../../common/NavigationHelper";
import { shadowPropsSoft } from "../../common/theme/shadows";
import dayjs from "dayjs";
import { getColorForStatusLabel, getStatusLabel } from "../PaymentHelper";
import { capitalizeFirstLetter } from "../../common/UtilsHelper";

type props = {
  payments: Payment[];
  isLoading?: boolean;
  tip?: string;
};

const TransactionsList = (props: props) => {
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const onSeeDetails = (payment: Payment) => {
    goToPaymentDetailsScreen(payment.id, payment);
  };

  if (props.isLoading) {
    return (
      <View center marginV-10 marginL-3>
        <ActivityIndicator color={Colors.primary} />
        <Text marginT-10>Loading Payments</Text>
      </View>
    );
  }

  if (props.payments.length == 0) {
    return (
      <Text $textNeutralLight text80 marginV-5 center>
        No Payments
      </Text>
    );
  }

  return (
    <ScrollView>
      <View style={{ rowGap: 10 }}>
        {props.payments
          .sort((x, y) => (x?.date_created > y?.date_created ? -1 : 1))
          .slice(0, itemsPerPage)
          .map((payment, idx) => {
            const tipToShow = Boolean(props.tip) ? props.tip : payment.tip;

            return (
              <Drawer
                key={`payment-${idx}`}
                rightItems={[
                  {
                    text: "Ver Detalles",
                    background: Colors.green,
                    onPress: () => onSeeDetails(payment),
                  },
                  {
                    text: "Refund",
                    background: Colors.green,
                    onPress: () => onSeeDetails(payment),
                  },
                  {
                    text: "Reprint",
                    background: Colors.green,
                    onPress: () => onSeeDetails(payment),
                  },
                ]}
              >
                <Pressable onPress={() => onSeeDetails(payment)}>
                  <View
                    spread
                    row
                    centerV
                    paddingH-15
                    paddingV-9
                    br40
                    style={{
                      backgroundColor: "#EEEEEE",
                      ...shadowPropsSoft,
                    }}
                  >
                    <View row centerV>
                      <View>
                        <Text text100L>Ref</Text>
                        <Text text60L>{payment.reference}</Text>
                      </View>
                      <View marginL-20>
                        <Text text90L>Invoice: {payment.invoice}</Text>
                        <Text text90L>
                          Checks: {payment.orders_ids.join(", ")}
                        </Text>
                        <Text text90L>
                          Date:{" "}
                          {dayjs(payment.date_created)
                            .utcOffset(-240)
                            .format("DD/MM/YYYY")}
                        </Text>
                        <Text text90L>
                          Time:{" "}
                          {dayjs(payment.date_created)
                            .utcOffset(-240)
                            .format("h:mm a")}
                        </Text>
                        <Text text90L>Tip: ${tipToShow}</Text>
                      </View>
                    </View>
                    <View>
                      <Chip
                        labelStyle={{ color: "white" }}
                        containerStyle={{
                          maxWidth: 200,
                          backgroundColor: getColorForStatusLabel(
                            payment.status
                          ),
                          borderColor: "white",
                        }}
                        label={capitalizeFirstLetter(
                          getStatusLabel(payment.status)
                        )}
                      />
                    </View>
                    <View row>
                      <View>
                        <Text text100L>Total</Text>
                        <Text text60L>{payment.total}</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </Drawer>
            );
          })}
      </View>
      {props.payments.length > itemsPerPage && (
        <Button
          style={{ borderRadius: 15, marginVertical: 10, marginHorizontal: 5 }}
          onPress={() => setItemsPerPage(itemsPerPage + 8)}
          fullWidth
          label={`Mostrar más (${itemsPerPage} de ${props.payments.length})`}
        />
      )}
    </ScrollView>
  );
};

export default TransactionsList;

const styles = StyleSheet.create({});
