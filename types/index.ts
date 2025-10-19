import { Product, Category, Order, User, Address, ProductReview, CartItem, OrderItem } from '@prisma/client'

// Extended types for API responses
export type ProductWithCategory = Product & {
  category: Category;
  price: number;
  comparePrice: number | null;
  costPrice: number | null;
  weight: number | null;
  images: string[];
  features: string[];
}

export type OrderWithDetails = Order & {
  user: Pick<User, 'name' | 'email' | 'phone'>;
  address: Address;
  orderItems: (OrderItem & {
    product: Pick<Product, 'name' | 'images' | 'slug'>;
  })[];
}

export type CartItemWithProduct = CartItem & {
  product: Product;
}

export type ProductWithReviews = Product & {
  category: Category;
  reviews: (ProductReview & {
    user: Pick<User, 'name' | 'image'>;
  })[];
  _avg: {
    rating: number | null;
  };
  _count: {
    reviews: number;
  };
}

// API Response types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form data types
export type LoginFormData = {
  email: string;
  password: string;
}

export type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export type AddressFormData = {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  suburb: string;
  streetAddress: string;
  unitNumber?: string;
  postalCode: string;
  isDefault: boolean;
  type: 'HOME' | 'WORK' | 'OTHER';
}

export type CheckoutFormData = {
  addressId: string;
  paymentMethod: string;
  notes?: string;
}