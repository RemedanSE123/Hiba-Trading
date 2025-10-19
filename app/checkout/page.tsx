import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AppLayout from '@/components/Layout/AppLayout';
import CheckoutForm from '@/components/Checkout/CheckoutForm';
import OrderSummary from '@/components/Checkout/OrderSummary';
import { CartItemWithProduct } from '@/types';

async function getCartItems(userId: string): Promise<CartItemWithProduct[]> {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stock: true,
            slug: true,
            isActive: true,
          },
        },
      },
    });

    return cartItems.map(item => ({
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        images: JSON.parse(item.product.images) as string[],
      },
    }));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
}

async function getUserAddresses(userId: string) {
  try {
    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });
    return addresses;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return [];
  }
}

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/checkout');
  }

  const [cartItems, addresses] = await Promise.all([
    getCartItems(session.user.id),
    getUserAddresses(session.user.id),
  ]);

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    redirect('/cart');
  }

  // Check for out of stock items
  const hasOutOfStockItems = cartItems.some(item => item.product.stock === 0);
  const hasLowStockItems = cartItems.some(item => 
    item.product.stock > 0 && item.product.stock < item.quantity
  );

  if (hasOutOfStockItems || hasLowStockItems) {
    redirect('/cart');
  }

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const shippingFee = subtotal > 500 ? 0 : 99;
  const taxAmount = subtotal * 0.15;
  const total = subtotal + shippingFee + taxAmount;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <CheckoutForm 
              addresses={addresses}
              cartItems={cartItems}
              totals={{ subtotal, shippingFee, taxAmount, total }}
            />
          </div>

          {/* Order Summary */}
          <div>
            <OrderSummary 
              cartItems={cartItems}
              subtotal={subtotal}
              shippingFee={shippingFee}
              taxAmount={taxAmount}
              total={total}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}