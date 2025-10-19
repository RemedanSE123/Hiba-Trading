'use client';

interface ProductStatsProps {
  stats: {
    totalProducts: number;
    outOfStock: number;
    lowStock: number;
    totalRevenue: number;
  };
}

export default function ProductStats({ stats }: ProductStatsProps) {
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
      title: 'Total Products',
      value: formatNumber(stats.totalProducts),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: '🛍️',
      description: 'Active products',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Out of Stock',
      value: formatNumber(stats.outOfStock),
      change: '+2.1%',
      changeType: 'warning' as const,
      icon: '📦',
      description: 'Need restocking',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      title: 'Low Stock',
      value: formatNumber(stats.lowStock),
      change: '+3.5%',
      changeType: 'warning' as const,
      icon: '⚠️',
      description: 'Below 5 units',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: '💰',
      description: 'From product sales',
      gradient: 'from-green-500 to-emerald-600'
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
                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
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