import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    // Validate environment variables
    const apiKey = process.env.WAAFIPAY_API_KEY;
    const storeId = process.env.WAAFIPAY_STORE_ID;
    const merchantUid = process.env.WAAFIPAY_MERCHANT_UID;
    const environment = process.env.WAAFIPAY_ENVIRONMENT;

    if (!apiKey || !storeId || !merchantUid || !environment) {
      console.error("Missing WaafiPay configuration:", {
        apiKey: !!apiKey,
        storeId: !!storeId,
        merchantUid: !!merchantUid,
        environment: !!environment,
      });
      return NextResponse.json(
        { error: "Payment service configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { accountNumber, amount, description, referenceId } = body;

    // Validate request body
    if (!accountNumber || !amount || !description || !referenceId) {
      return NextResponse.json(
        { error: "Missing required payment information" },
        { status: 400 }
      );
    }

    const baseURL =
      environment === "production"
        ? "https://api.waafipay.net/api/v1"
        : "https://sandbox.waafipay.net/api/v1";

    const response = await axios.post(`${baseURL}/payment`, {
      apiKey,
      storeId: Number(storeId),
      merchantUid,
      accountNumber,
      amount,
      description,
      referenceId,
      paymentMethod: "WALLET",
      sdkVersion: "0.0.2",
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Payment processing error:", error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          error: error.response.data.responseMsg || "Payment processing error",
        },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
