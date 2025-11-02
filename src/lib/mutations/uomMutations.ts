import { useMutation } from "@tanstack/react-query";
import {
  createUOM,
  updateUoM,
  createUOMWithType,
  updateUoMType,
  
} from "../services/uomServices";

export const useCreateUOMWithType = () =>
  useMutation({
    mutationFn: createUOMWithType,
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