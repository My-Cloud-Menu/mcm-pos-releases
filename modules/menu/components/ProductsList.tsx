import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Button, Colors, Image, Text } from "react-native-ui-lib";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import ProductItem from "./ProductItem";

const initialData = [
    {
        id: 1,
        name: "All",
        image: {
            normal:
                "https://i.pinimg.com/originals/c6/1c/a5/c61ca5bebd5fac190227f602ab0d6fe8.png",
        },
    },
    {
        id: 2,
        name: "Coffe", image: {
            normal:
                "https://i.pinimg.com/originals/c6/1c/a5/c61ca5bebd5fac190227f602ab0d6fe8.png",
        },
    },
    {
        id: 3, name: "Pizza", image: {
            normal:
                "https://i.pinimg.com/originals/c6/1c/a5/c61ca5bebd5fac190227f602ab0d6fe8.png",
        },
    },
    {
        id: 5, name: "Pizza de Jamon", image: {
            normal:
                "https://i.pinimg.com/originals/c6/1c/a5/c61ca5bebd5fac190227f602ab0d6fe8.png",
        },
    },
    {
        id: 6, name: "All", image: {
            normal:
                "https://i.pinimg.com/originals/c6/1c/a5/c61ca5bebd5fac190227f602ab0d6fe8.png",
        },
    }, {
        id: 6, name: "All", image: {
            normal:
                "https://i.pinimg.com/originals/c6/1c/a5/c61ca5bebd5fac190227f602ab0d6fe8.png",
        },
    }, {
        id: 6, name: "All", image: {
            normal:
                "https://i.pinimg.com/originals/c6/1c/a5/c61ca5bebd5fac190227f602ab0d6fe8.png",
        },
    }, {
        id: 6, name: "All", image: {
            normal:
                "https://i.pinimg.com/originals/c6/1c/a5/c61ca5bebd5fac190227f602ab0d6fe8.png",
        },
    },
];

const ProductsList = () => {

    const { category: categorySelected } =
        useLocalSearchParams();


    // ESTE CODIGO NO ME GUSTA, VER SI HAY UNA MEJOR MANERA DE REFRESH
    const [data, setData] = useState(initialData)

    const onPressCategory = (category: any) => {
        router.setParams({ categoryId: category.id, categoryName: category.name })
        setData([...initialData])
    }

    return (
        <View>
            <FlashList
                numColumns={2}
                data={data}
                renderItem={({ item }) => {
                    return (
                        <ProductItem product={item} />
                    );
                }}
                estimatedItemSize={data.length}
            />
        </View>
    );
};

export default ProductsList;

const styles = StyleSheet.create({
    image: {

        width: 40,
        height: 30,
        borderRadius: 8,
    },
});
