import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    // Env vars take priority; fall back to credentials passed from admin UI (stored in localStorage)
    const apiKey = process.env.STEADFAST_API_KEY || orderData.apiKey;
    const secretKey = process.env.STEADFAST_SECRET_KEY || orderData.secretKey;

    if (!apiKey || !secretKey) {
      return NextResponse.json(
        {
          error:
            "Steadfast API credentials not configured. Please add them in Settings.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://portal.steadfast.com.bd/api/v1/create_order",
      {
        method: "POST",
        headers: {
          "Api-Key": apiKey,
          "Secret-Key": secretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice: orderData.orderId,
          recipient_name: orderData.customerName,
          recipient_phone: orderData.customerPhone,
          recipient_address: orderData.address,
          cod_amount: orderData.total,
          note: orderData.specialNotes || "",
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || "Failed to create Steadfast order" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      consignmentId: result.consignment?.id || result.consignment_id,
      trackingCode:
        result.consignment?.tracking_code || result.tracking_code,
      status: result.status,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to Steadfast API" },
      { status: 500 }
    );
  }
}

// Test connectivity with provided credentials
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const apiKey =
    process.env.STEADFAST_API_KEY || searchParams.get("apiKey") || "";
  const secretKey =
    process.env.STEADFAST_SECRET_KEY ||
    searchParams.get("secretKey") ||
    "";

  if (!apiKey || !secretKey) {
    return NextResponse.json(
      { error: "API credentials not provided" },
      { status: 400 }
    );
  }

  try {
    // Use the balance/account endpoint to verify credentials
    const response = await fetch(
      "https://portal.steadfast.com.bd/api/v1/get_balance",
      {
        headers: {
          "Api-Key": apiKey,
          "Secret-Key": secretKey,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, balance: result.current_balance });
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to Steadfast API" },
      { status: 500 }
    );
  }
}
