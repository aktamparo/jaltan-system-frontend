"use client";

import { useQuery } from "@tanstack/react-query";
import {getAllBranches } from "../services/branchServices";


export const useGetAllBranches = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["branches",page,limit],
    queryFn: () => getAllBranches(page, limit),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};
