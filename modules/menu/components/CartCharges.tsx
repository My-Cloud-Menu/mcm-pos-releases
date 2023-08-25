import React from "react";
import { StyleSheet } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";



const CartCharges = () => {

    return <View>
        <View row spread>
            <Text text80>Subtotal</Text>
            <Text text80><Text text100L>$ </Text>10.20</Text>
        </View>

        <View row spread marginT-13>
            <Text text80 $textNeutral>Tax (10%)</Text>
            <Text text80 ><Text text100L>$ </Text>3.40</Text>
        </View>

        <View style={{
            marginTop: 15,
            borderTopWidth: 1, borderTopColor: Colors.gray, borderStyle: 'dashed',
        }} />

        <View row spread marginT-16>
            <Text text60>Total</Text>
            <Text text60 ><Text text100L>$ </Text>13.60</Text>
        </View>
    </View>

}

export default CartCharges


const styles = StyleSheet.create({})
