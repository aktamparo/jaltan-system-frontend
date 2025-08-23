import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services/authService";

export const useLogin = () =>
  useMutation({
    mutationFn: authService.login,
  });

export const useLogout = () =>
  useMutation({
    mutationFn: authService.logout,
  });
