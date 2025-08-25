import { useMutation } from "@tanstack/react-query";
import { createUser, updateUser } from "../services/accountServices";

export const useCreateUser = () =>
  useMutation({
    mutationFn: createUser,
  });

export const useUpdateUser = () =>
  useMutation({
    mutationFn: updateUser,
  });
