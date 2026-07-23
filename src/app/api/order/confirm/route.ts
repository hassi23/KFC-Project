import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session_id.' }, { status: 400 });
    }

    // Check if order already created for this session
    const existingOrder = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
      include: { orderItems: { include: { menuItem: true } }, address: true },
    });

    if (existingOrder) {
      return NextResponse.json({ order: existingOrder });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed.' }, { status: 400 });
    }

    const userId = session.metadata?.userId || null;
    const addressData = session.metadata?.address ? JSON.parse(session.metadata.address) : null;
    const itemsData = session.metadata?.items ? JSON.parse(session.metadata.items) : [];

    // Fetch current menu items for price record
    const menuItemIds = itemsData.map((i: any) => i.id);
    const dbItems = await prisma.menuItem.findMany({ where: { id: { in: menuItemIds } } });

    // Create address
    let addressId: string | null = null;
    if (addressData?.street) {
      const createdAddress = await prisma.address.create({
        data: {
          street: addressData.street,
          city: addressData.city,
          state: addressData.state || '',
          postalCode: addressData.postalCode,
          country: addressData.country || 'US',
        },
      });
      addressId = createdAddress.id;
    }

    const subtotal = dbItems.reduce((sum: number, dbItem: any) => {
      const item = itemsData.find((i: any) => i.id === dbItem.id);
      return sum + dbItem.price * (item?.quantity || 1);
    }, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: userId || null,
        status: 'PAID',
        subtotal,
        tax,
        total,
        stripeSessionId: sessionId,
        addressId,
        orderItems: {
          create: itemsData.map((item: any) => {
            const dbItem = dbItems.find((d: any) => d.id === item.id);
            return {
              menuItemId: item.id,
              quantity: item.quantity,
              price: dbItem?.price || 0,
            };
          }),
        },
      },
      include: { orderItems: { include: { menuItem: true } }, address: true },
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Order confirmation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process order.' }, { status: 500 });
  }
}
