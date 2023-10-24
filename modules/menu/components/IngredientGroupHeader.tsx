import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { Text, View } from "react-native-ui-lib";

const IngredientGroupHeader = ({
  group,
  isActive = false,
  onPress = null,
  ingredientsSelected = "Ninguno",
  title = "",
}) => {
  let getLimitAdviceLabel = () => {
    if (group.maximum == 1) return "Hasta 1 Opcion";

    return `De ${group.minimum} hasta ${group.maximum} Opciones`;
  };

  return (
    <Pressable
      style={styles.accordionHeader}
      onPress={() => onPress && onPress()}
    >
      <View marginB-5>
        <Text text75 black style={{ fontWeight: "bold" }}>
          {title || group.label}{" "}
          {group.minimum > 0 && (
            <Text red10 text80>
              *
            </Text>
          )}
        </Text>
        <Text text100L>{getLimitAdviceLabel()}</Text>
      </View>
    </Pressable>
  );
};

export default IngredientGroupHeader;

const styles = StyleSheet.create({});
