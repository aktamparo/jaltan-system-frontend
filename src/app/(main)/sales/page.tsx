"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePickerInput from "@/components/ui/date-picker";
import { format, startOfToday, subDays, startOfMonth, endOfMonth, subMonths, startOfYear } from 'date-fns'
import { useGetSalesSummary } from "@/lib/queries/salesQueries";
import { salesServices } from "@/lib/services/salesServices";
import SummaryCards from "@/components/sales/SummaryCards";
import SalesTrendChart from "@/components/sales/SalesTrendChart";
import TopItemsChart from "@/components/sales/TopItemsChart";
import PaymentMethodChart from "@/components/sales/PaymentMethodChart";
import CSVUpload from "@/components/sales/CSVUpload";
import SalesDataTable from "@/components/sales/SalesDataTable";
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
  const [startDate, setStartDate] = useState(""); // Start empty for custom
  const [endDate, setEndDate] = useState(""); // Start empty for custom
  const [preset, setPreset] = useState<string>("Custom")
  const [directApiData, setDirectApiData] = useState<BackendSalesSummary | null>(null);
  const [directApiLoading, setDirectApiLoading] = useState(false);

  const { data: summary, isLoading, error, refetch } = useGetSalesSummary({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // Fetch data directly to ensure we get the latest backend response
  useEffect(() => {
    console.log("Fetching sales data with date range:", { startDate, endDate });
    setDirectApiLoading(true);
    salesServices.getSummary({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }).then((result: BackendSalesSummary) => {
      console.log("Sales API response:", result);
      console.log("Data points returned:", result.salesByDate?.length || 0);
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
  }
  // No mock data fallback - show empty state when no data is available

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
    // kept for backward-compat but no-op; auto-refetch is handled via effect below
  };

  // Auto-apply: whenever both startDate and endDate are set, refetch data
  useEffect(() => {
    if (startDate && endDate) {
      refetch();
    }
  }, [startDate, endDate, refetch]);

  const applyPreset = (p: string) => {
    const today = startOfToday()
    let s = startDate
    let e = endDate

    switch (p) {
      case 'Today':
        s = format(today, 'yyyy-MM-dd')
        e = format(today, 'yyyy-MM-dd')
        break
      case 'Yesterday': {
        const y = subDays(today, 1)
        s = format(y, 'yyyy-MM-dd')
        e = format(y, 'yyyy-MM-dd')
        break
      }
      case 'Last 7 Days':
        s = format(subDays(today, 6), 'yyyy-MM-dd')
        e = format(today, 'yyyy-MM-dd')
        break
      case 'Last 30 Days':
        s = format(subDays(today, 29), 'yyyy-MM-dd')
        e = format(today, 'yyyy-MM-dd')
        break
      case 'This Month':
        s = format(startOfMonth(today), 'yyyy-MM-dd')
        e = format(today, 'yyyy-MM-dd')
        break
      case 'Last Month': {
        const lm = subMonths(today, 1)
        s = format(startOfMonth(lm), 'yyyy-MM-dd')
        e = format(endOfMonth(lm), 'yyyy-MM-dd')
        break
      }
      case 'This Year':
        s = format(startOfYear(today), 'yyyy-MM-dd')
        e = format(today, 'yyyy-MM-dd')
        break
      case 'Custom':
      default:
        // Clear dates for custom - user will input their own
        s = ''
        e = ''
        break
    }

    setStartDate(s)
    setEndDate(e)
    setPreset(p)
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-medium m-0">Sales</h1>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex border-b">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "analytics"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Analytics Dashboard
            </button>
            <button
              onClick={() => setActiveTab("data")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "data"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Sales Data
            </button>
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "upload"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Upload CSV
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* Date Filter for Analytics */}
            <div className="mb-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Date Range:</label>

                  <div className="relative inline-block">
                    <select
                      value={preset}
                      onChange={(e) => applyPreset(e.target.value)}
                      className="h-9 rounded-md border px-3 pr-8 bg-white"
                    >
                      <option>Custom</option>
                      <option>Today</option>
                      <option>Yesterday</option>
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>This Month</option>
                      <option>Last Month</option>
                      <option>This Year</option>
                    </select>
                  </div>

                  {preset === 'Custom' && (
                    <>
                      <DatePickerInput
                        value={startDate}
                        onChange={(iso) => { setStartDate(iso); setPreset('Custom') }}
                        placeholder="MMM/dd/yyyy"
                      />
                      <span className="text-gray-500">to</span>
                      <DatePickerInput
                        value={endDate}
                        onChange={(iso) => { setEndDate(iso); setPreset('Custom') }}
                        placeholder="MMM/dd/yyyy"
                      />
                    </>
                  )}
                </div>
                {/* Date range is custom and applies automatically when both dates are set */}
              </div>
            </div>

            {/* Prompt to select dates when both are empty */}
            {!startDate || !endDate ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <p className="text-blue-900 text-lg font-medium mb-2">
                  Select a date range to view analytics
                </p>
                <p className="text-sm text-blue-700">
                  Choose a preset or enter custom dates to see sales data and trends.
                </p>
              </div>
            ) : (
              <>
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
              </>
            )}
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
    </>
  );
}