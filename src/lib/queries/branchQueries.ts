"use client";

import { useQuery } from "@tanstack/react-query";
import {getAllBranches } from "../services/branchServices";


export const useGetAllBranches = () => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: () => getAllBranches(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};
