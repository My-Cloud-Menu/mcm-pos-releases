import { makeMcmRequest } from "../common/PetitionsHelper";

export const getProducts = async () => {
  const response = await makeMcmRequest(
    "front/products",
    "GET",
    {},
    { withoutPaginate: true }
  );
  return { products: response.products.filter((product) => product.id != 0) };
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

export const getIngredientsGroups = async () => {
  const response = await makeMcmRequest(
    "front/ingredients/groups",
    "GET",
    {},
    { withoutPaginate: true }
  );
  return { ingredients_groups: response.ingredients_groups };
};

export const getIngredients = async () => {
  const response = await makeMcmRequest(
    "front/ingredients",
    "GET",
    {},
    { withoutPaginate: true }
  );
  return { ingredients: response.ingredients };
};