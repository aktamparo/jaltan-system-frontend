import { BASE_URL } from "../config";
import {
  PaginatedInventoryResponse,
  PaginationParams,
  CreateStockInRequest,
  CreateStockInResponse,
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
};
