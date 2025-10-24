import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService,createMasteritem, editMasteritem } from "../services/inventoryServices";
import { handleApiError, handleApiSuccess } from "../utils/errorHandler";
import {
  CreateStockInRequest,
  CreateStockInResponse,
  CreateStockOutRequest,
  CreateStockOutResponse,
  UpdateStockOutRequest,
  UpdateStockOutResponse,
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
      queryClient.invalidateQueries({ queryKey: ["stockIns"] });

      handleApiSuccess("Stock-in created successfully");
    },
    onError: (error: Error) => {
      handleApiError(error, "Failed to create stock-in");
    },
  });
};

export const useCreateStockOut = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateStockOutResponse, Error, CreateStockOutRequest>({
    mutationFn: (payload: CreateStockOutRequest) =>
      inventoryService.createStockOut(payload),
    onSuccess: () => {
      // Invalidate and refetch inventory items after successful stock-out
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      queryClient.invalidateQueries({ queryKey: ["branchItems"] });
      queryClient.invalidateQueries({ queryKey: ["stockOuts"] });

      handleApiSuccess("Stock-out created successfully");
    },
    onError: (error: Error) => {
      handleApiError(error, "Failed to create stock-out");
    },
  });
};

export const useUpdateStockOut = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateStockOutResponse,
    Error,
    { id: string; payload: UpdateStockOutRequest }
  >({
    mutationFn: ({ id, payload }) =>
      inventoryService.updateStockOut(id, payload),
    onSuccess: (_, { id }) => {
      // Invalidate and refetch inventory items and specific stock-out
      queryClient.invalidateQueries({ queryKey: ["inventoryItems"] });
      queryClient.invalidateQueries({ queryKey: ["branchItems"] });
      queryClient.invalidateQueries({ queryKey: ["stockOuts"] });
      queryClient.invalidateQueries({ queryKey: ["stockOut", id] });
    },
    onError: (error: Error) => {
      console.error("Failed to update stock-out:", error.message);
    },
  });
};

export const useCreateMasterItem = () =>
  useMutation({
    mutationFn: createMasteritem,
  });

  export const useEditMasterItem = () =>
  useMutation({
    mutationFn: editMasteritem,
  });