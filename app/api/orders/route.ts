import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import dbUtils from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { addressId, paymentMethod, notes } = await request.json();

    // Validation
    if (!addressId) {
      return NextResponse.json(
        { error: 'Delivery address is required' },
        { status: 400 }
      );
    }

    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            isActive: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate cart items
    for (const item of cartItems) {
      if (!item.product.isActive) {
        return NextResponse.json(
          { error: `Product "${item.product.name}" is no longer available` },
          { status: 400 }
        );
      }

      if (item.product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${item.product.name}"` },
          { status: 400 }
        );
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);

    const shippingFee = subtotal > 500 ? 0 : 99;
    const taxAmount = subtotal * 0.15; // 15% VAT
    const total = subtotal + shippingFee + taxAmount;

    // Get address
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    if (!address) {
      return NextResponse.json(
        { error: 'Delivery address not found' },
        { status: 404 }
      );
    }

    // Format delivery address
    const deliveryAddress = `
${address.fullName}
${address.phone}
${address.streetAddress}${address.unitNumber ? `, ${address.unitNumber}` : ''}
${address.suburb}
${address.city}
${address.province}
${address.postalCode}
    `.trim();

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber: dbUtils.generateOrderNumber(),
          totalPrice: total,
          subtotal: subtotal,
          taxAmount: taxAmount,
          shippingFee: shippingFee,
          paymentMethod: paymentMethod,
          status: 'PENDING',
          deliveryAddress: deliveryAddress,
          notes: notes || null,
          userId: session.user.id,
          addressId: addressId,
        },
      });

      // Create order items and update product stock
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: Number(item.product.price),
            total: Number(item.product.price) * item.quantity,
          },
        });

        // Update product stock
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear user's cart
      await tx.cartItem.deleteMany({
        where: {
          userId: session.user.id,
        },
      });

      return order;
    });

    // Fetch complete order details
    const orderWithDetails = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                slug: true,
              },
            },
          },
        },
        address: true,
      },
    });

    return NextResponse.json({
      message: 'Order created successfully',
      order: orderWithDetails,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const whereClause: any = {
      userId: session.user.id,
    };

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                images: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format orders
    const formattedOrders = orders.map(order => ({
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

    return NextResponse.json({ orders: formattedOrders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}