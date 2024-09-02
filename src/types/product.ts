export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;
}

export interface ProductApiResponse {
  limit: number;
  skip: number;
  products: Product[];
  total: number;
}
