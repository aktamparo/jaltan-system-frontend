import { BASE_URL } from "../config";
import {
  EditUomType,
  EditUoM,
  UomType,
  UoM,
  CreateUomTypeRequest,
  CreateUomTypeResponse,
  CreateUoMRequest,
  CreateUoMResponse,
  PaginatedUomTypesResponse,
  PaginatedUoMsResponse,
} from "../types/uom";

export const updateUoMType = async (UoMType: EditUomType) => {
  const payload: {
    type?: string;
    standardUoMId?: string;
  } = {};
  if (UoMType.type) payload.type = UoMType.type;
  if (UoMType.standardUoMId) payload.standardUoMId = UoMType.standardUoMId;

  const response = await fetch(`${BASE_URL}/uom/type/${UoMType.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update UoM Type");
  }

  return response.json();
};
export const updateUoM = async (UoM: EditUoM) => {
  const payload: {
    name?: string;
    symbol?: string;
    conversionFactor?: number;
    uomTypeId?: string;
  } = {};
  if (UoM.name) payload.name = UoM.name;
  if (UoM.symbol) payload.symbol = UoM.symbol;
  if (UoM.conversionFactor) payload.conversionFactor = UoM.conversionFactor;
  if (UoM.uomTypeId) payload.uomTypeId = UoM.uomTypeId;

  const response = await fetch(`${BASE_URL}/uom/${UoM.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update UoM Type");
  }

  return response.json();
};


export const createUOMType = async (
  uomData: CreateUomTypeRequest
): Promise<CreateUomTypeResponse> => {
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

export const createUOM = async (
  uomData: CreateUoMRequest
): Promise<CreateUoMResponse> => {
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

export const getAllUOMType = async (
  page = 1,
  limit = 10
): Promise<PaginatedUomTypesResponse> => {
  const response = await fetch(
    `${BASE_URL}/uom/type?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch UOM Types");
  }

  const data = await response.json();
  return data;
};

export const getUOMTypeById = async (id: string): Promise<UomType> => {
  const response = await fetch(`${BASE_URL}/uom/type/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch UOM Type");
  }

  const data = await response.json();
  return data;
};

export const getAllUOM = async (
  page = 1,
  limit = 10
): Promise<PaginatedUoMsResponse> => {
  const response = await fetch(`${BASE_URL}/uom?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch UOMs");
  }

  const data = await response.json();
  return data;
};

export const getUOMById = async (id: string): Promise<UoM> => {
  const response = await fetch(`${BASE_URL}/uom/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch UOM");
  }

  const data = await response.json();
  return data;
};

// Get UoMs by UoM Type ID - this will fetch a UoM type and return its associated UoMs
export const getUOMsByTypeId = async (uomTypeId: string): Promise<UoM[]> => {
  const uomType = await getUOMTypeById(uomTypeId);
  return uomType.uoms || [];
};
