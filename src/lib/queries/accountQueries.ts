"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccount, getAllAccounts } from "../services/accountServices";

export const useGetAccount = () => {
  return useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount(),
  });
};

export const useGetAllAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: () => getAllAccounts(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};
