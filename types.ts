export type stock_status = "instock" | "outofstock";

export type ingredient_measurement_type =
  | "oz"
  | "lb"
  | "g"
  | "kg"
  | "tsp"
  | "tbsp"
  | "cup"
  | "pt"
  | "qt"
  | "gal"
  | "ml"
  | "L"
  | "fl oz";

export interface Ingredient_Variation {
  id: string;
  name: string;
  price: number;
  stock_status: stock_status;
  additional_properties: any;
}

export interface ImageSize {
  small: string;
  normal: string;
  thumbnail: string;
  large: string;
}

export interface Product {
  inventory: number;
  is_taxable: true;
  date_updated: string;
  status: string;
  stock_status: string;
  tax_class: string;
  categories_id: string[];
  date_created: string;
  name: string;
  cost: number;
  images: ImageSize[];
  description: string;
  price: number;
  id: number;
  menu_order: number;
  site_id: string;
  additional_properties: {};
}

export interface Category {
  date_updated: string;
  status: string;
  slug: string;
  date_created: string;
  name: string;
  count: number;
  image: ImageSize;
  description: string;
  id: string;
  menu_order: number;
  site_id: string;
  additional_properties: any;
}

export interface Ingredient {
  id: string;
  site_id?: string;
  name: string;
  price: number;
  stock_status?: stock_status;
  variations: Array<Ingredient_Variation>;
  date_created: string;
  date_updated: string;
  description?: string;
  additional_properties?: any;
  tags: Array<string>;
  measurement_type: ingredient_measurement_type;
}

export type order_status =
  | "pending-payment"
  | "new-order"
  | "in-kitchen"
  | "ready-for-pickup"
  | "delivery-in-progress"
  | "check-closed"
  | "trash"
  | "cancelled";

export type order_payment_status =
  | "fulfilled"
  | "partially_fulfilled"
  | "not_fulfilled";

export interface Order {
  id: string;
  cart_id: string;
  cart: any;
  site_id: string;
  location_id: string;
  pickup_time: string;
  date_created: string;
  date_updated: string;
  status: order_status;
  payment_status: order_payment_status;
  tracking_link: string;
  // order_notes: Array<Order_Note>;
  // payments: Array<Order_Payment>;
  additional_properties: any;
  paid: string;
  total: string;
}

export interface ProductCart {
  product: Product;
  quantity: number;
}
export interface UpdateProductCart {
  product?: Product;
  quantity?: number;
}

export interface CartStore {
  cartProducts: Array<ProductCart>;
  addProduct: (cartProduct: ProductCart) => void;
  increaseProduct: (cartProductId: number) => void;
  decrementProduct: (cartProductId: number) => void;
  removeProduct: (cartProductId: number) => void;
  updateProduct: (cartProductId: number, product: UpdateProductCart) => void;
  clearCart: () => void;
}

export interface OrderStore {
  isLoading: boolean;
  error: any;
  inputValues: {
    first_name: string;
  };
  createOrder: () => Promise<Order>;
  changeInputValue: (propertyName: string, value: string) => void;
  isCreateOrderAvailable: () => boolean;
}

export interface GlobalStore {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null, cb?: Function) => void;
}

export interface ProductResponse {
  products: Product[];
  count: number;
  lastEvaluatedKey: null;
}

export interface IngredientResponse {
  ingredients: Ingredient[];
  count: number;
  lastEvaluatedKey: null;
}

export interface OrdersResponse {
  orders: Order[];
  count: number;
  lastEvaluatedKey: null;
}
