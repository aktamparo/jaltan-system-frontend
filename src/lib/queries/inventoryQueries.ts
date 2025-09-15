import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryServices";
import { PaginationParams } from "../types/inventory";

export const useGetAllBranchItems = (page: number) => {
  return useQuery({
    queryKey: ["branchItems", page],
    queryFn: () => inventoryService.getAllBranchItems(page),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};

export const usePaginatedInventoryItems = (params: PaginationParams) => {
  return useQuery({
    queryKey: ["inventoryItems", "paginated", params],
    queryFn: () => inventoryService.getPaginatedInventoryItems(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const usePaginatedStockOuts = (params: PaginationParams) => {
  return useQuery({
    queryKey: ["stockOuts", "paginated", params],
    queryFn: () => inventoryService.getAllStockOuts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useGetStockOutById = (id: string) => {
  return useQuery({
    queryKey: ["stockOut", id],
    queryFn: () => inventoryService.getStockOutById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};
