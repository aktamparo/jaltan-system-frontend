import { BASE_URL } from "../config";
import { User } from "../types/account";
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

export const createUser = async (userData: User) => {
  const payload = {
    email: userData.email,
    role: userData.role,
    status: userData.status,
    firstName: userData.employee.firstName,
    lastName: userData.employee.lastName,
    contactNumber: userData.employee.contactNumber,
  };

  const response = await fetch(`${BASE_URL}/account/create-account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};

export const updateUser = async (userData: User) => {
  const payload: {
    email?: string;
    role?: string;
    status?: string;
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
  } = {};

  if (userData.email) payload.email = userData.email;
  if (userData.role) payload.role = userData.role;
  if (userData.status) payload.status = userData.status;

  if (userData.employee) {
    if (userData.employee.firstName)
      payload.firstName = userData.employee.firstName;
    if (userData.employee.lastName)
      payload.lastName = userData.employee.lastName;
    if (userData.employee.contactNumber)
      payload.contactNumber = userData.employee.contactNumber;
  }

  const response = await fetch(`${BASE_URL}/account/${userData.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update user");
  }

  return response.json();
};
