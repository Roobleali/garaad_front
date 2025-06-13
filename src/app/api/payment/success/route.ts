import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId, referenceId, state } = body;

    // Validate required fields
    if (!transactionId || !referenceId || !state) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if payment is approved
    if (state !== "APPROVED") {
      return NextResponse.json(
        { error: "Payment not approved" },
        { status: 400 }
      );
    }

    // Get user from cookie
    const cookieStore = await cookies();
    const userStr = cookieStore.get("user")?.value;

    if (!userStr) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    try {
      const user = JSON.parse(userStr);

      // Update user premium status
      const updatedUser = {
        ...user,
        is_premium: true,
        premium_since: new Date().toISOString(),
        transaction_id: transactionId,
      };

      // Create response with updated user data
      const response = NextResponse.json({
        success: true,
        data: {
          user: updatedUser,
        },
      });

      // Set the updated user cookie
      response.cookies.set("user", JSON.stringify(updatedUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    } catch (error) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
