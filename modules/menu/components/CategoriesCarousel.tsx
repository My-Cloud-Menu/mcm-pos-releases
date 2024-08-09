import { StyleSheet, View } from "react-native";
import React from "react";
import { Button, Colors, Text } from "react-native-ui-lib";
import { Entypo } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Category } from "../../../types";
import { useGlobal } from "../../../stores/global";
import { makeMcmRequest } from "../../common/PetitionsHelper";
import { useCartStore } from "../../../stores/cartStore";
import { categoryHasAValidImage, getCategoryImage } from "../MenuHelper";

type props = {
  showCategoryImage?: boolean;
};

const CategoriesCarousel = (props: props) => {
  const { cartProducts, clearCart, isClose, toggleClose, toggleOpen } =
    useCartStore();
  const {
    data: { categories },
  } = useQuery<{ categories: Array<Category> }>({
    queryKey: ["/categories"],
    queryFn: () => makeMcmRequest("front/categories"),
    initialData: { categories: [] },
  });
  const { selectedCategory, setSelectedCategory } = useGlobal();

  const onPressCategory = (category: any) => {
    setSelectedCategory(category);
  };

  return (
    <View style={{ width: "100%" }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          rowGap: 5,
          marginRight: isClose ? 5 : 30,
        }}
      >
        <Button
          onPress={() => onPressCategory(null)}
          variant="iconButtonWithLabelCenterOutline"
          active={!selectedCategory?.id}
          marginV-2
          marginH-5
          style={{ maxHeight: 80, paddingVertical: 2, paddingHorizontal: 10 }}
        >
          {props?.showCategoryImage && (
            <Entypo name="list" size={24} color={Colors.primary} />
          )}
          <View style={{ maxWidth: 150 }}>
            <Text center color={Colors.primary} marginT-5 text80BL>
              {"All"}
            </Text>
          </View>
        </Button>

        {categories
          .filter((category) => category.status == "published")
          .map((item) => {
            let isNavItemActive = selectedCategory?.id == item.id;
            return (
              <Button
                onPress={() => onPressCategory(item)}
                variant="iconButtonWithLabelCenterOutline"
                active={isNavItemActive}
                marginV-2
                marginH-5
                style={{
                  maxHeight: 80,
                  paddingVertical: 2,
                  paddingHorizontal: 10,
                }}
              >
                {props.showCategoryImage &&
                  categoryHasAValidImage(item) &&
                  getCategoryImage(item)}
                <View style={{ maxWidth: 150 }}>
                  <Text
                    center
                    color={isNavItemActive ? Colors.primary : Colors.primary}
                    marginT-4
                    text80BL
                  >
                    {item.name}
                  </Text>
                </View>
              </Button>
            );
          })}
      </View>
      {!isClose && (
        <Entypo
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            borderColor: "#EAEAEA",
            borderWidth: 0.5,
            right: 0,
            position: "absolute",
            height: 81,
          }}
          name="shopping-cart"
          size={32}
          color="#606060"
          onPress={toggleOpen}
        />
      )}
    </View>
  );
};

export default CategoriesCarousel;

const styles = StyleSheet.create({
  image: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
});
