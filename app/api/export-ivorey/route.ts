import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { data: submissions, error } = await supabaseAdmin
      .from("ivorey_submissions")
      .select("email, name, product_intent, source, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Convert to CSV format
    const csvHeader = "email,name,product_intent,source,created_at\n";
    const csvRows = submissions?.map(sub => 
      `${sub.email},${sub.name || ""},${sub.product_intent || ""},${sub.source || ""},${sub.created_at || ""}`
    ).join("\n") || "";

    const csv = csvHeader + csvRows;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=ivorey_emails.csv",
      },
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}