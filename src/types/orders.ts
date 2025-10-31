export type OrderStatus = 'PENDING' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface User {
  id: number;
  name: string;
  email: string;
  nationalId: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
}

export interface Side {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface OrderItem {
  id: number;
  product: Product;
  side?: Side;
  quantity: number;
  notes?: string;
  unitPrice: number;
}

export interface Order {
  id: number;
  user: User;
  status: OrderStatus;
  totalPrice: number;
  shift: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface OrdersResponse {
  data: Order[];
  pagination: PaginationInfo;
}

export interface OrderFilters {
  orderId?: string;
  nationalId?: string;
  userName?: string;
  search?: string;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  shift?: string;
  page?: number;
  limit?: number;
}