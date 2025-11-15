import { 
  SalesListResponse, 
  BackendSalesSummary,
  CSVUploadResponse,
  SalesQueryParams,
  SalesAnalyticsFilters,
  SalesUploadsResponse,
  UploadsQueryParams,
  DeleteSalesResponse
} from "@/lib/types/sales";
import { BASE_URL } from "@/lib/config";

export const salesServices = {
  // Upload CSV sales data
  uploadCSV: async (file: File): Promise<CSVUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/sales/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Upload failed: ${response.status}`);
    }

    return response.json();
  },

  // Get sales analytics summary
  getSummary: async (filters?: SalesAnalyticsFilters): Promise<BackendSalesSummary> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);

    const response = await fetch(
      `${BASE_URL}/sales/summary?${params.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch summary: ${response.status}`);
    }

    return response.json();
  },

  // Get paginated sales list
  getSalesList: async (params?: SalesQueryParams): Promise<SalesListResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.startDate) searchParams.append("startDate", params.startDate);
    if (params?.endDate) searchParams.append("endDate", params.endDate);

    const response = await fetch(
      `${BASE_URL}/sales?${searchParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch sales: ${response.status}`);
    }

    return response.json();
  },

  // Delete sales by CSV filename
  deleteSalesByCSV: async (csvFileName: string): Promise<{ message: string; deletedCount: number }> => {
    const response = await fetch(
      `${BASE_URL}/sales?csvFileName=${encodeURIComponent(csvFileName)}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete sales: ${response.status}`);
    }

    return response.json();
  },

  // Get uploaded CSV files (NEW)
  getUploads: async (params?: UploadsQueryParams): Promise<SalesUploadsResponse> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);

    const response = await fetch(
      `${BASE_URL}/sales/uploads?${searchParams.toString()}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to fetch uploads: ${response.status}`);
    }

    return response.json();
  },

  // Delete sales by upload ID (UPDATED)
  deleteSalesByUploadId: async (uploadId: string): Promise<DeleteSalesResponse> => {
    const response = await fetch(
      `${BASE_URL}/sales?uploadId=${encodeURIComponent(uploadId)}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete sales: ${response.status}`);
    }

    return response.json();
  },
};