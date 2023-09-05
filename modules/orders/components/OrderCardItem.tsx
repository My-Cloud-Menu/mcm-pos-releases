import { StyleSheet } from "react-native";
import React from "react";
import { Chip, Colors, Text, View } from "react-native-ui-lib";
import { MaterialIcons } from "@expo/vector-icons";
import { ProductCart } from "../../../types";

type Props = {
  order: any
}

const OrderCardItem = ({ order }: Props) => {
  return (
    <View style={styles.container}>
      <View row centerV>
        <View style={styles.titleContainer}>
          <Text text60L>T4</Text>
        </View>

        <View marginL-15>
          <View row spread>
            <Text text70>{order.name}</Text>
            <Chip
              containerStyle={{ borderWidth: 0 }}
              backgroundColor={Colors.secondary}
              label="In Process"
              marginL-15
              padding-0
            />
          </View>
          <View row centerV marginT-6>
            <Text text85>6 items</Text>
            <MaterialIcons
              name="arrow-right-alt"
              size={22}
              color="black"
              style={{ marginHorizontal: 3 }}
            />
            <Text text85>Kitchen</Text>
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
