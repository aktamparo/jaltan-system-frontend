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
