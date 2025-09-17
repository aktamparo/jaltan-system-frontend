import { useMutation } from "@tanstack/react-query";
import {
  createUOM,
  updateUoM,
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
export const useUpdateUoM = () =>
  useMutation({
    mutationFn: updateUoM,
  });
export const useCreateUOM = () =>
  useMutation({
    mutationFn: createUOM,
  });
export const useUpdateUOM = () =>
  useMutation({
    mutationFn: updateUoM,
  });