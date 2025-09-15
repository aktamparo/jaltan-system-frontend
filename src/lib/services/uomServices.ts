import { BASE_URL } from "../config";
import { UomType,Uom } from "../types/uom";

export const createUOMType = async (uomData: UomType) => {
  const payload = {
    type: uomData.type,
    ...(uomData.standardUoMId && { standardUoMId: uomData.standardUoMId }),
  };

  const response = await fetch(`${BASE_URL}/uom/type`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create UOM type");
  }

  return response.json();
};


export const createUOM = async (uomData: Uom) => {
  const payload = {
    name: uomData.name,
    symbol: uomData.symbol,
    conversionFactor: uomData.conversionFactor,
    uomTypeId: uomData.uomTypeId,
  };

  const response = await fetch(`${BASE_URL}/uom`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create UOM");
  }

  return response.json();
};

export const getAllUOMType = async (page = 1, limit=10) => {
  const response = await fetch(`${BASE_URL}/uom/type?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch UOM Types");
  }

  const data = await response.json();
  return data;
};

export const getAllUOM = async (page = 1, limit=10) => {
  const response = await fetch(`${BASE_URL}/uom?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch UOM Types");
  }

  const data = await response.json();
  return data;
};