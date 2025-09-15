export interface CurrentUser {
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

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "STAFF";
  status: "ACTIVE" | "INACTIVE";
  employee: {
    firstName: string;
    lastName: string;
    contactNumber: string;
    branch: {
      name?: string;
      id?: string;
    };
  };
}

export interface AllUsers {
  data: User[];
}

export interface UserCreatePayload {
  email: string;
  password: string;
  role: "ADMIN" | "STAFF";
  status: "ACTIVE" | "INACTIVE";
  firstName: string;
  lastName: string;
  contactNumber: string;
  branchId: string;
}
