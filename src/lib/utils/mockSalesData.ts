import { SalesSummary } from "@/lib/types/sales";

// Mock data for testing charts when backend is not available
export const mockSalesData: SalesSummary = {
  totalRevenue: 156750.50,
  transactionCount: 245,
  averageOrderValue: 639.80,
  topSellingItems: [
    {
      itemName: "Premium Coffee Beans",
      category: "BEVERAGES",
      totalQuantity: 85,
      totalRevenue: 12750.00
    },
    {
      itemName: "Fresh Croissants",
      category: "BAKERY",
      totalQuantity: 72,
      totalRevenue: 8640.00
    },
    {
      itemName: "Organic Milk",
      category: "DAIRY",
      totalQuantity: 68,
      totalRevenue: 4080.00
    },
    {
      itemName: "Artisan Bread",
      category: "BAKERY",
      totalQuantity: 55,
      totalRevenue: 6600.00
    },
    {
      itemName: "Energy Drinks",
      category: "BEVERAGES",
      totalQuantity: 45,
      totalRevenue: 6750.00
    }
  ],
  paymentMethodBreakdown: [
    {
      paymentMethod: "Cash",
      count: 128,
      totalAmount: 78420.25
    },
    {
      paymentMethod: "Credit Card",
      count: 89,
      totalAmount: 56890.50
    },
    {
      paymentMethod: "Digital Wallet",
      count: 28,
      totalAmount: 21439.75
    }
  ],
  dailySalesTrends: [
    { date: "2025-09-14", totalRevenue: 5200.00, transactionCount: 8 },
    { date: "2025-09-15", totalRevenue: 6800.00, transactionCount: 12 },
    { date: "2025-09-16", totalRevenue: 4900.00, transactionCount: 7 },
    { date: "2025-09-17", totalRevenue: 7200.00, transactionCount: 14 },
    { date: "2025-09-18", totalRevenue: 8100.00, transactionCount: 16 },
    { date: "2025-09-19", totalRevenue: 6500.00, transactionCount: 11 },
    { date: "2025-09-20", totalRevenue: 5800.00, transactionCount: 9 },
    { date: "2025-09-21", totalRevenue: 7600.00, transactionCount: 13 },
    { date: "2025-09-22", totalRevenue: 8900.00, transactionCount: 18 },
    { date: "2025-09-23", totalRevenue: 6200.00, transactionCount: 10 },
    { date: "2025-09-24", totalRevenue: 7800.00, transactionCount: 15 },
    { date: "2025-09-25", totalRevenue: 9200.00, transactionCount: 19 },
    { date: "2025-09-26", totalRevenue: 5400.00, transactionCount: 8 },
    { date: "2025-09-27", totalRevenue: 6900.00, transactionCount: 12 },
    { date: "2025-09-28", totalRevenue: 8500.00, transactionCount: 17 },
    { date: "2025-09-29", totalRevenue: 7100.00, transactionCount: 14 },
    { date: "2025-09-30", totalRevenue: 6600.00, transactionCount: 11 },
    { date: "2025-10-01", totalRevenue: 8200.00, transactionCount: 16 },
    { date: "2025-10-02", totalRevenue: 7900.00, transactionCount: 15 },
    { date: "2025-10-03", totalRevenue: 6100.00, transactionCount: 9 },
    { date: "2025-10-04", totalRevenue: 8800.00, transactionCount: 18 },
    { date: "2025-10-05", totalRevenue: 9100.00, transactionCount: 19 },
    { date: "2025-10-06", totalRevenue: 7400.00, transactionCount: 13 },
    { date: "2025-10-07", totalRevenue: 6800.00, transactionCount: 12 },
    { date: "2025-10-08", totalRevenue: 8600.00, transactionCount: 17 },
    { date: "2025-10-09", totalRevenue: 7200.00, transactionCount: 14 },
    { date: "2025-10-10", totalRevenue: 6500.00, transactionCount: 10 },
    { date: "2025-10-11", totalRevenue: 8400.00, transactionCount: 16 },
    { date: "2025-10-12", totalRevenue: 9000.00, transactionCount: 18 },
    { date: "2025-10-13", totalRevenue: 7700.00, transactionCount: 15 }
  ]
};