import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Button, Colors, Image, Text } from "react-native-ui-lib";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import ProductItem from "./ProductItem";
import metrics from "../../common/theme/metrics";

const initialData = [
    {
        id: 1,
        name: "Caramel Frapuccino",
        image: {
            normal:
                "https://wearenotmartha.com/wp-content/uploads/twix-frappuccino-featured.jpg",
        },
    },
    {
        id: 2,
        name: "Caramel Frappucino", image: {
            normal:
                "data:image/jpeg;base64,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",
        },
    },
    {
        id: 3, name: "Pizza", image: {
            normal:
                "https://irenemercadal.com/wp-content/uploads/2022/01/frapuccino-irenemercadal.com_.jpeg",
        },
    },
    {
        id: 5, name: "Pizza de Jamon", image: {
            normal:
                "https://www.cardamomo.news/__export/1666285704380/sites/debate/img/2022/10/20/pumpkin_latte_frapuccino_starbucks_receta.png_423682103.png",
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

const getColumsNumbers = () => {

    if (metrics.screenWidth > 1700) return 5
    else if (metrics.screenWidth > 1000) return 4
    else if (metrics.screenWidth > 820) return 3
    else return 2
}

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
        <FlashList
            numColumns={getColumsNumbers()}
            data={data}
            scrollEnabled
            renderItem={({ item }) => {
                let isActive = item.id == 1 || item.id == 2
                return (
                    <ProductItem product={item} isActive={isActive} />
                );
            }}
            estimatedItemSize={data.length}
        />
    );
};

export default ProductsList;

const styles = StyleSheet.create({

});
