import { useQuery } from '@tanstack/react-query';
import { requestService } from '@/lib/services/requestService';
import { RequestPaginationParams } from '@/lib/types/request';

// Query keys
export const requestQueryKeys = {
  all: ['requests'] as const,
  lists: () => [...requestQueryKeys.all, 'list'] as const,
  list: (params: RequestPaginationParams) => [...requestQueryKeys.lists(), params] as const,
  details: () => [...requestQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...requestQueryKeys.details(), id] as const,
};

// Get paginated requests
export function usePaginatedRequests(params: RequestPaginationParams) {
  return useQuery({
    queryKey: requestQueryKeys.list(params),
    queryFn: () => requestService.getRequests(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

// Get request by ID
export function useRequestById(id: string) {
  return useQuery({
    queryKey: requestQueryKeys.detail(id),
    queryFn: () => requestService.getRequestById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}