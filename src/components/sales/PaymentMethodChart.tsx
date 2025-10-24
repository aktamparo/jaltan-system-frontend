"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { PaymentMethodBreakdown } from "@/lib/types/sales";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PaymentMethodChartProps {
  data?: PaymentMethodBreakdown[];
  isLoading?: boolean;
}

const CHART_COLORS = [
  "rgba(59, 130, 246, 0.8)",   // Blue
  "rgba(16, 185, 129, 0.8)",   // Green
  "rgba(245, 158, 11, 0.8)",   // Amber
  "rgba(239, 68, 68, 0.8)",    // Red
  "rgba(139, 92, 246, 0.8)",   // Purple
  "rgba(236, 72, 153, 0.8)",   // Pink
  "rgba(14, 165, 233, 0.8)",   // Sky
  "rgba(34, 197, 94, 0.8)",    // Green
];

const BORDER_COLORS = [
  "rgba(59, 130, 246, 1)",     // Blue
  "rgba(16, 185, 129, 1)",     // Green
  "rgba(245, 158, 11, 1)",     // Amber
  "rgba(239, 68, 68, 1)",      // Red
  "rgba(139, 92, 246, 1)",     // Purple
  "rgba(236, 72, 153, 1)",     // Pink
  "rgba(14, 165, 233, 1)",     // Sky
  "rgba(34, 197, 94, 1)",      // Green
];

export default function PaymentMethodChart({ data = [], isLoading }: PaymentMethodChartProps) {
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

  const chartData = {
    labels: data.map((item) => item.paymentMethod),
    datasets: [
      {
        label: "Amount (₱)",
        data: data.map((item) => item.totalAmount),
        backgroundColor: CHART_COLORS.slice(0, data.length),
        borderColor: BORDER_COLORS.slice(0, data.length),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
      },
      title: {
        display: true,
        text: "Sales by Payment Method",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
  };

  const totalAmount = data.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="flex justify-center">
          <div style={{ width: "300px", height: "300px" }}>
            <Pie data={chartData} options={options} />
          </div>
        </div>

        {/* Payment Method Details */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Payment Method Breakdown</h4>
          <div className="space-y-3">
            {data.map((item, index) => {
              const percentage = totalAmount > 0 ? (item.totalAmount / totalAmount * 100) : 0;
              return (
                <div key={item.paymentMethod} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: CHART_COLORS[index] }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{item.paymentMethod}</p>
                      <p className="text-sm text-gray-500">
                        {new Intl.NumberFormat("en-US").format(item.count)} transactions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(item.totalAmount)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Total */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">
                {new Intl.NumberFormat("en-PH", {
                  style: "currency",
                  currency: "PHP",
                }).format(totalAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}