import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../react-query";
import { inventoryService } from "../services/inventoryServices";
import {
  CreateStockInResponse,
  CreateStockInRequest,
} from "../types/inventory";

export const useCreateStockIn = () => {
  return useMutation<CreateStockInResponse, Error, CreateStockInRequest>({
    mutationFn: (payload) => inventoryService.createStockIn(payload),
    onSuccess: () => {
      // Auto-refresh inventory data after stock-in
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      queryClient.invalidateQueries({ queryKey: ["branchItems"] });
    },
  });
};
