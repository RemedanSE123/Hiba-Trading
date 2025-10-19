import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AppLayout from '@/components/Layout/AppLayout';
import OrderDetails from '@/components/Orders/OrderDetails';

async function getOrder(orderId: string, userId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: userId,
      },
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

    if (!order) return null;

    // Format order data
    return {
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
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    notFound();
  }

  const order = await getOrder(params.id, session.user.id);

  if (!order) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <OrderDetails order={order} />
      </div>
    </AppLayout>
  );
}