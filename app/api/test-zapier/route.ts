import { NextResponse } from "next/server";
import { ZAPIER_WEBHOOK_URL } from "@/lib/environment";

export async function POST(req: Request) {
  try {
    if (!ZAPIER_WEBHOOK_URL) {
      return NextResponse.json({ 
        error: "ZAPIER_WEBHOOK_URL not configured",
        configured: false 
      }, { status: 500 });
    }

    const { email, firstName, lastName, tags } = await req.json();

    console.log("Testing Zapier webhook:", ZAPIER_WEBHOOK_URL);
    console.log("Payload:", { email, firstName, lastName, tags });

    const webhookResponse = await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email?.toLowerCase(),
        firstName,
        lastName,
        tags: tags || ["test-zapier-webhook"],
      }),
    });

    console.log("Zapier response status:", webhookResponse.status);
    const responseText = await webhookResponse.text();
    console.log("Zapier response:", responseText);

    if (webhookResponse.ok) {
      return NextResponse.json({ 
        success: true, 
        message: "Contact sent to Zapier successfully",
        response: responseText 
      });
    } else {
      return NextResponse.json({ 
        error: "Zapier webhook failed",
        status: webhookResponse.status,
        response: responseText 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error("Test Zapier error:", error);
    return NextResponse.json({ 
      error: error.message,
      details: "Exception caught"
    }, { status: 500 });
  }
}