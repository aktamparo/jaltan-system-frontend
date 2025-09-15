"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccount, getAllAccounts } from "../services/accountServices";

export const useGetAccount = () => {
  return useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount(),
  });
};

export const useGetAllAccounts = (page =1) => {
  return useQuery({
    queryKey: ["accounts",page],
    queryFn: () => getAllAccounts(page),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });
};
