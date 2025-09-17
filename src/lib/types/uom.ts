export interface UomType {
  id: string;
  type: string;
  standardUoMId?: string;
  uoms?: UoM[];
  standardUoM?: UoM;
}

export interface UoM {
  id: string;
  name: string;
  symbol: string;
  isBase: boolean;
  conversionFactor: number;
  createdAt: string;
  modifiedAt: string;
  uomTypeId: string;
  uomType?: UomType;
}
export interface EditUoM {
  id: string;
  name?: string;
  symbol?: string;
  conversionFactor?: number;
  uomTypeId?: string;
}

export interface EditUomType {
  id: string;
  type?: string;
  standardUoMId?: string;
}
export interface CreateUomTypeRequest {
  type: string;
  standardUoMId?: string;
}

export interface CreateUomTypeResponse {
  message: string;
  UomType: UomType;
}

export interface UpdateUomTypeRequest {
  type?: string;
  standardUoMId?: string;
}

export interface CreateUoMRequest {
  name: string;
  symbol: string;
  conversionFactor: number;
  uomTypeId: string;
}

export interface CreateUoMResponse {
  message: string;
  uom: UoM;
}

export interface UpdateUoMRequest {
  name?: string;
  symbol?: string;
  conversionFactor?: number;
  uomTypeId?: string;
}

export interface PaginatedUomTypesResponse {
  metadata: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data: UomType[];
}

export interface PaginatedUoMsResponse {
  metadata: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
  data: UoM[];
}
