"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { DailySalesTrend } from "@/lib/types/sales";
import { format, parseISO } from "date-fns";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SalesTrendChartProps {
  data?: DailySalesTrend[];
  isLoading?: boolean;
  startDate?: string;
  endDate?: string;
}

export default function SalesTrendChart({ data = [], isLoading, startDate, endDate }: SalesTrendChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  // Generate dynamic title based on date range
  let chartTitle = "Sales Trends";
  if (startDate && endDate) {
    try {
      const start = format(parseISO(startDate), "MMM dd, yyyy");
      const end = format(parseISO(endDate), "MMM dd, yyyy");
      chartTitle = `Sales Trends (${start} - ${end})`;
    } catch (error) {
      chartTitle = "Sales Trends";
    }
  }

  const chartData = {
    labels: data.map((item) => format(parseISO(item.date), "MMM dd")),
    datasets: [
      {
        label: "Revenue (₱)",
        data: data.map((item) => item.totalRevenue),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Transactions",
        data: data.map((item) => item.transactionCount),
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: chartTitle,
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Revenue (₱)",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Transactions",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Line data={chartData} options={options} />
    </div>
  );
}