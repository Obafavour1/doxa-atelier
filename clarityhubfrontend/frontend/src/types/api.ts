export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin' | 'manager' | 'support';
  avatar?: string;
  isVerified: boolean;
  status: 'active' | 'blocked';
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  featured: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
}

export interface Cart {
  items: CartItem[];
  totalAmount: number;
}

export interface Order {
  _id: string;
  id?: string;
  user: User | string;
  products: Array<{
    product: Product | null;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentAmount?: number;
  paymentCurrency?: string;
  paymentMethod?: 'stripe' | 'paystack';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shippingDetails?: {
    trackingNumber?: string;
    carrier?: string;
  };
  timeline?: Array<{
    status: string;
    message?: string;
    timestamp: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
}

export interface AnalyticsData {
  sales: number;
  orders: number;
  customers: number;
  revenue: number;
  salesGrowth: number;
  revenueGrowth: number;
  chartData: unknown[];
}

export interface StoreSettings {
  storeName: string;
  currency: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  regions: string[];
}
