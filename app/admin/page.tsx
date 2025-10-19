import { prisma } from '@/lib/prisma';
import DashboardStats from '@/components/Admin/DashboardStats';
import RecentOrders from '@/components/Admin/RecentOrders';
import PopularProducts from '@/components/Admin/PopularProducts';
import SalesChart from '@/components/Admin/SalesChart';

async function getDashboardData() {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      recentOrders,
      popularProducts,
      monthlySales
    ] = await Promise.all([
      // Total Orders
      prisma.order.count(),

      // Total Revenue (only completed orders)
      prisma.order.aggregate({
        where: {
          status: { in: ['DELIVERED', 'SHIPPED'] }
        },
        _sum: { totalPrice: true }
      }),

      // Total Products
      prisma.product.count({
        where: { isActive: true }
      }),

      // Total Customers
      prisma.user.count({
        where: { role: 'CUSTOMER' }
      }),

      // Recent Orders (last 10)
      prisma.order.findMany({
        include: {
          user: {
            select: { name: true, email: true }
          },
          orderItems: {
            include: {
              product: {
                select: { name: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Popular Products (by sales)
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          _count: {
            select: {
              orderItems: true
            }
          },
          category: {
            select: { name: true }
          }
        },
        orderBy: {
          orderItems: {
            _count: 'desc'
          }
        },
        take: 8
      }),

      // Monthly Sales Data (last 6 months)
      prisma.$queryRaw`
        SELECT 
          DATE_FORMAT(createdAt, '%Y-%m') as month,
          COUNT(*) as order_count,
          SUM(totalPrice) as revenue
        FROM orders 
        WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(createdAt, '%Y-%m')
        ORDER BY month DESC
        LIMIT 6
      ` as any
    ]);

    return {
      stats: {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalProducts,
        totalCustomers,
        averageOrderValue: totalOrders > 0 ? Number(totalRevenue._sum.totalPrice || 0) / totalOrders : 0
      },
      recentOrders: recentOrders.map(order => ({
        ...order,
        totalPrice: Number(order.totalPrice),
        subtotal: Number(order.subtotal),
        taxAmount: Number(order.taxAmount),
        shippingFee: Number(order.shippingFee)
      })),
      popularProducts: popularProducts.map(product => ({
        ...product,
        price: Number(product.price),
        comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
        costPrice: product.costPrice ? Number(product.costPrice) : null,
        images: JSON.parse(product.images) as string[],
        features: JSON.parse(product.features) as string[],
        salesCount: product._count.orderItems
      })),
      monthlySales: monthlySales.map((month: any) => ({
        month: month.month,
        orders: Number(month.order_count),
        revenue: Number(month.revenue)
      })).reverse()
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      stats: {
        totalOrders: 0,
        totalRevenue: 0,
        totalProducts: 0,
        totalCustomers: 0,
        averageOrderValue: 0
      },
      recentOrders: [],
      popularProducts: [],
      monthlySales: []
    };
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h1>
        <p className="opacity-90">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={data.stats} />

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="xl:col-span-2">
          <SalesChart data={data.monthlySales} />
        </div>

        {/* Popular Products */}
        <div className="xl:col-span-1">
          <PopularProducts products={data.popularProducts} />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={data.recentOrders} />
    </div>
  );
}