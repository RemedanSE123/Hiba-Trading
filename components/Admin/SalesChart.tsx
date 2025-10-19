'use client';

import { useState } from 'react';

interface SalesData {
  month: string;
  orders: number;
  revenue: number;
}

interface SalesChartProps {
  data: SalesData[];
}

export default function SalesChart({ data }: SalesChartProps) {
  const [timeframe, setTimeframe] = useState<'revenue' | 'orders'>('revenue');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const maxValue = Math.max(...data.map(item => 
    timeframe === 'revenue' ? item.revenue : item.orders
  ));

  const formatMonth = (monthString: string) => {
    const [year, month] = monthString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Sales Overview
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monthly performance metrics
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeframe('revenue')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeframe === 'revenue'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setTimeframe('orders')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeframe === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const value = timeframe === 'revenue' ? item.revenue : item.orders;
          const percentage = (value / maxValue) * 100;
          
          return (
            <div key={item.month} className="flex items-center space-x-4">
              <div className="w-20 text-sm text-gray-600 dark:text-gray-400">
                {formatMonth(item.month)}
              </div>
              
              <div className="flex-1">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="w-20 text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {timeframe === 'revenue' 
                    ? formatCurrency(value)
                    : `${value} orders`
                  }
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">
              {timeframe === 'revenue' ? 'Revenue Growth' : 'Order Volume'}
            </span>
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            Last 6 months
          </div>
        </div>
      </div>
    </div>
  );
}