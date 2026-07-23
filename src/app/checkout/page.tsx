import { CheckoutClient } from './CheckoutClient';

export default function CheckoutPage() {
  const key = process.env.STRIPE_SECRET_KEY;
  const stripeConfigured = Boolean(key && !key.includes('REPLACE_WITH_YOUR'));

  return <CheckoutClient stripeConfigured={stripeConfigured} />;
}
