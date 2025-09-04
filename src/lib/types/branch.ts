
export interface Branch {
  id: string;
  name: string;
  street: string;
  city: string;
  province: string;
  zipCode: string;
}

export interface AllBranches{
  data: Branch[];
}