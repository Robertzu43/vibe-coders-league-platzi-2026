export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  collection: "premium" | "fun" | "limited";
  variants: string[] | null;
  badges: string[] | null;
  image_url: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: string | null;
}

export interface DiscountCode {
  id: string;
  code: string;
  percent_off: number;
  active: boolean;
  description: string;
}

export interface Order {
  id?: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
  subtotal: number;
  discount_code: string | null;
  discount_percent: number;
  total: number;
  payment_method: "credit_card" | "paypal" | "platzi_credits";
  status: string;
  created_at?: string;
}

export interface OrderItem {
  name: string;
  variant: string | null;
  quantity: number;
  price: number;
  image: string;
}
