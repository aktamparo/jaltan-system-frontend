import { BASE_URL } from "../config";
import { Branch } from "../types/branch";

export const getAllBranches = async () => {
  const response = await fetch(`${BASE_URL}/branch`, {
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