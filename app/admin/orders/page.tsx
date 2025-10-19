import { prisma } from '@/lib/prisma';
import AdminOrdersTable from '@/components/Admin/Orders/AdminOrdersTable';
import OrderStats from '@/components/Admin/Orders/OrderStats';
import OrderFilters from '@/components/Admin/Orders/OrderFilters';

async function getOrders(filters?: { status?: string; search?: string }) {
  try {
    const whereClause: any = {};

    if (filters?.status && filters.status !== 'all') {
      whereClause.status = filters.status;
    }

    if (filters?.search) {
      whereClause.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { user: { name: { contains: filters.search, mode: 'insensitive' } } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return orders.map(order => ({
      ...order,
      totalPrice: Number(order.totalPrice),
      subtotal: Number(order.subtotal),
      taxAmount: Number(order.taxAmount),
      shippingFee: Number(order.shippingFee),
      orderItems: order.orderItems.map(item => ({
        ...item,
        price: Number(item.price),
        total: Number(item.total),
        product: {
          ...item.product,
          images: JSON.parse(item.product.images) as string[],
        },
      })),
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

async function getOrderStats() {
  try {
    const [
      totalOrders,
      pendingOrders,
      revenue,
      averageOrderValue,
      statusCounts
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.aggregate({
        where: { status: { in: ['DELIVERED', 'SHIPPED'] } },
        _sum: { totalPrice: true }
      }),
      prisma.order.aggregate({
        _avg: { totalPrice: true }
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: {
          _all: true
        }
      })
    ]);

    return {
      totalOrders,
      pendingOrders,
      totalRevenue: revenue._sum.totalPrice || 0,
      averageOrderValue: averageOrderValue._avg.totalPrice || 0,
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item.status] = item._count._all;
        return acc;
      }, {} as Record<string, number>)
    };
  } catch (error) {
    console.error('Error fetching order stats:', error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      statusCounts: {}
    };
  }
}

interface AdminOrdersPageProps {
  searchParams: {
    status?: string;
    search?: string;
  };
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const [orders, stats] = await Promise.all([
    getOrders(searchParams),
    getOrderStats()
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Export Orders
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Create Order
          </button>
        </div>
      </div>

      {/* Order Statistics */}
      <OrderStats stats={stats} />

      {/* Filters */}
      <OrderFilters />

      {/* Orders Table */}
      <AdminOrdersTable orders={orders} />
    </div>
  );
}