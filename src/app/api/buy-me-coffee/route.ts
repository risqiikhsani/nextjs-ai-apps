import { NextResponse } from "next/server";
import crypto from "crypto";

const CLIENT_ID = process.env.DOKU_CLIENT_ID || "";
const SECRET_KEY = process.env.DOKU_SECRET_KEY || "";
const REQUEST_TARGET = "/checkout/v1/payment"; // DOKU API path
export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { amount, email, name, message, callback_url } = body;

    // Generate Request-Id & Timestamp
    const requestId = crypto.randomUUID();
    const timestamp = new Date().toISOString().slice(0, 19) + "Z"; // Trim to match Postman format

    // Construct payload
    const data = {
      order: {
        amount: amount,
        currency: "IDR",
        invoice_number: `INV-${timestamp}`,
        callback_url: callback_url,
      },
      line_items: [{ name: message }],
      payment: { payment_due_date: 60 },
      customer: { name, email },
    };

    // Generate Signature (HMAC-SHA256)
    const jsonBody = JSON.stringify(data);

    // Generate Digest (SHA-256 Base64 hash of JSON Body)
    const digestSHA256 = crypto
      .createHash("sha256")
      .update(jsonBody)
      .digest("base64");
    const digestHeader = `SHA-256=${digestSHA256}`;

    // Construct Signature String
    const signatureComponents = `Client-Id:${CLIENT_ID}\nRequest-Id:${requestId}\nRequest-Timestamp:${timestamp}\nRequest-Target:${REQUEST_TARGET}\nDigest:${digestSHA256}`;

    // Generate Signature (HMAC-SHA256)
    const signatureHmacSha256 = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(signatureComponents)
      .digest("base64");
    const signatureHeader = `${signatureHmacSha256}`;

    // Send the request
    const response = await fetch(
      "https://api-sandbox.doku.com/checkout/v1/payment",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Client-Id": CLIENT_ID,
          "Request-Id": requestId,
          "Request-Timestamp": timestamp,
          Signature: `HMACSHA256=${signatureHeader}`,
        },
        body: JSON.stringify(data),
      }
    );

    // Check response status
    if (!response.ok) {
      const errorResponse = await response.json();
      return NextResponse.json(
        { error: "Payment request failed", details: errorResponse },
        { status: response.status }
      );
    }

    // Parse and return the response
    const result = await response.json();
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
