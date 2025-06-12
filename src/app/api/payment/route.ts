import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountNumber, amount, description, referenceId } = body;

    const baseURL =
      process.env.NEXT_PUBLIC_WAAFIPAY_ENVIRONMENT === "production"
        ? "https://api.waafipay.net/api/v1"
        : "https://sandbox.waafipay.net/api/v1";

    const response = await axios.post(`${baseURL}/payment`, {
      apiKey: process.env.NEXT_PUBLIC_WAAFIPAY_API_KEY,
      storeId: Number(process.env.NEXT_PUBLIC_WAAFIPAY_STORE_ID),
      merchantUid: process.env.NEXT_PUBLIC_WAAFIPAY_MERCHANT_UID,
      accountNumber,
      amount,
      description,
      referenceId,
      paymentMethod: "WALLET",
      sdkVersion: "0.0.2",
    });

    return NextResponse.json(response.data);
  } catch (error) {
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
