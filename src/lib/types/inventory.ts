export interface StockInReceiptUser {
  id: string;
  email: string;
  role: "ADMIN" | "STAFF";
  status: "ACTIVE" | "INACTIVE";
  employee: {
    firstName: string;
    lastName: string;
  };
}

export interface StockInReceiptItem {
  id: string;
  referenceNumber: string
  inventoryId: string;
  stockInId: string;
  itemId: string;
  uomId: string;
  uomName: string;
  uomSymbol: string;
  quantity: number;
  convertedQuantity: number;
  name: string;
  currentQuantity: number;
}

export interface StockInReceipt {
  id: string;
  referenceNumber: string;
  createdAt: string;
  createdById: string;
  modifiedAt: string;
  modifiedById: string;
  createdBy: StockInReceiptUser;
  modifiedBy: StockInReceiptUser;
  items: StockInReceiptItem[];
}

export interface PaginatedStockInResponse {
  metadata: PaginationMetadata;
  data: StockInReceipt[];
}

export interface StockOutReceiptUser {
  id: string;
  email: string;
  role: "ADMIN" | "STAFF";
  status: "ACTIVE" | "INACTIVE";
  employee: {
    firstName: string;
    lastName: string;
  };
}

export interface StockOutReceiptItem {
  id: string;
  referenceNumber: string;
  inventoryId: string;
  stockOutId: string;
  itemId: string;
  uomId: string;
  uomName: string;
  uomSymbol: string;
  quantity: number;
  convertedQuantity: number;
  isDamagedGoods: boolean;
  comment: string | null;
  name: string;
  currentQuantity: number;
}

export interface StockOutReceipt {
  id: string;
  referenceNumber: string;
  createdAt: string;
  createdById: string;
  modifiedAt: string;
  modifiedById: string;
  createdBy: StockOutReceiptUser;
  modifiedBy: StockOutReceiptUser;
  items: StockOutReceiptItem[];
}

export interface PaginatedStockOutResponse {
  metadata: PaginationMetadata;
  data: StockOutReceipt[];
}
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
export interface CreateMasterItem {
  name: string;
  description: string;
  category: ("FRIDGE" | "PANTRY")[];
  uomTypeId: string;
}

export interface EditMasterItem {
  id: string;
  name: string;
  description: string;
  category: ("FRIDGE" | "PANTRY")[];
  uomTypeId: string;
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

export interface UpdateStockInRequest {
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

// Stock Out Types
export interface CreateStockOutItem {
  itemId: string;
  uomId: string;
  quantity: number;
  isDamagedGoods: boolean;
  comment?: string;
}

export interface CreateStockOutRequest {
  items: CreateStockOutItem[];
}

export interface UpdateStockOutRequest {
  items: CreateStockOutItem[];
}

export interface StockOutReceiptItem {
  stockOutId: string;
  itemId: string;
  inventoryId: string;
  uomId: string;
  quantity: number;
  convertedQuantity: number;
  isDamagedGoods: boolean;
  comment: string | null;
  uomName: string;
  uomSymbol: string;
}

export interface StockOutReceipt {
  stockOut: {
    id: string;
    createdAt: string;
    createdById: string;
    modifiedAt: string;
    modifiedById: string;
  };
  items: StockOutReceiptItem[];
}

export interface CreateStockOutResponse {
  message: string;
  stockOutReceipt: StockOutReceipt;
}

export interface StockOutItem {
  id: string;
  inventoryId: string;
  stockOutId: string;
  itemId: string;
  uomId: string;
  uomName: string;
  uomSymbol: string;
  quantity: number;
  convertedQuantity: number;
  isDamagedGoods: boolean;
  comment: string | null;
  name: string;
  currentQuantity: number;
}

export interface Account {
  id: string;
  email: string;
  role: "ADMIN" | "STAFF";
  status: "ACTIVE" | "INACTIVE";
  employee: {
    firstName: string;
    lastName: string;
  };
}

export interface StockOut {
  id: string;
  createdAt: string;
  createdById: string;
  modifiedAt: string;
  modifiedById: string;
  createdBy?: Account;
  modifiedBy?: Account;
  items: StockOutItem[];
}

export interface PaginatedStockOutResponse {
  metadata: PaginationMetadata;
  data: StockOutReceipt[];
}

export interface UpdateStockOutResponse {
  id: string;
  createdAt: string;
  createdById: string;
  modifiedAt: string;
  modifiedById: string;
  items: StockOutItem[];
}
