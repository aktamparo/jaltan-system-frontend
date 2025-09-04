import { useMutation } from "@tanstack/react-query";
import { createBranch,updateBranch } from "../services/branchServices";

export const useCreateBranch = () =>
  useMutation({
    mutationFn: createBranch,
  });

export const useUpdateBranch = () =>
  useMutation({
    mutationFn: updateBranch,
  });
