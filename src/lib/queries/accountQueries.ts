"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccount } from "../services/accountServices";

export const useGetAccount = () => {
  return useQuery({
    queryKey: ["account"],
    queryFn: () => getAccount(),
  });
};
