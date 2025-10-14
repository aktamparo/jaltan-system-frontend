"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetSalesSummary } from "@/lib/queries/salesQueries";
import { salesServices } from "@/lib/services/salesServices";
import SummaryCards from "@/components/sales/SummaryCards";
import SalesTrendChart from "@/components/sales/SalesTrendChart";
import TopItemsChart from "@/components/sales/TopItemsChart";
import PaymentMethodChart from "@/components/sales/PaymentMethodChart";
import CSVUpload from "@/components/sales/CSVUpload";
import SalesDataTable from "@/components/sales/SalesDataTable";
import { mockSalesData } from "@/lib/utils/mockSalesData";
import { BackendSalesSummary, SalesSummary } from "@/lib/types/sales";

// Transform backend response to frontend format
const transformBackendData = (backendData: BackendSalesSummary): SalesSummary => {
  return {
    totalRevenue: backendData.totalRevenue,
    transactionCount: backendData.totalTransactions, // Backend uses totalTransactions
    averageOrderValue: backendData.averageOrderValue,
    topSellingItems: backendData.topSellingItems.map(item => ({
      itemName: item.itemName,
      category: "General", // Default category since backend doesn't provide it
      totalQuantity: item.totalQuantity,
      totalRevenue: item.totalRevenue
    })),
    paymentMethodBreakdown: backendData.salesByPaymentMethod.map(item => ({
      paymentMethod: item.paymentMethod,
      count: item.transactionCount, // Backend uses transactionCount
      totalAmount: item.totalAmount
    })),
    dailySalesTrends: backendData.salesByDate.map(item => ({
      date: item.date,
      totalRevenue: item.totalAmount, // Backend uses totalAmount
      transactionCount: item.transactionCount
    }))
  };
};

type TabType = "analytics" | "data" | "upload";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<TabType>("analytics");
  const [startDate, setStartDate] = useState("2024-10-01"); // Set to 2024 to match your data
  const [endDate, setEndDate] = useState("2024-10-31"); // Set to 2024 to match your data
  const [directApiData, setDirectApiData] = useState<BackendSalesSummary | null>(null);
  const [directApiLoading, setDirectApiLoading] = useState(false);

  const { data: summary, isLoading, error, refetch } = useGetSalesSummary({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // Fetch data directly to ensure we get the latest backend response
  useEffect(() => {
    setDirectApiLoading(true);
    salesServices.getSummary({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }).then((result: BackendSalesSummary) => {
      setDirectApiData(result);
      setDirectApiLoading(false);
    }).catch((err) => {
      console.error("Sales API error:", err);
      setDirectApiLoading(false);
    });
  }, [startDate, endDate]);

  // Transform backend data to match frontend interface
  let displayData: SalesSummary | undefined;
  let actualIsLoading = isLoading || directApiLoading;
  
  if (directApiData) {
    // Use direct API data (primary source)
    displayData = transformBackendData(directApiData);
    actualIsLoading = directApiLoading;
  } else if (summary) {
    // Use React Query data (fallback)
    displayData = transformBackendData(summary);
  } else if (!actualIsLoading) {
    // Use mock data as last resort when no data is available and not loading
    displayData = mockSalesData;
  }

  // Quick check for debugging
  if (displayData) {
    console.log("Display data for charts:", {
      hasData: !!displayData,
      totalRevenue: displayData.totalRevenue,
      topItemsCount: displayData.topSellingItems?.length,
      paymentMethodsCount: displayData.paymentMethodBreakdown?.length,
      trendsCount: displayData.dailySalesTrends?.length
    });
  }

  const handleDateFilterChange = () => {
    refetch();
  };

  const resetDateFilter = () => {
    // Reset to a date range that includes your 2024 data
    setStartDate("2024-01-01");
    setEndDate("2024-12-31");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Management</h1>
          <p className="text-gray-600">
            Analyze sales performance, manage data, and upload new records
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "analytics"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📊 Analytics Dashboard
            </button>
            <button
              onClick={() => setActiveTab("data")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "data"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📋 Sales Data
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "upload"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📤 Upload CSV
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Date Filter for Analytics */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Date Range:</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-auto"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-auto"
                  />
                </div>
                <Button onClick={handleDateFilterChange} size="sm">
                  Apply Filter
                </Button>
                <Button onClick={resetDateFilter} variant="outline" size="sm">
                  All 2024 Data
                </Button>
              </div>
            </div>

            {/* Error State */}
            {error && !displayData && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 font-medium mb-2">
                  Error loading analytics: {error.message}
                </p>
                {error.message === "Unauthorized" && (
                  <p className="text-sm text-red-500">
                    You may not have permission to access sales data, or you need to log in again.
                  </p>
                )}
                {error.message.includes("404") && (
                  <p className="text-sm text-red-500">
                    Sales endpoints may not be implemented in the backend yet.
                  </p>
                )}
                <Button onClick={() => refetch()} className="mt-2" size="sm">
                  Retry
                </Button>
              </div>
            )}

            {/* Summary Cards */}
            <SummaryCards summary={displayData} isLoading={actualIsLoading} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Trend Chart */}
              <div className="lg:col-span-2">
                <SalesTrendChart 
                  data={displayData?.dailySalesTrends ?? []} 
                  isLoading={isLoading} 
                />
              </div>

              {/* Top Items Chart */}
              <div>
                <TopItemsChart 
                  data={displayData?.topSellingItems ?? []} 
                  isLoading={isLoading} 
                />
              </div>

              {/* Payment Methods Chart */}
              <div>
                <PaymentMethodChart 
                  data={displayData?.paymentMethodBreakdown ?? []} 
                  isLoading={isLoading} 
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "data" && (
          <div>
            <SalesDataTable />
          </div>
        )}

        {activeTab === "upload" && (
          <div>
            <CSVUpload />
          </div>
        )}
      </div>
    </div>
  );
}