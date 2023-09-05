import { StyleSheet, View } from "react-native";
import React from "react";
import { Button, Colors, Image, Text } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "../../common/axios";
import { Category } from "../../../types";
import { useGlobal } from "../../../stores/global";

const CategoriesCarousel = () => {

  const { data: { categories } } = useQuery<{ categories: Array<Category> }>({
    queryKey: ['/categories'],
    queryFn: () => axios.get('/categories?site_id=25102010&withoutPaginate=true'),
    initialData: { categories: [] }
  });
  const { selectedCategory, setSelectedCategory } = useGlobal()


  const onPressCategory = (category: any) => {
    setSelectedCategory(category);
  };


  return (
    <View style={{}}>
      {/* <FlashList
        estimatedItemSize={246}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={categories.map(({ id, name, image: { normal } }) => ({
          id,
          name,
          image: {
            normal
          }
        }))}
        // data={data}
        renderItem={({ item }) => {
          // let isNavItemActive = categoryIdSelected == item.id;
          let isNavItemActive = false;
          return (
            <Button
              onPress={() => { }}
              variant="iconButtonWithLabelCenterOutline"
              active={isNavItemActive}
              marginV-2
              marginH-5
            >
              {item?.image?.normal ? (
                <Image
                  source={{ uri: item.image.normal }}
                  style={styles.image}
                />
              ) : (
                <Ionicons
                  name="md-restaurant-outline"
                  size={27}
                  color={Colors.primary}
                />
              )}
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
      /> */}
      <View style={{
        flexDirection: 'row'
      }}
      >
        <Button
          onPress={() => onPressCategory(null)}
          variant="iconButtonWithLabelCenterOutline"
          active={!selectedCategory?.id}
          marginV-2
          marginH-5
        >
          <Image
            source={{ uri: 'https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_clear_all_48px-512.png' }}
            style={styles.image}
          />
          <View style={{ maxWidth: 150 }}>
            <Text
              center
              color={Colors.primary}
              marginT-14
              text80BL
            >
              {'All'}
            </Text>
          </View>
        </Button>
        {categories.map((item) => {
          let isNavItemActive = selectedCategory?.id == item.id;
          // let isNavItemActive = false;
          return (
            <Button
              onPress={() => onPressCategory(item)}
              variant="iconButtonWithLabelCenterOutline"
              active={isNavItemActive}
              marginV-2
              marginH-5
            >
              {item?.image?.normal ? (
                <Image
                  source={{ uri: item.image.normal }}
                  style={styles.image}
                />
              ) : (
                <Ionicons
                  name="md-restaurant-outline"
                  size={27}
                  color={Colors.primary}
                />
              )}
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
        })}
      </View>
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
