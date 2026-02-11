import { IVOREY_API_KEY } from "@/lib/environment";

export interface IvoreyContact {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

export async function addContactToIvorey(contact: IvoreyContact): Promise<{ success: boolean; error?: string }> {
  try {
    // Use the hardcoded endpoint URL since it's specific to your account
    const endpoint = "https://app.ivorey.io/v2/location/wYN7lBF78aq3jxazOaIb/contacts/smart_list/All";
    
    if (!IVOREY_API_KEY) {
      console.error("Ivorey API key not configured");
      return { success: false, error: "API key not configured" };
    }

    console.log("Adding contact to Ivorey:", {
      endpoint,
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      tags: contact.tags || ["touch-cards-signup"],
    });

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${IVOREY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: contact.email,
        firstName: contact.firstName,
        lastName: contact.lastName,
        tags: contact.tags || ["touch-cards-signup"],
      }),
    });

    const responseText = await response.text();
    console.log("Ivorey API response status:", response.status);
    console.log("Ivorey API response:", responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      console.error("Ivorey API error:", errorData);
      return { 
        success: false, 
        error: errorData.message || `HTTP ${response.status}: ${responseText}` 
      };
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { success: true };
    }
    
    console.log("Contact added to Ivorey successfully:", data);
    return { success: true };

  } catch (error: any) {
    console.error("Error adding contact to Ivorey:", error);
    return { success: false, error: error.message };
  }
}