import { BASE_URL } from "../config";
export const getAccount = async () => {
  const response = await fetch(`${BASE_URL}/account/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch account details");
  }

  const data = await response.json();
  return data;
};

export const getAllAccounts = async () => {
  const response = await fetch(`${BASE_URL}/account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch account details");
  }

  const data = await response.json();
  return data;
};
