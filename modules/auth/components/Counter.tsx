import { FlashList } from "@shopify/flash-list";
import React from "react";
import { Text } from "react-native";
import { StyleSheet, View } from "react-native";
import { Colors } from "react-native-ui-lib";

const Counter = ({ item = "", length = 4 }) => {
  const listOfElement = [];
  for (let i = 0; i < length; i++) {
    listOfElement.push(i);
  }

  return (
    <View style={styles.container}>
      <FlashList
        data={listOfElement}
        horizontal
        renderItem={({ item: element }) => {
          return element < item.length ? (
            <View
              key={`counter-${element}`}
              style={{ ...styles.element, ...styles.active }}
            />
          ) : (
            <View key={`counter-${element}`} style={styles.element} />
          )
        }}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  element: {
    width: 40,
    height: 40,
    backgroundColor: Colors.gray,
    marginHorizontal: 10,
    borderRadius: 50,
  },
  active: {
    backgroundColor: Colors.black,
  },
});

export default Counter;
