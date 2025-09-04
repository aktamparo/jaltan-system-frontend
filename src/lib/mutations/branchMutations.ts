import { useMutation } from "@tanstack/react-query";
import { updateBranch } from "../services/branchServices";

// export const useCreateUser = () =>
//   useMutation({
//     mutationFn: createUser,
//   });

export const useUpdateBranch = () =>
  useMutation({
    mutationFn: updateBranch,
  });
