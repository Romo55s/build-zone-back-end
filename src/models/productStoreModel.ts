export interface ProductStore {
  product_id: string;
  store_id: string;
  product_name: string;
  category: string;
  price: number;
  image: File;
  stock: number;
  supplier: string;
}
