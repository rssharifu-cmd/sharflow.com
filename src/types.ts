export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  stock: number;
  category: string;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

export type PaymentMethod = "stripe" | "paypal" | "cod";

export interface Order {
  id: string;
  userEmail: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: "Pending" | "Shipped" | "Delivered";
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  joinedAt: string;
}
