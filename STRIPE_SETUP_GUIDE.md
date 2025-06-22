# Stripe Integration Setup Guide

This guide will help you set up Stripe for your subscription page.

## Step 1: Get Your Stripe API Keys

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers → API Keys**
3. Copy your **Publishable Key** (starts with `pk_test_` for test mode)
4. Copy your **Secret Key** (starts with `sk_test_` for test mode)

## Step 2: Create Products and Prices

1. Go to **Products** in your Stripe Dashboard
2. Click **Add Product**
3. Create two products:
   - **Monthly Premium** - $10/month
   - **Annual Premium** - $100/year
4. For each product, create a recurring price:
   - Set the price amount
   - Choose "Recurring" billing
   - Set the billing interval (monthly/annual)
5. Copy the **Price IDs** (start with `price_`)

## Step 3: Set Up Webhooks

1. Go to **Developers → Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook Signing Secret** (starts with `whsec_`)

## Step 4: Configure Environment Variables

1. Copy `stripe-config-template.env` to `.env.local`
2. Fill in your actual values:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key

# Stripe Price IDs
STRIPE_MONTHLY_PRICE_ID=price_your_monthly_price_id
STRIPE_ANNUAL_PRICE_ID=price_your_annual_price_id

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Your application base URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Go to your subscription page
3. Select "Kaarka" (Card) payment method
4. Choose a plan and click "Isdiiwaangeli"
5. You should be redirected to Stripe's checkout page
6. Use Stripe's test card numbers:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - **Requires Authentication**: `4000 0025 0000 3155`

## Step 6: Handle Webhooks (Production)

For production, you'll need to:

1. Update your webhook endpoint URL to your production domain
2. Use live API keys instead of test keys
3. Implement the webhook handlers in `/api/stripe/webhook/route.ts` to:
   - Update user premium status in your database
   - Handle subscription lifecycle events
   - Send confirmation emails

## Files Created/Modified

- `src/lib/stripe.ts` - Stripe configuration
- `src/services/stripe.ts` - Client-side Stripe service
- `src/app/api/stripe/create-checkout-session/route.ts` - Checkout session API
- `src/app/api/stripe/webhook/route.ts` - Webhook handler
- `src/app/subscribe/page.tsx` - Updated subscription page
- `stripe-config-template.env` - Environment variables template

## Security Notes

- Never expose your secret key in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Keep your API keys secure

## Troubleshooting

- **Check browser console** for JavaScript errors
- **Check server logs** for API errors
- **Verify webhook endpoint** is accessible
- **Test with Stripe CLI** for local development

## Next Steps

1. Implement user authentication integration
2. Add subscription management features
3. Set up email notifications
4. Add payment method management
5. Implement subscription cancellation 