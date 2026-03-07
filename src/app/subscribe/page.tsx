"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import AuthService from "@/services/auth";
import StripeService from "@/services/stripe";
import Logo from "@/components/ui/Logo";

type PaymentProvider = "stripe" | "waafi";

const plans = [
  {
    name: "Explorer",
    stripe: { priceId: "price_1T8OAPKgtZOZZO8birrQijvZ", amount: "€29", billing: "subscription" as const },
    waafi: { amount: "$29", billing: "subscription" as const },
  },
  {
    name: "Challenge",
    stripe: { priceId: "price_1T8OASKgtZOZZO8bsw58rbVt", amount: "€149", billing: "payment" as const },
    waafi: { amount: "$149", billing: "payment" as const },
  },
  {
    name: "Bundle (One-time)",
    stripe: { priceId: "price_1T8OAWKgtZOZZO8bOwSKjaFm", amount: "€149", billing: "payment" as const },
    waafi: { amount: "$149", billing: "payment" as const },
  },
  {
    name: "Bundle (Monthly)",
    stripe: { priceId: "price_1T8OAcKgtZOZZO8bO574FFud", amount: "€29", billing: "subscription" as const },
    waafi: { amount: "$29", billing: "subscription" as const },
  },
];
// NOTE: Replace Waafi amounts with real values before shipping

const ERROR_TRANSLATIONS: Record<string, string> = {
    "Payment Failed (Receiver is Locked)": "Bixinta waa guuldareysatay (Qofka qaataha waa la xidhay)",
    "Payment Failed (Haraaga xisaabtaadu kuguma filna, mobile No: 252618995283)": "Bixinta waa guuldareysatay (Haraaga xisaabtaadu kuguma filna, lambarka: 252618995283)",
    "RCS_USER_REJECTED": "Bixinta waa la joojiyay adiga ayaa diiday",
    "Invalid card number": "Lambarka kaarka waa khaldan",
    "Invalid or expired card": "Kaarka waa khaldan ama waa dhammaystiran",
    "Invalid CVV": "CVV-ga waa khaldan",
    // Add more error translations as needed
};

function translateError(error: string) {
    for (const key in ERROR_TRANSLATIONS) {
        if (error.includes(key) || error === key) return ERROR_TRANSLATIONS[key];
    }
    return error;
}

export default function SubscribePage() {
    const router = useRouter();
    useAuthStore();
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>("stripe");
    const [error, setError] = useState<string | null>(null);
    const [loadingPlanName, setLoadingPlanName] = useState<string | null>(null);

    // Check if user is already premium and redirect
    useEffect(() => {
        const authService = AuthService.getInstance();
        if (authService.isPremium()) {
            router.push("/courses");
        }
    }, [router]);

    // If user is premium, don't render the subscription form
    if (AuthService.getInstance().isPremium()) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const handleStripeCheckout = async (plan: (typeof plans)[number]) => {
        setError(null);
        setLoadingPlanName(plan.name);
        try {
            const stripeService = StripeService.getInstance();
            await stripeService.createCheckoutSessionWithPrice(
                plan.stripe.priceId,
                plan.stripe.billing === "subscription" ? "subscription" : "payment"
            );
        } catch (err) {
            setError(translateError(err instanceof Error ? err.message : String(err)));
        } finally {
            setLoadingPlanName(null);
        }
    };

    const handleWaafiCheckout = async (plan: (typeof plans)[number]) => {
        setError(null);
        setLoadingPlanName(plan.name);
        try {
            const res = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan: plan.name,
                    amount: plan.waafi.amount,
                    billing: plan.waafi.billing,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Bixinta waa guuldareysatay");
            }
            if (data.hppUrl) {
                window.location.href = data.hppUrl;
                return;
            }
            setError(data.message || "No redirect URL received");
        } catch (err) {
            setError(translateError(err instanceof Error ? err.message : String(err)));
        } finally {
            setLoadingPlanName(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
            <div className="w-full max-w-4xl">
                <div className="flex flex-col items-center mb-8">
                    <Logo
                        width={180}
                        height={54}
                        className="h-12 w-auto sm:h-14 max-w-[180px] mb-4 drop-shadow-md rounded-xl"
                        priority={true}
                        loading="eager"
                        sizes="(max-width: 640px) 120px, 180px"
                    />
                    <h1 className="text-3xl font-extrabold text-purple-700 mb-2 text-center">Subscribe</h1>
                    <p className="text-gray-500 text-center">Choose your payment method and plan.</p>
                </div>

                {/* Pill-style payment method toggle */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex p-1 rounded-full bg-gray-200 border border-gray-200" role="tablist">
                        <button
                            type="button"
                            role="tab"
                            aria-selected={selectedProvider === "stripe"}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedProvider === "stripe"
                                ? "bg-lime-400 text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                            onClick={() => setSelectedProvider("stripe")}
                        >
                            🌍 International (Stripe)
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={selectedProvider === "waafi"}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedProvider === "waafi"
                                ? "bg-lime-400 text-gray-900 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                            onClick={() => setSelectedProvider("waafi")}
                        >
                            🇸🇴 Somali (Waafi)
                        </button>
                    </div>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Pricing cards — update instantly by selectedProvider */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {plans.map((plan) => {
                        const isStripe = selectedProvider === "stripe";
                        const amount = isStripe ? plan.stripe.amount : plan.waafi.amount;
                        const billing = isStripe ? plan.stripe.billing : plan.waafi.billing;
                        const billingLabel = billing === "subscription" ? "/ month" : "one-time";
                        const isLoading = loadingPlanName === plan.name;

                        return (
                            <Card
                                key={plan.name}
                                className="p-6 border border-gray-200 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col h-full">
                                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-2xl font-bold text-purple-700">{amount}</span>
                                        <span className="text-sm text-gray-500">{billingLabel}</span>
                                    </div>
                                    <div className="mt-4 flex-1">
                                        <Button
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                                            disabled={!!loadingPlanName}
                                            onClick={() =>
                                                isStripe ? handleStripeCheckout(plan) : handleWaafiCheckout(plan)
                                            }
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Loading...
                                                </>
                                            ) : isStripe ? (
                                                "Checkout with Stripe"
                                            ) : (
                                                "Pay with Waafi"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                <div className="flex justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-lg"
                        onClick={() => router.back()}
                    >
                        Ka noqo
                    </Button>
                </div>
            </div>
        </div>
    );
} 