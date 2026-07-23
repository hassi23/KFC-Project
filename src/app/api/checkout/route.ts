import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, address } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    // Validate all items exist in DB and get their current prices
    const menuItemIds = items.map((i: any) => i.id);
    const dbItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    if (dbItems.length !== items.length) {
      return NextResponse.json({ error: 'Some cart items were not found.' }, { status: 400 });
    }

    // Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = dbItems.map((dbItem) => {
      const cartItem = items.find((i: any) => i.id === dbItem.id);
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: dbItem.name,
            description: dbItem.description.substring(0, 200),
            images: [dbItem.image],
          },
          unit_amount: Math.round(dbItem.price * 100), // Stripe uses cents
        },
        quantity: cartItem.quantity,
      };
    });

    // Store pending address data in metadata
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      metadata: {
        userId: session?.user ? (session.user as any).id : '',
        address: JSON.stringify(address),
        items: JSON.stringify(items.map((i: any) => ({ id: i.id, quantity: i.quantity }))),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: error.message || 'Checkout failed.' }, { status: 500 });
  }
}
