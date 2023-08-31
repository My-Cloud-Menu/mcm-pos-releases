import { StyleSheet } from "react-native";
import React from "react";
import { Button, Text, View } from "react-native-ui-lib";

const IngredientGroupItem = ({ ingredient }: any) => {
  return (
    <View style={styles.container}>
      <Text marginL-5 text80BO>
        {ingredient.name}
      </Text>
      <View row>
        <Button variant="iconButtonWithLabelCenterOutline" useMinSize marginR-4>
          <Text text100>Small</Text>
        </Button>
        <Button
          variant="iconButtonWithLabelCenterOutline"
          active
          size="small"
          useMinSize
          marginR-4
        >
          <Text text100>Medium</Text>
        </Button>
        <Button variant="iconButtonWithLabelCenterOutline" useMinSize marginR-4>
          <Text text100>Big</Text>
        </Button>
      </View>
    </View>
  );
};

export default IngredientGroupItem;

const styles = StyleSheet.create({
  container: {},
});
