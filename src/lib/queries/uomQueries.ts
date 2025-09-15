"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAllUOMType,
  getAllUOM,
  getUOMsByTypeId,
  getUOMTypeById,
  getUOMById,
} from "../services/uomServices";

export const useGetAllUOMTypes = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["uomTypes", page, limit],
    queryFn: () => getAllUOMType(page, limit),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};

export const useGetUOMTypeById = (id: string) => {
  return useQuery({
    queryKey: ["uomType", id],
    queryFn: () => getUOMTypeById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};

export const useGetAllUOM = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["uom", page, limit],
    queryFn: () => getAllUOM(page, limit),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};

export const useGetUOMById = (id: string) => {
  return useQuery({
    queryKey: ["uom", id],
    queryFn: () => getUOMById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};

export const useGetUOMsByTypeId = (uomTypeId: string) => {
  return useQuery({
    queryKey: ["uomsByType", uomTypeId],
    queryFn: () => getUOMsByTypeId(uomTypeId),
    enabled: !!uomTypeId,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};
