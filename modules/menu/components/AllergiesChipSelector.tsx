import React, { useState } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import { ChipsInput } from "react-native-ui-lib/src/incubator";
import { Colors } from "react-native-ui-lib";
import { AntDesign } from "@expo/vector-icons";

const initialAllergiesList = [
  "Eggs",
  "Milk",
  "Mustard",
  "Peanuts",
  "Crustaceans and molluscs",
  "Fish",
  "Sesame seeds",
  "Soy",
  "Sulphites",
  "Tree Nuts",
  "Wheat and triticale",
];
type props = {
  allergiesSelected: string[];
  onChangeAllergiesSelected: (allergies: string[]) => void;
};

const AllergiesChipSelector = ({
  allergiesSelected = [],
  onChangeAllergiesSelected,
}: props) => {
  const [allergiesList, setAllergiesList] = useState(initialAllergiesList);
  const [isExpanded, setIsExpanded] = useState(false);

  const onPressAllergyChip = (label) => {
    const actualValues = allergiesSelected.includes(label)
      ? allergiesSelected.filter((allergySelected) => allergySelected !== label)
      : [...allergiesSelected, label];

    onChangeAllergiesSelected(actualValues);
  };

  const onAddAllergy = (values) => {
    if (values.length > 0) {
      const allergyToAdd = values[values.length - 1].label;

      setAllergiesList([...allergiesList, allergyToAdd]);
      onPressAllergyChip(allergyToAdd);
    }
  };

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.text}>Allergies</Text>
        <AntDesign
          name={isExpanded ? "minus" : "plus"}
          size={10}
          color="white"
          style={{
            paddingVertical: 5,
            paddingHorizontal: 7,
            backgroundColor: Colors.primary,
            borderRadius: 5,
            textAlign: "center",
          }}
          onPress={toggleMenu}
        />
      </View>
      <View
        style={[
          styles.menu,
          {
            maxHeight: isExpanded ? "100%" : 0,
            overflow: "hidden",
          },
        ]}
      >
        <ChipsInput
          selectionColor={Colors.primary}
          placeholder={" Other Allergy"}
          onChange={onAddAllergy}
          chips={allergiesList.map((allergy) => {
            const isAllergySelected = allergiesSelected.includes(allergy);

            return {
              label: allergy,
              backgroundColor: isAllergySelected
                ? Colors.primary
                : Colors.white,
              labelStyle: {
                color: isAllergySelected ? Colors.white : Colors.black,
              },
              containerStyle: {
                borderColor: isAllergySelected ? Colors.primary : Colors.black,
              },
              onDismiss: () => {},
              dismissIcon: <></>,
              onPress: () => onPressAllergyChip(allergy),
            };
          })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  text: {
    marginRight: 10,
  },
  button: {
    fontSize: 20,
    cursor: "pointer",
    transition: "font-size 0.3s ease",
  },
  buttonExpanded: {
    fontSize: 18,
  },
  menu: {
    transition: "max-height 0.3s ease",
  },
});

export default AllergiesChipSelector;
