import { useMutation } from "@tanstack/react-query";
import {
  createUOM,
  createUOMType,
  updateUoMType,
} from "../services/uomServices";

export const useCreateUOMType = () =>
  useMutation({
    mutationFn: createUOMType,
  });
export const useUpdateUoMType = () =>
  useMutation({
    mutationFn: updateUoMType,
  });
export const useCreateUOM = () =>
  useMutation({
    mutationFn: createUOM,
  });
