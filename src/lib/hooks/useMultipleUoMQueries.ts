import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { getUOMsByTypeId } from "../services/uomServices";
import { UoM } from "../types/uom";

interface UseMultipleUoMQueriesResult {
  uomsByType: Record<string, UoM[]>;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook to efficiently fetch UoMs for multiple UoM type IDs
 * Uses useQueries for dynamic hook calls based on the number of unique types
 */
export const useMultipleUoMQueries = (
  uomTypeIds: string[]
): UseMultipleUoMQueriesResult => {
  // Filter out empty strings and ensure uniqueness
  const validUomTypeIds = useMemo(
    () => [...new Set(uomTypeIds.filter(Boolean))],
    [uomTypeIds]
  );

  const queries = useQueries({
    queries: validUomTypeIds.map((typeId) => ({
      queryKey: ["uomsByType", typeId],
      queryFn: () => getUOMsByTypeId(typeId),
      staleTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false, // Reduce unnecessary refetches
      enabled: !!typeId,
    })),
  });

  const uomsByType = useMemo(() => {
    const map: Record<string, UoM[]> = {};

    validUomTypeIds.forEach((typeId, index) => {
      const queryResult = queries[index];
      if (queryResult?.data) {
        map[typeId] = queryResult.data.data;
      }
    });

    return map;
  }, [validUomTypeIds, queries]);

  const isLoading = queries.some((query) => query.isLoading);
  const error = queries.find((query) => query.error)?.error as Error | null;

  return {
    uomsByType,
    isLoading,
    error,
  };
};
