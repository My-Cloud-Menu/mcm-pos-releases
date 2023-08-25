import { StyleSheet } from "react-native";
import React from "react";
import { Badge, Button, Colors, Image, Text, View } from "react-native-ui-lib";
import { FlashList } from "@shopify/flash-list";
import { Feather } from "@expo/vector-icons";

const imageUrl = "https://comeperuano.b-cdn.net/wp-content/uploads/2020/10/receta-frappuccino.jpg"

const CartItem = () => {

    return (
        <View style={styles.container}>
            <View row>
                <Image source={{ uri: imageUrl }} style={styles.image} />

                <View marginL-13 >
                    <Text text65  >
                        Caramel Frappucino
                    </Text>

                    <View row bottom marginT-10>
                        <Text text90 marginL-1>
                            x1
                        </Text>
                        <Text text90L marginL-20>
                            Notes <Feather name="edit-3" color={Colors.primary} />
                        </Text>
                        <Text $textNeutralHeavy marginL-50>
                            <Text text100L>$</Text> 25.40
                        </Text>
                    </View>

                </View>


            </View>



        </View>
    );
};

export default CartItem;

const styles = StyleSheet.create({
    container: {},
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,

    },
});
