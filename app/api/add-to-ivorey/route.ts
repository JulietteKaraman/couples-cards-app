import { NextResponse } from "next/server";
import { addContactToIvorey } from "@/lib/ivorey/api";

export async function POST(req: Request) {
  console.log("========== ADD TO IVOREY START ==========");
  
  try {
    const { email, firstName, lastName } = await req.json();

    console.log("Adding contact to Ivorey:", { email, firstName, lastName });

    if (!email) {
      console.error("ERROR: Missing email");
      return NextResponse.json(
        { error: "Missing email" },
        { status: 400 }
      );
    }

    const result = await addContactToIvorey({
      email,
      firstName,
      lastName,
      tags: ["touch-cards-signup"],
    });

    if (!result.success) {
      console.error("Failed to add contact:", result.error);
      return NextResponse.json(
        { error: result.error || "Failed to add contact" },
        { status: 500 }
      );
    }

    console.log("========== ADD TO IVOREY SUCCESS ==========");
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("========== ADD TO IVOREY ERROR ==========");
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}