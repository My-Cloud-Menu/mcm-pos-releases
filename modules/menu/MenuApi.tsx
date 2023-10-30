import {
  GetIngredientGroupRequestResponse,
  GetIngredientRequestResponse,
  GetProductRequestResponse,
  GetTablesRequestResponse,
} from "mcm-types";
import { makeMcmRequest } from "../common/PetitionsHelper";

export const ingredientsQueryKey = "ingredients";
export const ingredientsGroupsQueryKey = "ingredients_groups";
export const productsQueryKey = "products";
export const tablesQueryKey = "tables";

export const getTables = async (): Promise<GetTablesRequestResponse> => {
  return await makeMcmRequest("admin/tables");
};

export const getIngredients =
  async (): Promise<GetIngredientRequestResponse> => {
    let response = await makeMcmRequest(
      "front/ingredients",
      "GET",
      {},
      { withoutPaginate: true }
    );

    response.ingredients = response.ingredients.map((ingredient) => {
      ingredient.measurement_type = ingredient?.measurement_type || "unit";
      ingredient.tags = ingredient?.tags || [];

      return ingredient;
    });

    return response;
  };

export const getIngredientsGroups =
  async (): Promise<GetIngredientGroupRequestResponse> => {
    let response = await makeMcmRequest(
      "front/ingredients/groups",
      "GET",
      {},
      { withoutPaginate: true }
    );

    return response;
  };

export const getProducts = async (): Promise<GetProductRequestResponse> => {
  let response = await makeMcmRequest(
    "front/products",
    "GET",
    {},
    { withoutPaginate: true }
  );

  response.products = response.products.map((product: any) => {
    product.variations = product?.variations || [];

    return product;
  });
  return response;
};
export const getCategoriesWithProducts = async () => {
  const response = await makeMcmRequest(
    "front/products",
    "GET",
    {},
    { withoutPaginate: true }
  );

  let { categories } = await getCategories();

  categories = categories.map((category) => {
    return { ...category, products: [] };
  });

  response.products
    .filter((product) => product.id != 0)
    .forEach((product) => {
      product.categories_id.forEach((categoryId) => {
        let catIndex = categories.findIndex(
          (category) => category.id == categoryId
        );
        if (catIndex != -1) {
          categories[catIndex].products.push(product);
        } else {
          console.log("no encontre el index");
        }
      });
    });

  return categories;
};

export const getCategories = async () => {
  const response = await makeMcmRequest(
    "front/categories",
    "GET",
    {},
    { withoutPaginate: true }
  );
  return { categories: response.categories };
};

export const getProductsByCategory = async (categoryId) => {
  const { products } = await getProducts();

  const productsFounded = products.filter((product) =>
    product.categories_id.includes(categoryId)
  );

  return { products: productsFounded };
};
