export interface SalesRecord {
  id: string;
  transactionDate: string;
  transactionId: string;
  itemName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: string;
  customerType: string;
  csvFileName?: string;
  branchId: string;
  accountId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesListResponse {
  metadata: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data: SalesRecord[];
}

export interface TopSellingItem {
  itemName: string;
  category?: string; // Optional since backend doesn't provide this
  totalQuantity: number;
  totalRevenue: number;
}

export interface PaymentMethodBreakdown {
  paymentMethod: string;
  count: number; // Mapped from transactionCount
  totalAmount: number;
}

export interface DailySalesTrend {
  date: string;
  totalRevenue: number; // Mapped from totalAmount
  transactionCount: number;
}

// Backend API response interfaces (matching actual API)
export interface BackendSalesSummary {
  totalRevenue: number;
  totalTransactions: number; // Note: backend uses totalTransactions, not transactionCount
  averageOrderValue: number;
  topSellingItems: {
    itemName: string;
    totalQuantity: number;
    totalRevenue: number;
  }[];
  salesByPaymentMethod: {
    paymentMethod: string;
    totalAmount: number;
    transactionCount: number;
  }[];
  salesByDate: {
    date: string;
    totalAmount: number;
    transactionCount: number;
  }[];
}

// Frontend interface for components (what we expect in our components)
export interface SalesSummary {
  totalRevenue: number;
  transactionCount: number;
  averageOrderValue: number;
  topSellingItems: TopSellingItem[];
  paymentMethodBreakdown: PaymentMethodBreakdown[];
  dailySalesTrends: DailySalesTrend[];
}

export interface CSVUploadResponse {
  message: string;
  recordsProcessed: number;
  fileName: string;
}

export interface SalesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
}

export interface SalesAnalyticsFilters {
  startDate?: string;
  endDate?: string;
}