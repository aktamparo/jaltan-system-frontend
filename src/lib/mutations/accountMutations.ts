import { useMutation } from "@tanstack/react-query";
import { createUser, updateUser, updateUserByAdmin } from "../services/accountServices";

export const useCreateUser = () =>
  useMutation({
    mutationFn: createUser,
  });

export const useUpdateUser = () =>
  useMutation({
    mutationFn: updateUser,
  });

export const useUpdateUserByAdmin = () =>
  useMutation({
    mutationFn: updateUserByAdmin,
  });
