import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '@/lib/services/requestService';
import { CreateRequestDto, UpdateRequestDto } from '@/lib/types/request';
import { requestQueryKeys } from '@/lib/queries/requestQueries';

// Create request mutation
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRequestDto) => requestService.createRequest(data),
    onSuccess: () => {
      // Invalidate and refetch all request lists
      queryClient.invalidateQueries({ queryKey: requestQueryKeys.lists() });
    },
    onError: (error: Error) => {
      // Handle special success case where JSON parsing failed but request succeeded
      if (error.message === 'REQUEST_CREATED_SUCCESSFULLY') {
        // Treat as success - invalidate queries to refetch data
        queryClient.invalidateQueries({ queryKey: requestQueryKeys.lists() });
        // Don't re-throw the error since it's actually a success
        return;
      }
      // Re-throw actual errors
      throw error;
    },
  });
}

// Update request mutation
export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRequestDto }) =>
      requestService.updateRequest(id, data),
    onSuccess: (updatedRequest) => {
      // Invalidate and refetch all request lists
      queryClient.invalidateQueries({ queryKey: requestQueryKeys.lists() });
      
      // Update the specific request in cache
      queryClient.setQueryData(
        requestQueryKeys.detail(updatedRequest.id),
        updatedRequest
      );
    },
  });
}

// Delete request mutation
export function useDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => requestService.deleteRequest(id),
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch all request lists
      queryClient.invalidateQueries({ queryKey: requestQueryKeys.lists() });
      
      // Remove the specific request from cache
      queryClient.removeQueries({ queryKey: requestQueryKeys.detail(deletedId) });
    },
  });
}