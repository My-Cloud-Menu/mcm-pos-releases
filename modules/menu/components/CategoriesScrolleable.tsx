import { StyleSheet, ScrollView } from "react-native";
import React from "react";
import { Pressable } from "react-native";
import { Colors, Text } from "react-native-ui-lib";
import fonts from "../../common/theme/fonts";

const CategoriesScrolleable = ({
  categories = [],
  onCategorySelect,
  categorySelected = null,
}: any) => {
  return (
    <ScrollView
      horizontal={true}
      style={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      {categories.map((category) => (
        <Pressable
          style={{
            borderBottomColor: Colors.primary,
            paddingBottom: 15,
            borderBottomWidth: categorySelected == category.id ? 2 : 0,
          }}
          onPress={() => onCategorySelect(category.id)}
        >
          <Text
            style={{
              ...styles.category,
              color:
                categorySelected == category.id
                  ? Colors.primary
                  : Colors.grayActive,
            }}
            key={`categorybutton-${category.name}`}

            //   customContainerStyle={{
            //     marginHorizontal: 9,
            //     marginVertical: 10,
            //     backgroundColor:
            //       category.id == categorySelected ? Colors.primary : "#E5E5E5",
            //   }}
          >
            {category.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default CategoriesScrolleable;

const styles = StyleSheet.create({
  container: {},
  category: {
    fontSize: fonts.size.md,
    marginHorizontal: 30,
  },
});
