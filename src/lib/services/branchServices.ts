import { BASE_URL } from "../config";
import { Branch, BranchCreatePayload } from "../types/branch";

export const getAllBranches = async (page = 1, limit = 10) => {
  const response = await fetch(`${BASE_URL}/branch?page=${page}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch branch details");
  }

  const data = await response.json();
  return data;
};

export const updateBranch = async (branchData: Branch) => {
  const payload: {
    name?: string;
    street?: string;
    city?: string;
    province?: string;
    zipCode?: string;
  } = {};

  if (branchData.name) payload.name = branchData.name;
  if (branchData.street) payload.street = branchData.street;
  if (branchData.city) payload.city = branchData.city;
  if (branchData.province) payload.province = branchData.province;
  if (branchData.zipCode) payload.zipCode = branchData.zipCode;

  const response = await fetch(`${BASE_URL}/branch/${branchData.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update branch");
  }

  return response.json();
};

export const createBranch = async (branchData: BranchCreatePayload) => {
  const payload = { ...branchData };
  const response = await fetch(`${BASE_URL}/branch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  let errorMsg = "Failed to create branch";
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