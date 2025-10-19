'use client';

interface DashboardStatsProps {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalProducts: number;
    totalCustomers: number;
    averageOrderValue: number;
  };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-ZA').format(num);
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: '💰',
      description: 'From all orders',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Orders',
      value: formatNumber(stats.totalOrders),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: '📦',
      description: 'Processed orders',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Products',
      value: formatNumber(stats.totalProducts),
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: '🛍️',
      description: 'Active products',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Customers',
      value: formatNumber(stats.totalCustomers),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: '👥',
      description: 'Registered users',
      gradient: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((card, index) => (
        <div
          key={card.title}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-xl flex items-center justify-center`}>
              <span className="text-xl text-white">{card.icon}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              card.changeType === 'positive' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {card.change}
            </span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {card.value}
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {card.title}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            {card.description}
          </p>

          {/* Progress bar for visual effect */}
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
            <div 
              className={`h-1 rounded-full bg-gradient-to-r ${card.gradient}`}
              style={{ width: `${70 + (index * 10)}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}