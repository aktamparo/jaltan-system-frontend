// Request related types based on backend schema

export interface RequestItem {
  id: string;
  inventoryId: string;
  requestId: string;
  itemId: string;
  uomId: string;
  uomName: string;
  uomSymbol: string;
  quantity: number;
  convertedQuantity: number;
  name: string;
  currentQuantity: number;
  // Legacy structure for backward compatibility (might be present in some responses)
  uom?: {
    id: string;
    name: string;
    symbol: string;
    isBase: boolean;
    conversionFactor: number;
  };
  item?: {
    id: string;
    quantity: number;
    masterItem: {
      id: string;
      name: string;
      description: string;
      uomTypeId: string;
    };
  };
}

export interface Request {
  id: string;
  items: RequestItem[];
  status: RequestStatus;
  createdAt: string;
  createdById: string;
  createdBy: {
    id: string;
    employee: {
      firstName: string;
      lastName: string;
    };
  };
  modifiedAt: string;
  modifiedById: string;
  modifiedBy: {
    id: string;
    employee: {
      firstName: string;
      lastName: string;
    };
  };
  approvedAt?: string;
  approvedById?: string;
  approvedBy?: {
    id: string;
    employee: {
      firstName: string;
      lastName: string;
    };
  };
  cancelledAt?: string;
  cancelledById?: string;
  cancelledBy?: {
    id: string;
    employee: {
      firstName: string;
      lastName: string;
    };
  };
  comment?: string;
  remark?: string;
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  RESOLVED = 'RESOLVED',
  CANCELLED = 'CANCELLED'
}

// DTOs for API calls
export interface CreateRequestItemDto {
  itemId: string;
  quantity: number;
  uomId: string;
}

export interface CreateRequestDto {
  items: CreateRequestItemDto[];
  comment?: string;
}

export interface UpdateRequestDto {
  items?: CreateRequestItemDto[];
  comment?: string;
  remark?: string;
  status?: RequestStatus;
}

// Pagination response
export interface PaginatedRequestsResponse {
  data: Request[];
  metadata: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// Pagination params
export interface RequestPaginationParams {
  page: number;
  limit: number;
  search?: string;
  status?: RequestStatus;
}