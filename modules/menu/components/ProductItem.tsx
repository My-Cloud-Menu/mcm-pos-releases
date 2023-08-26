import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { Button, Colors, Image, Text, View } from "react-native-ui-lib";
import { FlashList } from "@shopify/flash-list";
import IngredientGroupItem from "./IngredientGroupItem";
import { shadowProps } from "../../common/theme/shadows";

const ProductItem = ({ product, isActive = false, onPress = null }: any) => {
  return (
    <Pressable onPress={() => onPress && onPress()} style={styles.container}>
      <View row>
        <Image source={{ uri: product.image.normal }} style={styles.image} />

        <View marginL-20 style={{ width: "100%" }}>
          <Text text60L black style={{ maxWidth: "40%" }}>
            {product.name}
          </Text>
          <Text
            marginT-10
            text90L
            color={Colors.gray}
            style={{ maxWidth: "55%" }}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae
            quibusdam, numquam
          </Text>
          <Text text65BL black marginT-12>
            <Text text100 $textNeutralLight>
              ${" "}
            </Text>
            3,95
          </Text>
        </View>
      </View>

      {isActive && (
        <FlashList
          contentContainerStyle={{ paddingTop: 15, paddingHorizontal: 10 }}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
          data={[
            { name: "Size" },
            { name: "Sugar" },
            { name: "Ice" },
            { name: "Mood" },
          ]}
          renderItem={({ item }) => {
            return <IngredientGroupItem ingredient={item} />;
          }}
          estimatedItemSize={4}
        />
      )}
      <Button
        marginT-20
        marginH-5
        size="medium"
        label="Add to Billing"
        fullWidth
      />
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 3,
    paddingVertical: 8,
    marginHorizontal: 3,
    borderRadius: 8,
    backgroundColor: Colors.white,
    ...shadowProps,
  },
  imageContainer: {
    backgroundColor: Colors.graySoft,
    textAlign: "center",
    borderRadius: 8,
  },
  image: {
    marginLeft: 10,
    width: 110,
    height: 110,
    borderRadius: 8,
  },
});
