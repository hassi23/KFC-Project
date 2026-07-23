import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, address } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }
    if (!address?.street || !address?.city || !address?.postalCode) {
      return NextResponse.json({ error: 'A complete delivery address is required.' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;

    const menuItemIds = items.map((i: any) => i.id);
    const dbItems = await prisma.menuItem.findMany({ where: { id: { in: menuItemIds } } });

    if (dbItems.length !== items.length) {
      return NextResponse.json({ error: 'Some cart items were not found.' }, { status: 400 });
    }

    const subtotal = dbItems.reduce((sum, dbItem) => {
      const item = items.find((i: any) => i.id === dbItem.id);
      return sum + dbItem.price * (item?.quantity || 1);
    }, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const createdAddress = await prisma.address.create({
      data: {
        street: address.street,
        city: address.city,
        state: address.state || '',
        postalCode: address.postalCode,
        country: address.country || 'US',
      },
    });

    const order = await prisma.order.create({
      data: {
        userId,
        status: 'PAID',
        subtotal,
        tax,
        total,
        stripeSessionId: `mock_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        addressId: createdAddress.id,
        orderItems: {
          create: items.map((item: any) => {
            const dbItem = dbItems.find((d) => d.id === item.id)!;
            return {
              menuItemId: item.id,
              quantity: item.quantity,
              price: dbItem.price,
            };
          }),
        },
      },
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error: any) {
    console.error('Mock checkout error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed.' }, { status: 500 });
  }
}
