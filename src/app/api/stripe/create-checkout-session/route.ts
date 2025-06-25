import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  email: string;
  sub: string;
  user_id: string;
}

export async function POST(request: NextRequest) {
  try {
    const { plan, successUrl, cancelUrl, countryCode } = await request.json();

    // Validate plan
    if (!plan || !STRIPE_PRICE_IDS[plan as keyof typeof STRIPE_PRICE_IDS]) {
      return NextResponse.json(
        { error: "Invalid plan specified" },
        { status: 400 }
      );
    }

    // Get user from auth token
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let userEmail: string;
    let userId: string;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      userEmail = decoded.email;
      userId = decoded.user_id;
    } catch {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    // Get the correct price ID based on location
    const priceType = countryCode === "SO" ? "SOMALIA" : "INTERNATIONAL";
    const priceId =
      STRIPE_PRICE_IDS[plan as keyof typeof STRIPE_PRICE_IDS][priceType];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancelUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe?canceled=true`,
      metadata: {
        plan,
        userId,
        countryCode,
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_email: userEmail,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
