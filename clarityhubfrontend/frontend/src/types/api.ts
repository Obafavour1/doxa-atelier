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
  id: string;
  user: User;
  items: Array<{
    product: Product;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  carrier?: string;
  discountAmount: number;
  couponCode?: string;
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
  chartData: any[];
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
