import Decimal from "decimal.js";
import { Ingredient, Item_attibute, Product } from "mcm-types";
import { showAlert } from "../common/AlertHelper";
import { ProductCart } from "../../stores/cartStore";

export const calculateIngredientsPriceTotal = (
  ingredientsSelected: any[]
): number => {
  let totalValue = 0;

  ingredientsSelected.forEach((group) => {
    group.ingredients
      .filter((ingredient) => ingredient.selected)
      .forEach((ingredient) => {
        let price = ingredient?.variationSelected?.price || ingredient.price;
        totalValue += price;

        ingredient.ingredients_groups.forEach((group2) => {
          group2.ingredients
            .filter((ingredient2) => ingredient2.selected)
            .forEach((ingredient2) => {
              let price2 =
                ingredient2?.variationSelected?.price || ingredient2.price;
              totalValue += price2;

              ingredient2.ingredients_groups.forEach((group3) => {
                group3.ingredients
                  .filter((ingredient3) => ingredient3.selected)
                  .forEach((ingredient3) => {
                    let price3 =
                      ingredient3?.variationSelected?.price ||
                      ingredient3.price;
                    totalValue += price3;
                  });
              });
            });
        });
      });
  });
  return totalValue;
};

export const getIngredientsSelectedFormattedForCart = (
  ingredientsSelected: any[],
  productNotes: string = "",
  allergiesSelected: string[] = []
) => {
  let attributesFormatted: Item_attibute[] = [];

  let omnivoreParams: any[] = [];

  ingredientsSelected.forEach((group1, groupIdx) => {
    let Option: string[] = [];
    let Price = 0;

    group1.ingredients
      .filter((ingredient) => ingredient.selected)
      .forEach((ingredient) => {
        Option.push(ingredient?.variationSelected?.name || ingredient.name);
        // Option += ", ";
        Price += ingredient.price;

        let omnivoreParam = {
          modifier: ingredient?.additional_properties?.omnivoreId,
          modifier_group: group1?.additional_properties?.omnivoreId,
          price_level:
            ingredient?.variationSelected?.additional_properties?.omnivoreId ||
            undefined,
          quantity: 1,
          modifiers: [],
          price_per_unit: ingredient?.additional_properties?.omnivoreIsOpen
            ? new Decimal(ingredient.price).mul(100).toNumber()
            : undefined,
        };

        ingredient.ingredients_groups.forEach((group2) => {
          let Option: string[] = [];
          let Price = 0;

          group2.ingredients
            .filter((ingredient) => ingredient.selected)
            .forEach((ingredient) => {
              Option.push(
                ingredient?.variationSelected?.name || ingredient.name
              );
              //   Option += ", ";
              Price += ingredient.price;

              let omnivoreParam2 = {
                modifier: ingredient?.additional_properties?.omnivoreId,
                modifier_group: group2?.additional_properties?.omnivoreId,
                price_level:
                  ingredient?.variationSelected?.additional_properties
                    ?.omnivoreId || undefined,
                quantity: 1,
                modifiers: [],
                price_per_unit: ingredient?.additional_properties
                  ?.omnivoreIsOpen
                  ? new Decimal(ingredient.price).mul(100).toNumber()
                  : undefined,
              };

              ingredient.ingredients_groups.forEach((group3) => {
                let Option: string[] = [];
                let Price = 0;

                group3.ingredients
                  .filter((ingredient) => ingredient.selected)
                  .forEach((ingredient) => {
                    Option.push(
                      ingredient?.variationSelected?.name || ingredient.name
                    );
                    // Option += ", ";
                    Price += ingredient.price;

                    let omnivoreParam3 = {
                      modifier: ingredient?.additional_properties?.omnivoreId,
                      modifier_group: group3?.additional_properties?.omnivoreId,
                      price_level:
                        ingredient?.variationSelected?.additional_properties
                          ?.omnivoreId || undefined,
                      quantity: 1,
                      modifiers: [],
                      price_per_unit: ingredient?.additional_properties
                        ?.omnivoreIsOpen
                        ? new Decimal(ingredient.price).mul(100).toNumber()
                        : undefined,
                    };

                    omnivoreParam2.modifiers.push(omnivoreParam3);
                  });

                attributesFormatted.push({
                  label:
                    group1.label + " - " + group2.label + " - " + group3.label,
                  value: Option.join(", "),
                  price: Price.toString(),
                  id: "",
                  additional_properties: {},
                });
              });

              omnivoreParam.modifiers.push(omnivoreParam2);
            });

          attributesFormatted.push({
            label: group1.label + " - " + group2.label,
            value: Option.join(", "),
            price: Price.toString(),
            id: "",
            additional_properties: {},
          });
        });

        omnivoreParams.push(omnivoreParam);
      });

    attributesFormatted.push({
      label: group1.label,
      value: Option.join(", "),
      price: Price.toString(),
      id: "",
      additional_properties: {},
    });
  });

  if (productNotes.trim()) {
    attributesFormatted.push({
      label: "Comments:",
      value: productNotes,
      price: "0",
      id: "",
      additional_properties: {},
    });
  }

  if (allergiesSelected.length > 0) {
    attributesFormatted.push({
      label: "Allergies:",
      value: allergiesSelected.join(", "),
      price: "0",
      id: "",
      additional_properties: {},
    });
  }

  attributesFormatted = attributesFormatted.filter(
    (attribute) => attribute.value != ""
  );

  return { attributesFormatted, omnivoreParams };
};

export const validateIngredientsSelection = (ingredientsSelected: any[]) => {
  let result = true;
  let message = "";

  ingredientsSelected.forEach((group) => {
    let ingredientsSelected = group.ingredients.filter(
      (ingredient) => ingredient.selected
    );

    if (ingredientsSelected.length < group.minimum) {
      message = `Seleccione el Modificador - ${group.label}`;
      result = false;
    }

    ingredientsSelected.forEach((ingredient) => {
      ingredient.ingredients_groups.forEach((group2) => {
        let ingredientsSelected2 = group2.ingredients.filter(
          (ingredient) => ingredient.selected
        );

        if (ingredientsSelected2.length < group2.minimum) {
          message = `Seleccione el Modificador - ${ingredient.name} ${group2.label}`;
          result = false;
        }

        ingredientsSelected2.forEach((ingredient2) => {
          ingredient2.ingredients_groups.forEach((group3) => {
            let ingredientsSelected3 = group3.ingredients.filter(
              (ingredient) => ingredient.selected
            );

            if (ingredientsSelected3.length < group3.minimum) {
              message = `Seleccione el Modificador - ${ingredient.name} - ${ingredient2.name} - ${group3.label}`;
              result = false;
            }
          });
        });
      });
    });
  });

  if (message) showAlert({ type: "warning", title: message });
  return result;
};

export const getIngredientsIncludedInProduct = (
  product: Product,
  ingredients: Ingredient[]
) => {
  let ingredientsIncluded: any[] = [];

  if (Array.isArray(product?.ingredients)) {
    let ingredientsIncludedIds = product.ingredients.map(
      (ingredient) => ingredient.id
    );

    ingredientsIncluded = ingredients.filter((ingredient) =>
      ingredientsIncludedIds.includes(ingredient.id)
    );
  }

  return ingredientsIncluded;
};

export const getTotalProductInCart = (productCart: ProductCart) => {
  let price = new Decimal(productCart.product.price);

  productCart.attributes.map((attrib) => {
    let extraPrice = Array.isArray(attrib.price)
      ? attrib.price.reduce((a, b) => a + Number(b), 0).toFixed(2)
      : attrib.price;

    price = price.plus(extraPrice);
  });

  price = price.mul(productCart.quantity);

  return price.toNumber();
};
