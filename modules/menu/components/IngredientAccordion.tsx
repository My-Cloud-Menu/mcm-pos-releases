import { StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Pressable } from "react-native";
import { Button, Checkbox, Colors, Text } from "react-native-ui-lib";
import IngredientGroupHeader from "./IngredientGroupHeader";
import metrics from "../../common/theme/metrics";
import { Ingredient, IngredientGroup, Product } from "mcm-types";

// !!! PENDING WORK - SOLO ACTUALIZAMOS EL PRIMER NIVEL CON EL NUEVO DISENO, HAY QUE HACER UPDATE A LOS INGREDIENTES CON VARIACIONES Y LOS SUBNIVELES DE INGREDIENTES

type props = {
  product: Product;
  groupsForSelection: any[];
  setGroupsForSelection: (newGroups: any[]) => void;
  ingredients: Ingredient[];
  ingredientsGroups: IngredientGroup[];
  isActive: boolean;
};

const collapseIngredients = false;

const IngredientAccordion = ({
  product,
  groupsForSelection,
  setGroupsForSelection,
  ingredients,
  ingredientsGroups,
  isActive,
}: props) => {
  const [activesGroup, setActivesGroup] = useState([]);

  const onToggleActiveGroup = (groupIdx: any) => {
    setActivesGroup(
      activesGroup.includes(groupIdx)
        ? activesGroup.filter((group) => group != groupIdx)
        : [...activesGroup, groupIdx]
    );
  };

  useEffect(() => {
    if (ingredients && ingredients.length > 0 && ingredientsGroups) {
      getIngredientsGroupsForSelection();
    }
  }, [ingredients, ingredientsGroups, isActive]);

  const getIngredientsGroupsForSelection = () => {
    let attributes = [];

    ingredientsGroups
      .filter((setIngredient) => setIngredient.status == "published")
      .sort((a) => (a.minimum > 0 ? -1 : 1))
      .sort((a, b) => a.menu_order - b.menu_order)
      .forEach((setIngredient) => {
        setIngredient.ingredients_included =
          setIngredient?.ingredients_included || [];

        let isGlobal =
          setIngredient.products_included.length === 0 &&
          setIngredient.ingredients_included.length === 0 &&
          setIngredient.categories_included.length === 0;

        if (
          isGlobal ||
          setIngredient.products_included.includes(product.id) ||
          product.categories_id.some((catId) =>
            setIngredient.categories_included?.includes(catId)
          )
        ) {
          let ingredientsFounded = [];

          setIngredient.ingredients.forEach((ingredientRef) => {
            let ingredientSearched = ingredients.find(
              (ingredient) => ingredient.id == ingredientRef.id
            );

            if (
              ingredientSearched &&
              ingredientSearched.stock_status == "instock"
            ) {
              ingredientsFounded.push({
                id: ingredientSearched.id,
                name: ingredientSearched.name,
                price: ingredientSearched.price,
                ingredients_groups: [],
                variations: ingredientSearched?.variations || [],
                additional_properties: ingredientSearched.additional_properties,
              });
            }
          });

          attributes.push({
            label: setIngredient.label,
            ingredients: ingredientsFounded,
            maximum: setIngredient.maximum,
            minimum: setIngredient.minimum,
            additional_properties: setIngredient.additional_properties,
          });
        }
      });

    setGroupsForSelection(attributes);
  };

  const getGroupsOfIngredient = (ingredientId) => {
    let attributes = [];

    ingredientsGroups
      .filter((setIngredient) => setIngredient.status == "published")
      .sort((a) => (a.minimum > 0 ? -1 : 1))
      .sort((a, b) => a.menu_order - b.menu_order)
      .forEach((setIngredient) => {
        setIngredient.ingredients_included =
          setIngredient.ingredients_included || [];

        if (setIngredient.ingredients_included.includes(ingredientId)) {
          let ingredientsFounded = [];

          setIngredient.ingredients.forEach((ingredientRef) => {
            let ingredientSearched = ingredients.find(
              (ingredient) => ingredient.id == ingredientRef.id
            );

            if (
              ingredientSearched &&
              ingredientSearched.stock_status == "instock"
            ) {
              ingredientsFounded.push({
                id: ingredientSearched.id,
                name: ingredientSearched.name,
                price: ingredientSearched.price,
                ingredients_groups: [],
                variations: ingredientSearched?.variations || [],
                additional_properties: ingredientSearched.additional_properties,
              });
            }
          });

          attributes.push({
            label: setIngredient.label,
            ingredients: ingredientsFounded,
            maximum: setIngredient.maximum,
            minimum: setIngredient.minimum,
            additional_properties: setIngredient.additional_properties,
          });
        }
      });

    return attributes;
  };

  const getIngredientsSelectedLabel = (ingredientGroup) => {
    let label;

    label = ingredientGroup.ingredients
      .filter((ingredient) => ingredient.selected)
      .reduce((acc, ingredient) => {
        let ingredientLabel = ingredient?.variationSelected
          ? `${ingredient.name} ${ingredient.variationSelected.name}`
          : ingredient.name;

        let label = acc + `${ingredientLabel}, `;

        return label;
      }, "");

    return label || "Ninguno";
  };

  const verifyIfSelectionIsDisabled = (ingredientGroup, ingredient) => {
    if (ingredientGroup.maximum == 1) return false;

    let ingredientsSelected = ingredientGroup.ingredients.filter(
      (ingredient) => ingredient.selected
    );

    if (
      ingredientGroup.maximum == ingredientsSelected.length &&
      !ingredientsSelected.some(
        (ingredientSelected) => ingredientSelected.id == ingredient.id
      )
    )
      return true;

    return false;
  };

  const loadGroupsToShow = () => {
    let groupToShow = [];

    groupsForSelection
      .sort((a, b) => (a.minimum > 0 ? -1 : 1))
      .map((ingredientGroup, groupIdx) => {
        groupToShow.push(
          <Pressable
            key={groupIdx}
            style={{ marginVertical: 0, maxWidth: "350px" }}
          >
            <IngredientGroupHeader
              group={ingredientGroup}
              isActive={activesGroup.includes(groupIdx)}
              onPress={() => onToggleActiveGroup(groupIdx)}
              ingredientsSelected={getIngredientsSelectedLabel(ingredientGroup)}
            />
            <View style={{ flexDirection: "row", gap: 14, flexWrap: "wrap" }}>
              {ingredientGroup.ingredients.map((ingredient, ingredientIdx) => {
                ingredient.ingredients_groups.map(
                  (subIngredientGroup, subGroupIdx) => {
                    groupToShow.push(
                      <Pressable
                        key={`${groupIdx}-${ingredientIdx}-${subGroupIdx}`}
                      >
                        <IngredientGroupHeader
                          title={`${ingredient.name} - ${subIngredientGroup.label}`}
                          group={subIngredientGroup}
                          isActive={activesGroup.includes(
                            `${groupIdx}-${subGroupIdx}`
                          )}
                          onPress={() =>
                            onToggleActiveGroup(`${groupIdx}-${subGroupIdx}`)
                          }
                          ingredientsSelected={getIngredientsSelectedLabel(
                            subIngredientGroup
                          )}
                        />

                        <View>
                          {subIngredientGroup.ingredients.map(
                            (subIngredient, subIngredientIdx) => {
                              /////////////////
                              subIngredient.ingredients_groups.map(
                                (subIngredient2Group, subGroup2Idx) => {
                                  groupToShow.push(
                                    <Pressable
                                      key={`${groupIdx}-${ingredientIdx}-${subGroupIdx}-${subIngredientIdx}-${subGroup2Idx}`}
                                    >
                                      <IngredientGroupHeader
                                        group={subIngredient2Group}
                                        isActive={activesGroup.includes(
                                          `${groupIdx}-${subGroupIdx}-${subGroup2Idx}`
                                        )}
                                        onPress={() =>
                                          onToggleActiveGroup(
                                            `${groupIdx}-${subGroupIdx}-${subGroup2Idx}`
                                          )
                                        }
                                        ingredientsSelected={getIngredientsSelectedLabel(
                                          subIngredient2Group
                                        )}
                                        title={`${ingredient.name} - ${subIngredient.name} - ${subIngredient2Group.label}`}
                                      />

                                      <View>
                                        {subIngredient2Group.ingredients.map(
                                          (
                                            subIngredient2,
                                            subIngredient2Idx
                                          ) => {
                                            if (
                                              !activesGroup.includes(
                                                `${groupIdx}-${subGroupIdx}-${subGroup2Idx}`
                                              ) &&
                                              collapseIngredients
                                            )
                                              return;

                                            let isSelectionDisabled =
                                              verifyIfSelectionIsDisabled(
                                                subIngredient2Group,
                                                subIngredient2
                                              );

                                            return subIngredient2.variations
                                              .length > 0 ? (
                                              <View
                                                style={
                                                  styles.ingredientVariationContainer
                                                }
                                              >
                                                <Text
                                                  style={styles.ingredientTitle}
                                                >
                                                  {subIngredient2.name}
                                                </Text>
                                                {subIngredient2.variations.map(
                                                  (variation, variationIdx) => {
                                                    return (
                                                      <Pressable
                                                        style={
                                                          styles.variationContainer
                                                        }
                                                        key={`${groupIdx}-${ingredientIdx}-${subGroupIdx}-${subIngredientIdx}-${subGroup2Idx}-${subIngredient2Idx}-${variationIdx}`}
                                                        onPress={() => {
                                                          if (
                                                            isSelectionDisabled
                                                          )
                                                            return;

                                                          let groups =
                                                            groupsForSelection;

                                                          let isSelected =
                                                            groups[groupIdx]
                                                              .ingredients[
                                                              ingredientIdx
                                                            ]
                                                              .ingredients_groups[
                                                              subGroupIdx
                                                            ].ingredients[
                                                              subIngredientIdx
                                                            ]
                                                              .ingredients_groups[
                                                              subGroup2Idx
                                                            ].ingredients[
                                                              subIngredient2Idx
                                                            ].variationSelected
                                                              ?.id !=
                                                            variation.id;

                                                          groups[
                                                            groupIdx
                                                          ].ingredients[
                                                            ingredientIdx
                                                          ].ingredients_groups[
                                                            subGroupIdx
                                                          ].ingredients[
                                                            subIngredientIdx
                                                          ].ingredients_groups[
                                                            subGroup2Idx
                                                          ].ingredients[
                                                            subIngredient2Idx
                                                          ].selected =
                                                            isSelected;

                                                          // Radio Function
                                                          if (
                                                            groups[groupIdx]
                                                              .ingredients[
                                                              ingredientIdx
                                                            ]
                                                              .ingredients_groups[
                                                              subGroupIdx
                                                            ].ingredients[
                                                              subIngredientIdx
                                                            ]
                                                              .ingredients_groups[
                                                              subGroup2Idx
                                                            ].maximum == 1 &&
                                                            isSelected
                                                          ) {
                                                            groups[
                                                              groupIdx
                                                            ].ingredients[
                                                              ingredientIdx
                                                            ].ingredients_groups[
                                                              subGroupIdx
                                                            ].ingredients[
                                                              subIngredientIdx
                                                            ].ingredients_groups[
                                                              subGroup2Idx
                                                            ].ingredients.forEach(
                                                              (ing, idx) => {
                                                                if (
                                                                  idx ==
                                                                  subIngredient2Idx
                                                                )
                                                                  return;

                                                                ing.selected =
                                                                  false;
                                                                ing.variationSelected =
                                                                  null;
                                                                ing.ingredients_groups =
                                                                  [];
                                                              }
                                                            );
                                                          }
                                                          ////

                                                          // groups[
                                                          //   groupIdx
                                                          // ].ingredients[
                                                          //   ingredientIdx
                                                          // ].ingredients_groups[
                                                          //   subGroupIdx
                                                          // ].ingredients[
                                                          //   subIngredient2Idx
                                                          // ].ingredients_groups =
                                                          //   isSelected
                                                          //     ? getGroupsOfIngredient(
                                                          //         subIngredient2.id
                                                          //       )
                                                          //     : [];

                                                          groups[
                                                            groupIdx
                                                          ].ingredients[
                                                            ingredientIdx
                                                          ].ingredients_groups[
                                                            subGroupIdx
                                                          ].ingredients[
                                                            subIngredientIdx
                                                          ].ingredients_groups[
                                                            subGroup2Idx
                                                          ].ingredients[
                                                            subIngredient2Idx
                                                          ].variationSelected =
                                                            isSelected
                                                              ? variation
                                                              : null;

                                                          groups[
                                                            groupIdx
                                                          ].ingredients[
                                                            ingredientIdx
                                                          ].ingredients_groups[
                                                            subGroupIdx
                                                          ].ingredients[
                                                            subIngredientIdx
                                                          ].ingredients_groups[
                                                            subGroup2Idx
                                                          ].ingredients[
                                                            subIngredient2Idx
                                                          ].price =
                                                            variation.price;

                                                          setGroupsForSelection(
                                                            [...groups]
                                                          );
                                                        }}
                                                      >
                                                        <Text
                                                          style={
                                                            styles.variationTitle
                                                          }
                                                        >
                                                          {variation.name}{" "}
                                                          {variation.price !=
                                                            0 &&
                                                            `($${variation.price})`}
                                                        </Text>
                                                        <Checkbox
                                                          disabled={
                                                            isSelectionDisabled
                                                          }
                                                          style={
                                                            styles.ingredientCheckbox
                                                          }
                                                          size={19}
                                                          color={Colors.primary}
                                                          value={
                                                            subIngredient2
                                                              ?.variationSelected
                                                              ?.id ==
                                                            variation.id
                                                          }
                                                        />
                                                      </Pressable>
                                                    );
                                                  }
                                                )}
                                              </View>
                                            ) : (
                                              <Pressable
                                                style={
                                                  styles.ingredientContainer
                                                }
                                                key={`${groupIdx}-${ingredientIdx}-${subGroupIdx}-${subIngredientIdx}-${subGroup2Idx}-${subIngredient2Idx}`}
                                                onPress={() => {
                                                  if (isSelectionDisabled)
                                                    return;

                                                  let groups =
                                                    groupsForSelection;

                                                  let isSelected = groups[
                                                    groupIdx
                                                  ].ingredients[ingredientIdx]
                                                    .ingredients_groups[
                                                    subGroupIdx
                                                  ].ingredients[
                                                    subIngredientIdx
                                                  ].ingredients_groups[
                                                    subGroup2Idx
                                                  ].ingredients[
                                                    subIngredient2Idx
                                                  ].selected
                                                    ? false
                                                    : true;

                                                  groups[groupIdx].ingredients[
                                                    ingredientIdx
                                                  ].ingredients_groups[
                                                    subGroupIdx
                                                  ].ingredients[
                                                    subIngredientIdx
                                                  ].ingredients_groups[
                                                    subGroup2Idx
                                                  ].ingredients[
                                                    subIngredient2Idx
                                                  ].selected = isSelected;

                                                  // Radio Function
                                                  if (
                                                    groups[groupIdx]
                                                      .ingredients[
                                                      ingredientIdx
                                                    ].ingredients_groups[
                                                      subGroupIdx
                                                    ].ingredients[
                                                      subIngredientIdx
                                                    ].ingredients_groups[
                                                      subGroup2Idx
                                                    ].maximum == 1 &&
                                                    isSelected
                                                  ) {
                                                    groups[
                                                      groupIdx
                                                    ].ingredients[
                                                      ingredientIdx
                                                    ].ingredients_groups[
                                                      subGroupIdx
                                                    ].ingredients[
                                                      subIngredientIdx
                                                    ].ingredients_groups[
                                                      subGroup2Idx
                                                    ].ingredients.forEach(
                                                      (ing, idx) => {
                                                        if (
                                                          idx ==
                                                          subIngredient2Idx
                                                        )
                                                          return;

                                                        ing.selected = false;
                                                        ing.variationSelected =
                                                          null;
                                                        ing.ingredients_groups =
                                                          [];
                                                      }
                                                    );
                                                  }
                                                  ////

                                                  // groups[groupIdx].ingredients[
                                                  //   ingredientIdx
                                                  // ].ingredients_groups[
                                                  //   subGroupIdx
                                                  // ].ingredients[
                                                  //   subIngredientIdx
                                                  // ].ingredients_groups[
                                                  //   subGroup2Idx
                                                  // ].ingredients[
                                                  //   subIngredient2Idx
                                                  // ].ingredients_groups =
                                                  //   getGroupsOfIngredient(
                                                  //     subIngredient2.id
                                                  //   );

                                                  setGroupsForSelection([
                                                    ...groups,
                                                  ]);
                                                }}
                                              >
                                                <Text>
                                                  {subIngredient2.name}{" "}
                                                  {subIngredient2.price != 0 &&
                                                    `($${subIngredient2.price})`}
                                                </Text>
                                                <Checkbox
                                                  disabled={isSelectionDisabled}
                                                  style={
                                                    styles.ingredientCheckbox
                                                  }
                                                  size={19}
                                                  color={Colors.primary}
                                                  value={
                                                    subIngredient2.selected
                                                  }
                                                />
                                              </Pressable>
                                            );
                                          }
                                        )}
                                      </View>
                                    </Pressable>
                                  );
                                }
                              );
                              ///////////////// sub2
                              if (
                                !activesGroup.includes(
                                  `${groupIdx}-${subGroupIdx}`
                                ) &&
                                collapseIngredients
                              )
                                return;

                              let isSelectionDisabled =
                                verifyIfSelectionIsDisabled(
                                  subIngredientGroup,
                                  subIngredient
                                );

                              return subIngredient.variations.length > 0 ? (
                                <View
                                  style={styles.ingredientVariationContainer}
                                >
                                  <Text style={styles.ingredientTitle}>
                                    {subIngredient.name}
                                  </Text>
                                  {subIngredient.variations.map(
                                    (variation, variationIdx) => {
                                      return (
                                        <Pressable
                                          style={styles.variationContainer}
                                          key={`${ingredientIdx}-${subIngredientIdx}-${variationIdx}`}
                                          onPress={() => {
                                            if (isSelectionDisabled) return;

                                            let groups = groupsForSelection;

                                            let isSelected =
                                              groups[groupIdx].ingredients[
                                                ingredientIdx
                                              ].ingredients_groups[subGroupIdx]
                                                .ingredients[subIngredientIdx]
                                                .variationSelected?.id !=
                                              variation.id;

                                            groups[groupIdx].ingredients[
                                              ingredientIdx
                                            ].ingredients_groups[
                                              subGroupIdx
                                            ].ingredients[
                                              subIngredientIdx
                                            ].selected = isSelected;

                                            // Radio Function
                                            if (
                                              groups[groupIdx].ingredients[
                                                ingredientIdx
                                              ].ingredients_groups[subGroupIdx]
                                                .maximum == 1 &&
                                              isSelected
                                            ) {
                                              groups[groupIdx].ingredients[
                                                ingredientIdx
                                              ].ingredients_groups[
                                                subGroupIdx
                                              ].ingredients.forEach(
                                                (ing, idx) => {
                                                  if (idx == subIngredientIdx)
                                                    return;

                                                  ing.selected = false;
                                                  ing.variationSelected = null;
                                                  ing.ingredients_groups = [];
                                                }
                                              );
                                            }
                                            ////

                                            groups[groupIdx].ingredients[
                                              ingredientIdx
                                            ].ingredients_groups[
                                              subGroupIdx
                                            ].ingredients[
                                              subIngredientIdx
                                            ].ingredients_groups = isSelected
                                              ? getGroupsOfIngredient(
                                                  subIngredient.id
                                                )
                                              : [];

                                            groups[groupIdx].ingredients[
                                              ingredientIdx
                                            ].ingredients_groups[
                                              subGroupIdx
                                            ].ingredients[
                                              subIngredientIdx
                                            ].variationSelected = isSelected
                                              ? variation
                                              : null;

                                            groups[groupIdx].ingredients[
                                              ingredientIdx
                                            ].ingredients_groups[
                                              subGroupIdx
                                            ].ingredients[
                                              subIngredientIdx
                                            ].price = variation.price;

                                            setGroupsForSelection([...groups]);
                                          }}
                                        >
                                          <Text style={styles.variationTitle}>
                                            {variation.name}{" "}
                                            {variation.price != 0 &&
                                              `($${variation.price})`}
                                          </Text>
                                          <Checkbox
                                            disabled={isSelectionDisabled}
                                            style={styles.ingredientCheckbox}
                                            size={19}
                                            color={Colors.primary}
                                            value={
                                              subIngredient?.variationSelected
                                                ?.id == variation.id
                                            }
                                          />
                                        </Pressable>
                                      );
                                    }
                                  )}
                                </View>
                              ) : (
                                <Pressable
                                  style={styles.ingredientContainer}
                                  key={`${ingredientGroup.id}-${ingredientIdx}-${subIngredientGroup.id}-${subIngredientIdx}`}
                                  onPress={() => {
                                    if (isSelectionDisabled) return;

                                    let groups = groupsForSelection;

                                    let isSelected = groups[groupIdx]
                                      .ingredients[ingredientIdx]
                                      .ingredients_groups[subGroupIdx]
                                      .ingredients[subIngredientIdx].selected
                                      ? false
                                      : true;

                                    groups[groupIdx].ingredients[
                                      ingredientIdx
                                    ].ingredients_groups[
                                      subGroupIdx
                                    ].ingredients[subIngredientIdx].selected =
                                      isSelected;

                                    // Radio Function
                                    if (
                                      groups[groupIdx].ingredients[
                                        ingredientIdx
                                      ].ingredients_groups[subGroupIdx]
                                        .maximum == 1 &&
                                      isSelected
                                    ) {
                                      groups[groupIdx].ingredients[
                                        ingredientIdx
                                      ].ingredients_groups[
                                        subGroupIdx
                                      ].ingredients.forEach((ing, idx) => {
                                        if (idx == subIngredientIdx) return;

                                        ing.selected = false;
                                        ing.variationSelected = null;
                                        ing.ingredients_groups = [];
                                      });
                                    }
                                    ////

                                    groups[groupIdx].ingredients[
                                      ingredientIdx
                                    ].ingredients_groups[
                                      subGroupIdx
                                    ].ingredients[
                                      subIngredientIdx
                                    ].ingredients_groups = isSelected
                                      ? getGroupsOfIngredient(subIngredient.id)
                                      : [];

                                    setGroupsForSelection([...groups]);
                                  }}
                                >
                                  <Text>
                                    {subIngredient.name}{" "}
                                    {subIngredient.price != 0 &&
                                      `($${subIngredient.price})`}
                                  </Text>
                                  <Checkbox
                                    disabled={isSelectionDisabled}
                                    style={styles.ingredientCheckbox}
                                    size={19}
                                    color={Colors.primary}
                                    value={subIngredient.selected}
                                  />
                                </Pressable>
                              );
                            }
                          )}
                        </View>
                      </Pressable>
                    );
                  }
                );

                if (!activesGroup.includes(groupIdx) && collapseIngredients)
                  return;

                let isSelectionDisabled = verifyIfSelectionIsDisabled(
                  ingredientGroup,
                  ingredient
                );

                return ingredient.variations.length > 0 ? (
                  <View style={styles.ingredientVariationContainer}>
                    <Text style={styles.ingredientTitle}>
                      {ingredient.name}
                    </Text>
                    {ingredient.variations.map((variation, variationIdx) => {
                      return (
                        <Pressable
                          style={styles.variationContainer}
                          key={`${ingredientIdx}-${variationIdx}`}
                          onPress={() => {
                            if (isSelectionDisabled) return;

                            let groups = groupsForSelection;
                            let isSelected =
                              groups[groupIdx].ingredients[ingredientIdx]
                                .variationSelected?.id != variation.id;

                            groups[groupIdx].ingredients[
                              ingredientIdx
                            ].selected = isSelected;

                            // Radio Function
                            if (groups[groupIdx].maximum == 1 && isSelected) {
                              groups[groupIdx].ingredients.forEach(
                                (ing, idx) => {
                                  if (idx == ingredientIdx) return;

                                  ing.selected = false;
                                  ing.variationSelected = null;
                                  ing.ingredients_groups = [];
                                }
                              );
                            }
                            ////

                            groups[groupIdx].ingredients[
                              ingredientIdx
                            ].ingredients_groups = isSelected
                              ? getGroupsOfIngredient(ingredient.id)
                              : [];

                            groups[groupIdx].ingredients[
                              ingredientIdx
                            ].variationSelected = isSelected ? variation : null;

                            groups[groupIdx].ingredients[ingredientIdx].price =
                              variation.price;

                            setGroupsForSelection([...groups]);
                          }}
                        >
                          <Text style={styles.variationTitle}>
                            {variation.name}{" "}
                            {variation.price != 0 && `($${variation.price})`}
                          </Text>

                          <Checkbox
                            disabled={isSelectionDisabled}
                            style={styles.ingredientCheckbox}
                            size={19}
                            color={Colors.primary}
                            value={
                              ingredient?.variationSelected?.id == variation.id
                            }
                          />
                        </Pressable>
                      );
                    })}
                  </View>
                ) : (
                  <Button
                    variant="iconButtonWithLabelCenterOutline"
                    active={ingredient.selected}
                    size="small"
                    useMinSize
                    disabled={isSelectionDisabled}
                    // style={styles.ingredientContainer}
                    onPress={() => {
                      if (isSelectionDisabled) return;

                      let groups = groupsForSelection;

                      let isSelected = groups[groupIdx].ingredients[
                        ingredientIdx
                      ].selected
                        ? false
                        : true;

                      groups[groupIdx].ingredients[ingredientIdx].selected =
                        isSelected;

                      // Radio Function
                      if (groups[groupIdx].maximum == 1 && isSelected) {
                        groups[groupIdx].ingredients.forEach((ing, idx) => {
                          if (idx == ingredientIdx) return;

                          ing.selected = false;
                          ing.variationSelected = null;
                          ing.ingredients_groups = [];
                        });
                      }
                      ////

                      groups[groupIdx].ingredients[
                        ingredientIdx
                      ].ingredients_groups = groups[groupIdx].ingredients[
                        ingredientIdx
                      ].selected
                        ? getGroupsOfIngredient(ingredient.id)
                        : [];

                      setGroupsForSelection([...groups]);
                    }}
                  >
                    <Text text80>
                      {ingredient.name}{" "}
                      {ingredient.price != 0 && `($${ingredient.price})`}
                    </Text>
                  </Button>
                );
              })}
            </View>
          </Pressable>
        );
      });

    return groupToShow;
  };

  if (!isActive) return <></>;

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        rowGap: 30,
        columnGap: 18,
      }}
    >
      {loadGroupsToShow()}
    </View>
  );
};

export default IngredientAccordion;

const styles = StyleSheet.create({
  ingredientContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: metrics.screenWidth * 0.85,
    marginHorizontal: "5%",
    marginVertical: 3,
  },
  ingredientVariationContainer: {},
  ingredientCheckbox: {},
  ingredientTitle: {
    maxWidth: "85%",
    marginHorizontal: "5%",
    fontWeight: "bold",
  },
  variationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    maxWidth: metrics.screenWidth * 0.85 - 10,
    marginLeft: metrics.screenWidth * 0.05 + 10,
    marginVertical: 3,
  },
  variationTitle: { maxWidth: "80%" },
});
