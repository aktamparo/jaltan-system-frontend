import { useQuery } from "@tanstack/react-query";
import { salesServices } from "@/lib/services/salesServices";
import { SalesAnalyticsFilters, SalesQueryParams } from "@/lib/types/sales";

// Get sales summary/analytics
export const useGetSalesSummary = (filters?: SalesAnalyticsFilters) => {
  return useQuery({
    queryKey: ["salesSummary", filters],
    queryFn: () => salesServices.getSummary(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

// Get sales list with pagination and filtering
export const useGetSalesList = (params?: SalesQueryParams) => {
  return useQuery({
    queryKey: ["salesList", params],
    queryFn: () => salesServices.getSalesList(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
};