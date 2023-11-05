import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { Button, Chip, Colors, Drawer, Text, View } from "react-native-ui-lib";
import { Payment, Refund } from "mcm-types";
import { shadowPropsSoft } from "../../common/theme/shadows";
import dayjs from "dayjs";
import { getColorForStatusLabel, getStatusLabel } from "../PaymentHelper";
import { capitalizeFirstLetter } from "../../common/UtilsHelper";

type props = {
  refunds: Refund[];
  isLoading?: boolean;
};

const RefundList = (props: props) => {
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const onSeeDetails = (payment: Payment) => {
    // goToPaymentDetailsScreen(payment.id, payment);
  };

  if (props.isLoading) {
    return (
      <View center marginV-10 marginL-3>
        <ActivityIndicator color={Colors.primary} />
        <Text marginT-10>Loading Refunds</Text>
      </View>
    );
  }

  if (props.refunds.length == 0) {
    return (
      <Text $textNeutralLight text80 marginV-5 center>
        No Refunds
      </Text>
    );
  }

  return (
    <ScrollView>
      <View style={{ rowGap: 10 }}>
        {props.refunds
          .sort((x, y) => (x?.date_created > y?.date_created ? -1 : 1))
          .slice(0, itemsPerPage)
          .map((item, idx) => (
            <Drawer key={`item-${idx}`}>
              <Pressable>
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
                      <Text text60L>{item.reference}</Text>
                    </View>
                    <View marginL-20>
                      <Text text90L>Invoice: {item.invoice}</Text>
                      <Text text90L>Reason: {item.reason}</Text>

                      <Text text90L>
                        Date:{" "}
                        {dayjs(item.date_created)
                          .utcOffset(-240)
                          .format("DD/MM/YYYY")}
                      </Text>
                      <Text text90L>
                        Time:{" "}
                        {dayjs(item.date_created)
                          .utcOffset(-240)
                          .format("h:mm a")}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Chip
                      labelStyle={{ color: "white" }}
                      containerStyle={{
                        maxWidth: 200,
                        backgroundColor: getColorForStatusLabel(item.status),
                        borderColor: "white",
                      }}
                      label={capitalizeFirstLetter(getStatusLabel(item.status))}
                    />
                  </View>
                  <View row>
                    <View>
                      <Text text100L>Reembolsado</Text>
                      <Text text60L>$ {item.amount}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </Drawer>
          ))}
      </View>
      {props.refunds.length > itemsPerPage && (
        <Button
          style={{ borderRadius: 15, marginVertical: 10, marginHorizontal: 5 }}
          onPress={() => setItemsPerPage(itemsPerPage + 8)}
          fullWidth
          label={`Mostrar más (${itemsPerPage} de ${props.refunds.length})`}
        />
      )}
    </ScrollView>
  );
};

export default RefundList;

const styles = StyleSheet.create({});
