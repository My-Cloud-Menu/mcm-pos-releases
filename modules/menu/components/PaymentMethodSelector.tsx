import { StyleSheet } from "react-native";
import React from "react";
import { Badge, Button, Colors, Image, Text, View } from "react-native-ui-lib";
import { FlashList } from "@shopify/flash-list";
import { Feather, FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

const imageUrl = "https://comeperuano.b-cdn.net/wp-content/uploads/2020/10/receta-frappuccino.jpg"

const paymentMethods = [
    {
        name: "Cash",
        icon: (props = {}) => <MaterialCommunityIcons name="cash" size={35} color={Colors.gray} {...props} />,
    },
    {
        name: "Credit Card",
        icon: (props = {}) => (
            <FontAwesome name="credit-card-alt" size={21} color={Colors.gray}  {...props} />
        ),
    },
    {
        name: "Wallet",
        icon: (props = {}) => (
            <FontAwesome5 name="wallet" size={23} color={Colors.gray} {...props} />
        ),
    },


];
const PaymentMethodSelector = () => {

    return (
        <View style={styles.container}>
            <Text text70>Payment Method</Text>
            <View row marginT-20>
                {paymentMethods.map((paymentMethodItem, idx) => {

                    let isPaymentMethodActive = idx == 1

                    return (
                        <Button
                            useMinSize
                            variant="iconButtonWithLabelCenterOutline"
                            active={isPaymentMethodActive}
                            marginR-30
                        >
                            {paymentMethodItem.icon({ color: isPaymentMethodActive ? Colors.primary : Colors.gray })}
                            <Text
                                center
                                color={isPaymentMethodActive ? Colors.primary : Colors.primary}
                                marginT-14
                                text80BL
                            >
                                {paymentMethodItem.name}
                            </Text>
                        </Button>
                    );
                })}
            </View>



        </View>
    );
};

export default PaymentMethodSelector;

const styles = StyleSheet.create({
    container: {},

});
