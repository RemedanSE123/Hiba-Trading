import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AppLayout from '@/components/Layout/AppLayout';
import CartItems from '@/components/Cart/CartItems';
import CartSummary from '@/components/Cart/CartSummary';
import EmptyCart from '@/components/Cart/EmptyCart';
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
      orderBy: {
        createdAt: 'desc',
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

export default async function CartPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
            <p className="text-gray-600 mb-6">Please sign in to view your cart</p>
            <a
              href="/auth/signin"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </AppLayout>
    );
  }

  const cartItems = await getCartItems(session.user.id);

  if (cartItems.length === 0) {
    return (
      <AppLayout>
        <EmptyCart />
      </AppLayout>
    );
  }

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  const shippingFee = subtotal > 500 ? 0 : 99;
  const taxAmount = subtotal * 0.15; // 15% VAT for South Africa
  const total = subtotal + shippingFee + taxAmount;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <CartItems cartItems={cartItems} />
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary 
              subtotal={subtotal}
              shippingFee={shippingFee}
              taxAmount={taxAmount}
              total={total}
              cartItems={cartItems}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}