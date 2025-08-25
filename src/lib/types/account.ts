export interface User {
  account: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    branch?: string;
    role: "ADMIN" | "STAFF";
    status: "ACTIVE" | "INACTIVE";
  };
} // both current user
