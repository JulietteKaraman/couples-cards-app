import { NextResponse } from "next/server";
import { IVOREY_API_KEY, IVOREY_API_ENDPOINT } from "@/lib/environment";

export interface IvoreyContact {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

export async function addContactToIvorey(contact: IvoreyContact): Promise<{ success: boolean; error?: string }> {
  try {
    if (!IVOREY_API_KEY || !IVOREY_API_ENDPOINT) {
      console.error("Ivorey API not configured");
      return { success: false, error: "API not configured" };
    }

    const response = await fetch(IVOREY_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${IVOREY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: contact.email,
        first_name: contact.firstName,
        last_name: contact.lastName,
        tags: contact.tags || ["touch-cards-signup"],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Ivorey API error:", errorData);
      return { 
        success: false, 
        error: errorData.message || `HTTP ${response.status}` 
      };
    }

    const data = await response.json();
    console.log("Contact added to Ivorey:", data);
    return { success: true };

  } catch (error: any) {
    console.error("Error adding contact to Ivorey:", error);
    return { success: false, error: error.message };
  }
}