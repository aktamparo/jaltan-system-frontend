export interface PaginationMetadata {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface MasterItem {
  id: string;
  name: string;
  description: string;
  uomTypeId: string;
  category: ("FRIDGE" | "PANTRY")[];
  createdAt: string;
  modifiedAt: string;
}

export interface Inventory {
  id: string;
  branchId: string;
}

export interface UOM {
  id: string;
  name: string;
  symbol: string;
}

export interface InventoryItem {
  id: string;
  quantity: number;
  createdAt: string;
  modifiedAt: string;
  masterItemId: string;
  inventoryId: string;
  masterItem: MasterItem;
  inventory: Inventory;
  uom: UOM;
}

export interface PaginatedInventoryResponse {
  metadata: PaginationMetadata;
  data: InventoryItem[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  branchId?: string;
}

// Stock In Types
export interface CreateStockInItem {
  itemId: string;
  uomId: string;
  quantity: number;
}

export interface CreateStockInRequest {
  items: CreateStockInItem[];
}

export interface StockInReceiptItem {
  stockInId: string;
  itemId: string;
  inventoryId: string;
  uomId: string;
  quantity: number;
  convertedQuantity: number;
  uomName: string;
}

export interface StockInReceipt {
  stockIn: {
    id: string;
    createdAt: string;
    createdById: string;
    modifiedAt: string;
    modifiedById: string;
  };
  items: StockInReceiptItem[];
}

export interface CreateStockInResponse {
  message: string;
  stockInReceipt: StockInReceipt;
}
