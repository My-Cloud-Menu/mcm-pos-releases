import { StyleSheet } from "react-native";
import React from "react";
import { Button, Colors, Image, Text, View } from "react-native-ui-lib";
import { FlashList } from "@shopify/flash-list";
import IngredientGroupItem from "./IngredientGroupItem";

const ProductItem = ({ product, isActive = false }: any) => {

    return (
        <View style={styles.container}>
            <View row centerV centerH>
                <Image source={{ uri: product.image.normal }} style={styles.image} />

                <View marginL-20>
                    <Text text60L black>
                        {product.name}
                    </Text>
                    <Text marginT-10 text90L color={Colors.gray} style={{ maxWidth: 200 }} >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae quibusdam, numquam
                    </Text>
                    <Text text65BL black marginT-12 >
                        <Text text100 $textNeutralLight>$ </Text>3,95
                    </Text>
                </View>
            </View>

            {isActive && <FlashList
                contentContainerStyle={{ paddingTop: 15, paddingHorizontal: 10 }}
                numColumns={2}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                data={[{ name: "Size" }, { name: "Sugar" }, { name: "Ice" }, { name: "Mood" }]}
                renderItem={({ item }) => {
                    return (
                        <IngredientGroupItem ingredient={item} />
                    );
                }}
                estimatedItemSize={4}
            />}
            <Button marginT-20 size="medium" label="Add to Billing" fullWidth />

        </View>
    );
};

export default ProductItem;

const styles = StyleSheet.create({
    container: { maxWidth: "95%", marginBottom: 30 },
    imageContainer: {
        backgroundColor: Colors.graySoft, textAlign: "center",
        borderRadius: 8,
    },
    image: {
        marginLeft: 10
        ,
        width: 110,
        height: 110,
        borderRadius: 8,

    },
});
