import { BASE_URL } from "../config";

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await fetch(`${BASE_URL}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login failed");
    }

    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${BASE_URL}/auth/signout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Logout failed");
    }

    return res.json();
  },
};

export const changePassword = {
  change: async (credentials: { currentPassword: string; newPassword: string }) => {
    const res = await fetch(`${BASE_URL}/auth/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Change password failed");
    }

    return res.json();
  }
};

