export interface StatsSummary {
  totalRevenue: number;
  totalOrders: number;
  cancelledOrders: number;
  deliveredOrders: number;
}

export interface OrderItemWithSide {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  notes?: string;
  product: {
    id: number;
    name: string;
    price: number;
    photo: string;
  };
  orderItemSide?: {
    id: number;
    orderItemId: number;
    sideId: number;
    side: {
      id: number;
      name: string;
    };
  };
}

export interface StatsOrder {
  id: number;
  userId: number;
  status: string;
  totalPrice: number;
  pickUpTime: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    national_id: string;
  };
  orderItems: OrderItemWithSide[];
}

export interface StatsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StatsResponse {
  success: boolean;
  message: string;
  data: {
    summary: StatsSummary;
    orders: StatsOrder[];
    pagination: StatsPagination;
  };
}

export interface StatsFilters {
  startDate?: string;
  endDate?: string;
}
