export interface ImageSize {
   "small": string;
   "normal": string;
   "thumbnail": string;
   "large": string;
}

export interface Product {
   "inventory": number,
   "is_taxable": true,
   "date_updated": string;
   "status": string;
   "stock_status": string;
   "tax_class": string;
   "categories_id": string[],
   "date_created": string;
   "name": string;
   "cost": number,
   "images": ImageSize[],
   "description": string;
   "price": number,
   "id": number,
   "menu_order": number,
   "site_id": string;
   "additional_properties": {}
}

export interface Category {
   "date_updated": string;
   "status": string;
   "slug": string;
   "date_created": string;
   "name": string;
   "count": number,
   "image": ImageSize,
   "description": string;
   "id": string;
   "menu_order": number,
   "site_id": string;
   "additional_properties": any
}



export interface ProductCart {
   product: Product,
   quantity: number;
}
export interface UpdateProductCart {
   product?: Product,
   quantity?: number;
}

export interface CartStore {
   cartProducts: Array<ProductCart>,
   addProduct: (cartProduct: ProductCart) => void
   increaseProduct: (cartProductId: number) => void
   decrementProduct: (cartProductId: number) => void
   removeProduct: (cartProductId: number) => void
   updateProduct: (cartProductId: number, product: UpdateProductCart) => void
}

export interface GlobalStore {
   selectedCategory: Category | null
   setSelectedCategory: (category: Category | null, cb?: Function) => void
}

export interface ProductResponse {
   products: Product[],
   "count": number,
   "lastEvaluatedKey": null
}