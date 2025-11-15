import { BASE_URL } from "../config";
import { User,UserCreatePayload } from "../types/account";

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

export const getAllAccounts = async (page = 1) => {
  const response = await fetch(`${BASE_URL}/account?page=${page}`, {
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

export const createUser = async (userData: UserCreatePayload) => {
  const payload = {
    email: userData.email,
    password: userData.password,
    role: userData.role,
    status: userData.status,
    firstName: userData.firstName,
    lastName: userData.lastName,
    contactNumber: userData.contactNumber,
    branchId: userData.branchId,
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

export const updateUser = async (userData: any) => {
  const payload: {
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
    branchId?: string;
  } = {};

  if (userData.firstName !== undefined) payload.firstName = userData.firstName;
  if (userData.lastName !== undefined) payload.lastName = userData.lastName;
  if (userData.contactNumber !== undefined) payload.contactNumber = userData.contactNumber;
  if (userData.branchId !== undefined) payload.branchId = userData.branchId;

  // Use /account/me endpoint for users updating their own profile
  const response = await fetch(`${BASE_URL}/account/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user");
  }

  return response.json();
};

export const updateUserByAdmin = async (userData: User) => {
  const payload: {
    email?: string;
    role?: string;
    status?: string;
    firstName?: string;
    lastName?: string;
    contactNumber?: string;
    branchId?: string;
  } = {};

  if (userData.email !== undefined) payload.email = userData.email;
  if (userData.role !== undefined) payload.role = userData.role;
  if (userData.status !== undefined) payload.status = userData.status;

  if (userData.employee) {
    if (userData.employee.firstName !== undefined)
      payload.firstName = userData.employee.firstName;
    if (userData.employee.lastName !== undefined)
      payload.lastName = userData.employee.lastName;
    if (userData.employee.contactNumber !== undefined)
      payload.contactNumber = userData.employee.contactNumber;
    if (userData.employee.branch && userData.employee.branch.id !== undefined)
      payload.branchId = userData.employee.branch.id;
  }

  // Use /account/:id endpoint for admins updating other users
  const response = await fetch(`${BASE_URL}/account/${userData.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user");
  }

  return response.json();
};
