import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { ChipsInput } from "react-native-ui-lib/src/incubator";
import { Colors } from "react-native-ui-lib";

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

  const onPressAllergyChip = (label) => {
    let actualValues = allergiesSelected.includes(label)
      ? allergiesSelected.filter((allergySelected) => allergySelected != label)
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

  return (
    <View>
      {/* <Text>Allergies</Text> */}
      <ChipsInput
        selectionColor={Colors.primary}
        placeholder={" Other Allergy"}
        onChange={onAddAllergy}
        chips={allergiesList.map((allergy) => {
          const isAllergySelected = allergiesSelected.includes(allergy);

          return {
            label: allergy,
            backgroundColor: isAllergySelected ? Colors.primary : Colors.white,
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
  );
};

export default AllergiesChipSelector;

const styles = StyleSheet.create({});
