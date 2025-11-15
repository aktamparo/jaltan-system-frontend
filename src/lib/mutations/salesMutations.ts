import { useMutation, useQueryClient } from "@tanstack/react-query";
import { salesServices } from "@/lib/services/salesServices";

// Upload CSV sales data
export const useUploadCSV = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => salesServices.uploadCSV(file),
    onSuccess: () => {
      // Invalidate sales data to refresh after upload
      queryClient.invalidateQueries({ queryKey: ["salesSummary"] });
      queryClient.invalidateQueries({ queryKey: ["salesList"] });
      queryClient.invalidateQueries({ queryKey: ["salesUploads"] });
    },
  });
};

// Delete sales by CSV filename (legacy - kept for backwards compatibility)
export const useDeleteSalesByCSV = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (csvFileName: string) => salesServices.deleteSalesByCSV(csvFileName),
    onSuccess: () => {
      // Invalidate sales data to refresh after deletion
      queryClient.invalidateQueries({ queryKey: ["salesSummary"] });
      queryClient.invalidateQueries({ queryKey: ["salesList"] });
      queryClient.invalidateQueries({ queryKey: ["salesUploads"] });
    },
  });
};

// Delete sales by upload ID (NEW - preferred method)
export const useDeleteSalesByUploadId = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (uploadId: string) => salesServices.deleteSalesByUploadId(uploadId),
    onSuccess: () => {
      // Invalidate sales data to refresh after deletion
      queryClient.invalidateQueries({ queryKey: ["salesSummary"] });
      queryClient.invalidateQueries({ queryKey: ["salesList"] });
      queryClient.invalidateQueries({ queryKey: ["salesUploads"] });
    },
  });
};