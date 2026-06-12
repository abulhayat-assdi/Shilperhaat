import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns";

// Force this route onto the Node.js runtime (the Edge runtime has no raw
// outbound TCP/DNS and is a common cause of "fetch failed" to 3rd-party APIs).
export const runtime = "nodejs";

// Many VPS hosts advertise an IPv6 record they can't actually route. Node 18+
// resolves AAAA first by default, so the connection silently dies with the
// opaque "fetch failed". Preferring IPv4 avoids that.
try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  /* older Node without this API — ignore */
}

const STEADFAST_BASE = "https://portal.steadfast.com.bd/api/v1";
const FETCH_TIMEOUT_MS = 20_000;

// fetch with an explicit timeout + a human-readable failure reason. Undici's
// "fetch failed" hides the real cause on .cause — we dig it out here.
async function steadfastFetch(
  path: string,
  init: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(`${STEADFAST_BASE}${path}`, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function describeError(err: unknown): string {
  if (err instanceof DOMException && err.name === "AbortError") {
    return `request timed out after ${FETCH_TIMEOUT_MS / 1000}s (server could not reach Steadfast)`;
  }
  if (err instanceof Error) {
    const cause = (err as { cause?: { code?: string; message?: string } }).cause;
    const code = cause?.code ? ` [${cause.code}]` : "";
    const causeMsg = cause?.message ? `: ${cause.message}` : "";
    return `${err.message}${code}${causeMsg}`;
  }
  return String(err);
}

// Steadfast wants a clean 11-digit local mobile number (e.g. 01XXXXXXXXX).
// Strip spaces/dashes and a leading +88 / 88 country code if present.
function normalizePhone(raw: string): string {
  let phone = String(raw || "").replace(/[^\d]/g, "");
  if (phone.startsWith("88") && phone.length === 13) phone = phone.slice(2);
  return phone;
}

// Read the response body once and try to parse it as JSON. If the upstream
// returns HTML / an empty body (gateway errors, Cloudflare, etc.) we still get
// a useful message instead of a thrown "Unexpected token" that hides the cause.
async function readBody(res: Response): Promise<{ json: any; text: string }> {
  const text = await res.text();
  try {
    return { json: JSON.parse(text), text };
  } catch {
    return { json: null, text };
  }
}

export async function POST(req: NextRequest) {
  let orderData: any;
  try {
    orderData = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Env vars take priority; fall back to credentials passed from admin UI (stored in localStorage)
  const apiKey = (process.env.STEADFAST_API_KEY || orderData.apiKey || "").trim();
  const secretKey = (process.env.STEADFAST_SECRET_KEY || orderData.secretKey || "").trim();

  if (!apiKey || !secretKey) {
    return NextResponse.json(
      {
        error:
          "Steadfast API credentials not configured. Set STEADFAST_API_KEY and STEADFAST_SECRET_KEY in the server environment (or add them in Settings).",
      },
      { status: 400 }
    );
  }

  try {
    const response = await steadfastFetch(`/create_order`, {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Secret-Key": secretKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        invoice: orderData.orderId,
        recipient_name: orderData.customerName,
        recipient_phone: normalizePhone(orderData.customerPhone),
        recipient_address: orderData.address,
        cod_amount: orderData.total,
        note: orderData.specialNotes || "",
      }),
    });

    const { json: result, text } = await readBody(response);

    if (!response.ok) {
      // Surface validation errors (e.g. { errors: { recipient_phone: [...] } })
      let message = result?.message || result?.error;
      if (!message && result?.errors) {
        message = Object.values(result.errors).flat().join(" ");
      }
      if (!message) {
        message =
          text?.slice(0, 200) ||
          `Steadfast returned HTTP ${response.status}`;
      }
      return NextResponse.json({ error: message }, { status: response.status });
    }

    if (!result) {
      return NextResponse.json(
        { error: "Steadfast returned an unexpected response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      consignmentId: result.consignment?.id || result.consignment_id,
      trackingCode: result.consignment?.tracking_code || result.tracking_code,
      status: result.status,
    });
  } catch (err) {
    const detail = describeError(err);
    console.error("Steadfast create_order failed:", detail);
    return NextResponse.json(
      { error: `Could not reach Steadfast API: ${detail}` },
      { status: 502 }
    );
  }
}

// Test connectivity with provided credentials
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const apiKey = (
    process.env.STEADFAST_API_KEY ||
    searchParams.get("apiKey") ||
    ""
  ).trim();
  const secretKey = (
    process.env.STEADFAST_SECRET_KEY ||
    searchParams.get("secretKey") ||
    ""
  ).trim();

  if (!apiKey || !secretKey) {
    return NextResponse.json(
      { error: "API credentials not provided" },
      { status: 400 }
    );
  }

  try {
    // Use the balance/account endpoint to verify credentials
    const response = await steadfastFetch(`/get_balance`, {
      method: "GET",
      headers: {
        "Api-Key": apiKey,
        "Secret-Key": secretKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const { json: result, text } = await readBody(response);

    if (!response.ok || !result) {
      const message =
        result?.message ||
        text?.slice(0, 200) ||
        "Invalid credentials";
      return NextResponse.json({ error: message }, { status: response.status || 401 });
    }

    return NextResponse.json({ success: true, balance: result.current_balance });
  } catch (err) {
    const detail = describeError(err);
    console.error("Steadfast get_balance failed:", detail);
    return NextResponse.json(
      { error: `Could not reach Steadfast API: ${detail}` },
      { status: 502 }
    );
  }
}
