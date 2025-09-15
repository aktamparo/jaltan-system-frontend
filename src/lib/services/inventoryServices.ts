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
} from "../types/inventory";

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
