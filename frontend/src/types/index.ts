export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  original_price?: number;
  image: string;
  rating: number;
  reviews_count: number;
  description: string;
  in_stock: boolean;
  is_bestseller: boolean;
  is_new: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface CartItem {
  id?: number;
  product_id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category?: string;
}

export interface Cart {
  items: CartItem[];
  total_items: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface OrderItem {
  id: number;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface Order {
  id: number;
  order_number: string;
  created_at: string;
  total_amount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  status: string;
  shipping_address?: string;
  payment_method?: string;
  items: OrderItem[];
}

