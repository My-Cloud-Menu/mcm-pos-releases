import { StyleSheet } from "react-native";
import React from "react";
import { Button, Colors, Image, Text, View } from "react-native-ui-lib";

const ProductItem = ({ product }: any) => {



    return (
        <View style={styles.container}>
            <View row centerV centerH>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.image.normal }} style={styles.image} />

                </View>
                <View marginL-20>
                    <Text text60L black>
                        {product.name}
                    </Text>
                    <Text marginT-8 text90L color={Colors.gray} style={{ maxWidth: 200 }} >
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae quibusdam, numquam
                    </Text>
                    <Text text65 black marginT-10 $textNeutralHeavy>
                        <Text text100>$ </Text>3,95
                    </Text>
                </View>
            </View>
            <Button marginT-40 size="medium" label="Add to Billing" fullWidth />

        </View>
    );
};

export default ProductItem;

const styles = StyleSheet.create({
    container: { maxWidth: "95%", marginBottom: 30 },
    imageContainer: {
        backgroundColor: Colors.graySoft, padding: 10, textAlign: "center", borderRadius: 8,
        marginLeft: 10
    },
    image: {
        width: 120,
        height: 120,

    },
});
