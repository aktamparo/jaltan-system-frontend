import { BASE_URL } from "../config";
import {
  PaginatedInventoryResponse,
  PaginationParams,
  CreateStockInRequest,
  CreateStockInResponse,
  CreateStockOutRequest,
  CreateStockOutResponse,
  UpdateStockOutRequest,
  UpdateStockOutResponse,
  StockOut,
  PaginatedStockOutResponse,
  CreateMasterItem
} from "../types/inventory";


export const createMasteritem = async (itemData : CreateMasterItem) => {
  const payload = { 
    name:itemData.name,
    description:itemData.description,
    category:itemData.category,
     uomTypeId:itemData.uomTypeId };
  const response = await fetch(`${BASE_URL}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  let errorMsg = "Failed to create Item";
  if (!response.ok) {
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMsg = Array.isArray(errorData.message)
          ? errorData.message.join(", ")
          : errorData.message;
      }
    } catch {
      // fallback if response is not JSON
    }
    throw new Error(errorMsg);
  }

  return response.json();
};

export const getAllMasteritems = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/inventory/master-items?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch master items");
  }

  const data = await response.json();
  return data;
};

export const inventoryService = {
  getAllBranchItems: async (page: number) => {
    const response = await fetch(`${BASE_URL}/inventory/items?page=${page}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch branch items");
    }
    const data = await response.json();
    return data;
  },

  getPaginatedInventoryItems: async (
    params: PaginationParams
  ): Promise<PaginatedInventoryResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.branchId) searchParams.append("branchId", params.branchId);

    const response = await fetch(
      `${BASE_URL}/inventory/items?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch paginated inventory items");
    }

    const data: PaginatedInventoryResponse = await response.json();
    return data;
  },

  createStockIn: async (
    payload: CreateStockInRequest
  ): Promise<CreateStockInResponse> => {
    const response = await fetch(`${BASE_URL}/stock-in`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create stock-in");
    }

    const data: CreateStockInResponse = await response.json();
    return data;
  },

  // Stock Out Services
  createStockOut: async (
    payload: CreateStockOutRequest
  ): Promise<CreateStockOutResponse> => {
    const response = await fetch(`${BASE_URL}/stock-out`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create stock-out");
    }

    const data: CreateStockOutResponse = await response.json();
    return data;
  },

  updateStockOut: async (
    id: string,
    payload: UpdateStockOutRequest
  ): Promise<UpdateStockOutResponse> => {
    const response = await fetch(`${BASE_URL}/stock-out/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to update stock-out");
    }

    const data: UpdateStockOutResponse = await response.json();
    return data;
  },

  getStockOutById: async (id: string): Promise<StockOut> => {
    const response = await fetch(`${BASE_URL}/stock-out/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch stock-out");
    }

    const data: StockOut = await response.json();
    return data;
  },

  getAllStockOuts: async (
    params: PaginationParams
  ): Promise<PaginatedStockOutResponse> => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    const response = await fetch(
      `${BASE_URL}/stock-out?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch stock-outs");
    }

    const data: PaginatedStockOutResponse = await response.json();
    return data;
  },
};
