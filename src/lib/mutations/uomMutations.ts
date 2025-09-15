import { useMutation } from "@tanstack/react-query";
import {createUOM, createUOMType} from "../services/uomServices";

export const useCreateUOMType = () =>
  useMutation({
    mutationFn: createUOMType,
  });
  export const useCreateUOM = () =>
  useMutation({
    mutationFn: createUOM,
  });