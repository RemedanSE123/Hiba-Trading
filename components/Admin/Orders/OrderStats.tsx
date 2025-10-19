'use client';

interface OrderStatsProps {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    statusCounts: Record<string, number>;
  };
}

export default function OrderStats({ stats }: OrderStatsProps) {
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
      title: 'Total Orders',
      value: formatNumber(stats.totalOrders),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: '📦',
      description: 'All time orders',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Pending Orders',
      value: formatNumber(stats.pendingOrders),
      change: '+5.2%',
      changeType: 'warning' as const,
      icon: '⏳',
      description: 'Need attention',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: '+18.3%',
      changeType: 'positive' as const,
      icon: '💰',
      description: 'From delivered orders',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(stats.averageOrderValue),
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: '📊',
      description: 'Average per order',
      gradient: 'from-purple-500 to-pink-600'
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
                : card.changeType === 'warning'
                ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
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
        </div>
      ))}
    </div>
  );
}