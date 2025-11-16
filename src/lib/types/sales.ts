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
  uploadedAt: string;
  salesUpload?: {
    id: string;
    fileName: string;
    uploadedBy: {
      email: string;
      employee: {
        firstName: string;
        lastName: string;
      };
    };
  };
}

export interface SalesListResponse {
  data: SalesRecord[];
  metadata: {
    total: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}

export interface SalesUpload {
  id: string;
  fileName: string;
  uploadedAt: string;
  recordCount: number;
  fileSize: number;
  status: string;
  errorMessage: string | null;
  uploadedBy: {
    email: string;
    employee: {
      firstName: string;
      lastName: string;
    };
  };
  _count: {
    sales: number;
  };
}

export interface SalesUploadsResponse {
  data: SalesUpload[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
  totalTransactions: number;
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
  uploadId: string;
  recordCount: number;
}

export interface DeleteSalesResponse {
  message: string;
  fileName: string;
  deletedCount: number;
}

export interface UploadsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  branchId?: string;
}

export interface SalesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  branchId?: string;
}

export interface SalesAnalyticsFilters {
  startDate?: string;
  endDate?: string;
  branchId?: string;
}
