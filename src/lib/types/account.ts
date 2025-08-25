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
      name: string;
    };
  };
}

export interface AllUsers {
  data: User[];
}
