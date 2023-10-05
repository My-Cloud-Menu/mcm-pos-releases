import React, { useState } from "react";
import { Pressable, StyleSheet, Image } from "react-native";

import { Order } from "mcm-types/src/order";
import { Colors, Text, View } from "react-native-ui-lib";
import { decodeName } from "../../common/UtilsHelper";
import fonts from "../../common/theme/fonts";

interface props {
  order: Order;
}

const LineItemsList = ({
  order,
  color = "#fff",
  showHeaders = false,
  showPaidLabel = false,
  isEditMode = false,
  lineItemsChanges = {},
  onEditLineItem = null,
}: props) => {
  const [expandAtrributes, setExpandAttributes] = useState([]);

  const products = order.cart.line_items;
  return (
    <View>
      <View style={[styles.container, { backgroundColor: color }]}>
        {showHeaders && (
          <View style={styles.item}>
            <Text>PRODUCTO</Text>
            <Text>TOTAL</Text>
          </View>
        )}

        {products.map((item, idx) => {
          let productChangeQuantityPreview = lineItemsChanges[idx]?.quantity;

          return (
            <View key={`${item.id}-${idx}`} style={styles.item}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  //   resizeMode={FastImage.resizeMode.contain}
                  resizeMode="contain"
                  style={styles.image}
                  source={
                    item?.thumbnail
                      ? { uri: item.thumbnail }
                      : require("../../../assets/images/image-notfound.png")
                  }
                />
                <View>
                  <Text>
                    {decodeName(item.name)}{" "}
                    {!isEditMode && `x ${item.quantity}`}
                  </Text>

                  {showPaidLabel && item?.paid != 0 && (
                    <Text
                      style={{
                        color: Colors.green,
                        fontSize: fonts.size.sm - 1,
                      }}
                    >
                      {item.paid} Paid
                    </Text>
                  )}

                  <Pressable
                    onPress={() => {
                      let newValues = expandAtrributes.includes(idx)
                        ? expandAtrributes.filter((att) => att != idx)
                        : [...expandAtrributes, idx];
                      setExpandAttributes(newValues);
                    }}
                  >
                    {item.attributes.map((attrib) => (
                      <Text key={attrib.Name} style={styles.attribute}>
                        <Text style={{ fontWeight: fonts.weight.bold }}>
                          {attrib.label}{" "}
                        </Text>
                        {attrib.value}
                      </Text>
                    ))}
                    {/* {item.Options.length > 3 && !expandAtrributes.includes(idx) && (
                  <Text style={styles.expandIcons}> ...</Text>
                )} */}
                  </Pressable>
                </View>
              </View>
              {!isEditMode && <Text>${Number(item.total).toFixed(2)}</Text>}
              {/* TODO: INTEGRAR COUNTER */}
              {/* {isEditMode && (
                <CounterV2
                  min={item.paid || 0}
                  quantity={
                    productChangeQuantityPreview == null
                      ? item.quantity
                      : productChangeQuantityPreview
                  }
                  onChange={(value) => {
                    onEditLineItem(idx, value);
                  }}
                />
              )} */}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  titles: { fontSize: fonts.size.md, fontWeight: fonts.weight.semi },
  item: {
    width: "100%",
    marginTop: 2,
    paddingBottom: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderStyle: "solid",
    borderBottomColor: Colors.graySoft,
  },
  itemTitle: {
    fontSize: fonts.size.sm,
  },
  itemAmount: { fontSize: fonts.size.sm },
  attribute: {
    maxWidth: 200,
    marginLeft: 3,
    lineHeight: 22,
  },
  expandIcons: {
    fontWeight: fonts.weight.bold,
    fontSize: fonts.size.md,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: 15,
    marginRight: 8,
  },
});

export default LineItemsList;
