import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../services/inventoryServices";
import {
  CreateStockInRequest,
  CreateStockInResponse,
} from "../types/inventory";

export const useCreateStockIn = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateStockInResponse, Error, CreateStockInRequest>({
    mutationFn: (payload: CreateStockInRequest) =>
      inventoryService.createStockIn(payload),
    onSuccess: () => {
      // Invalidate and refetch inventory items after successful stock-in
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      queryClient.invalidateQueries({ queryKey: ["branchItems"] });
    },
    onError: (error: Error) => {
      console.error("Failed to create stock-in:", error.message);
    },
  });
};
