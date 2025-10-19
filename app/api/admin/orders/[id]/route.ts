import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { status, trackingNumber } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const updateData: any = { status };

    // Set timestamps based on status changes
    if (status === 'PAYMENT_VERIFIED' || status === 'PROCESSING') {
      updateData.paidAt = new Date();
    }

    if (status === 'SHIPPED') {
      updateData.shippedAt = new Date();
      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber;
      }
    }

    if (status === 'DELIVERED') {
      updateData.deliveredAt = new Date();
    }

    const order = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: updateData,
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    // TODO: Send email notification to customer about status update

    return NextResponse.json({
      message: 'Order updated successfully',
      order,
    });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        address: true,
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
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format order data
    const formattedOrder = {
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
    };

    return NextResponse.json({ order: formattedOrder });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}