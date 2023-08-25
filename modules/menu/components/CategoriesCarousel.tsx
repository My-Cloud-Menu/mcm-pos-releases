import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Button, Colors, Image, Text } from "react-native-ui-lib";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";

const initialData = [
  {
    id: 1,
    name: "All",
    image: {
      normal:
        "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_clear_all_48px-512.png",
    },
  },
  {
    id: 2,
    name: "Pizza", image: {
      normal:
        "https://cdn-icons-png.flaticon.com/512/6978/6978255.png",
    },
  },
  {
    id: 3, name: "Coffe", image: {
      normal:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsfTXOmTwE1v2bwz-NqdZb0cRL8y6YDZgGfA&usqp=CAU",
    },
  },
  {
    id: 5, name: "Hamburguer", image: {
      normal:
        "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    },
  },
  {
    id: 6, name: "Beer", image: {
      normal:
        "https://i.pinimg.com/originals/c6/1c/a5/c61ca5bebd5fac190227f602ab0d6fe8.png",
    },
  }, {
    id: 2,
    name: "Pizza", image: {
      normal:
        "https://cdn-icons-png.flaticon.com/512/6978/6978255.png",
    },
  },
  {
    id: 10, name: "Coffe", image: {
      normal:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsfTXOmTwE1v2bwz-NqdZb0cRL8y6YDZgGfA&usqp=CAU",
    },
  },
  {
    id: 2,
    name: "Pizza", image: {
      normal:
        "https://cdn-icons-png.flaticon.com/512/6978/6978255.png",
    },
  },
  {
    id: 13, name: "Coffe", image: {
      normal:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsfTXOmTwE1v2bwz-NqdZb0cRL8y6YDZgGfA&usqp=CAU",
    },
  },
];

const CategoriesCarousel = () => {

  const { categoryId: categoryIdSelected } =
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
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        renderItem={({ item }) => {
          let isNavItemActive = categoryIdSelected == item.id;
          return (
            <Button
              onPress={() => onPressCategory(item)}
              variant="iconButtonWithLabelCenterOutline"
              active={isNavItemActive}
              marginV-2
              marginH-5
            >
              {item?.image?.normal ? <Image source={{ uri: item.image.normal }} style={styles.image} /> : <Ionicons name="md-restaurant-outline" size={27} color={Colors.primary} />}
              <View style={{ maxWidth: 150 }}>
                <Text
                  center
                  color={isNavItemActive ? Colors.primary : Colors.primary}
                  marginT-14
                  text80BL
                >
                  {item.name}
                </Text>
              </View>
            </Button>
          );
        }}
        estimatedItemSize={data.length}
      />
    </View>
  );
};

export default CategoriesCarousel;

const styles = StyleSheet.create({
  image: {

    width: 36,
    height: 36,
    borderRadius: 8,
  },
});
