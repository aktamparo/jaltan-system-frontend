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