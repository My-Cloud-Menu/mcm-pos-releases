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

export interface UpdateProductCart {
  product?: Product;
  quantity?: number;
}

export type payment_method_available = "ecr-card" | "ecr-cash";

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

export type ecrSaleResponse = {
  trace_number: string;
  card_acceptor_id: string;
  batch_number: string;
  special_account: string;
  pan_card_number: string;
  merchant_id: string;
  reference: string;
  amounts: {
    total: string;
    base_state_tax: string;
    tip: string;
    reduced_tax: string;
    base_reduced_tax: string;
    state_tax: string;
    city_tax: string;
  };
  receipt_output: {
    customer: string;
    merchant: string;
  };
  authorization_code: string;
  signature_indicator: string;
  emv_data: {
    "84": string;
    "95": string;
    "9F12": string;
    "9B": string;
    "9F26": string;
    "9F37": string;
  };
  transaction_time: string;
  payment_host: string;
  receipt_selected: string;
  invoice_number: string;
  terminal_id: string;
  transaction_date: string;
  approval_code: string;
  cashier_id: string;
  manual_entry_indicator: string;
  session_id: string;
  ivu: {
    control_line1: string;
    info_line6: string;
    control_line2: string;
    info_line4: string;
    info_line2: string;
  };
  process_cashback: string;
  card_bin_type: string;
  station_number: string;
  response_message: string;
  receipt_email: string;
  transaction_type_indicator: string;
  entry_type: string;
  fallback: string;
};
