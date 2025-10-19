import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Utility functions for database operations
export const dbUtils = {
  // Convert Decimal to number for API responses
  decimalToNumber: (value: any): number => {
    return Number(value.toString())
  },

  // Parse JSON fields from database
  parseJsonField: <T>(jsonString: string): T => {
    try {
      return JSON.parse(jsonString) as T
    } catch {
      return [] as unknown as T
    }
  },

  // Stringify data for JSON fields
  stringifyJsonField: (data: any): string => {
    return JSON.stringify(data)
  },

  // Generate unique order number
  generateOrderNumber: (): string => {
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `ORD-${timestamp}-${random}`
  },

  // Check low stock products
  async getLowStockProducts() {
    return await prisma.product.findMany({
      where: {
        stock: {
          lte: prisma.product.fields.lowStockAlert
        },
        isActive: true
      },
      include: {
        category: {
          select: { name: true }
        }
      }
    })
  },

  // Get dashboard statistics
  async getDashboardStats() {
    const [
      totalOrders,
      pendingOrders,
      totalProducts,
      lowStockCount,
      totalRevenue
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ 
        where: { 
          stock: { lte: prisma.product.fields.lowStockAlert },
          isActive: true 
        } 
      }),
      prisma.order.aggregate({
        where: { status: { in: ['DELIVERED', 'SHIPPED'] } },
        _sum: { totalPrice: true }
      })
    ])

    return {
      totalOrders,
      pendingOrders,
      totalProducts,
      lowStockCount,
      totalRevenue: totalRevenue._sum.totalPrice || 0
    }
  }
}

export default dbUtils