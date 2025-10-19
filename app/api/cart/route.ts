import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId, quantity } = await request.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    // Check if product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true },
      select: { stock: true }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      );
    }

    // Add to cart (upsert - update if exists, create if not)
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId: session.user.id,
        productId,
        quantity,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            images: true,
            stock: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Product added to cart',
      cartItem,
    });
  } catch (error) {
    console.error('Cart error:', error);
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
            images: true,
            stock: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert Decimal to number and parse images
    const formattedCartItems = cartItems.map(item => ({
      ...item,
      product: {
        ...item.product,
        price: Number(item.product.price),
        images: JSON.parse(item.product.images) as string[],
      },
    }));

    return NextResponse.json({ cartItems: formattedCartItems });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add these to your existing cart route

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { cartItemId, quantity } = await request.json();

    if (!cartItemId || !quantity) {
      return NextResponse.json(
        { error: 'Cart item ID and quantity are required' },
        { status: 400 }
      );
    }

    // Check if cart item belongs to user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
      include: {
        product: {
          select: { stock: true }
        }
      }
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    if (quantity > existingItem.product.stock) {
      return NextResponse.json(
        { error: 'Requested quantity exceeds available stock' },
        { status: 400 }
      );
    }

    // Update cart item
    const updatedItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity,
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            images: true,
            stock: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Cart item updated',
      cartItem: updatedItem,
    });
  } catch (error) {
    console.error('Cart update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { cartItemId } = await request.json();

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    // Check if cart item belongs to user
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: session.user.id,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    return NextResponse.json({
      message: 'Cart item removed',
    });
  } catch (error) {
    console.error('Cart delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}