import Stripe from "stripe";

// Server-side Stripe instance (only available on server)
export const stripe =
  typeof window === "undefined"
    ? new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-05-28.basil",
      })
    : null;

// Client-side Stripe configuration
export const getStripe = async () => {
  if (typeof window !== "undefined") {
    const { loadStripe } = await import("@stripe/stripe-js");
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return null;
};

// Price IDs for your subscription plans
export const STRIPE_PRICE_IDS = {
  monthly: {
    SOMALIA: process.env.STRIPE_MONTHLY_PRICE_ID_SOMALIA!,
    INTERNATIONAL: process.env.STRIPE_MONTHLY_PRICE_ID_INTERNATIONAL!,
  },
};

// Webhook events to handle
export const STRIPE_WEBHOOK_EVENTS = [
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
];
