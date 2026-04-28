import { IVOREY_API_KEY, ZAPIER_WEBHOOK_URL } from "@/lib/environment";

export interface IvoreyContact {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

export async function addContactToIvorey(contact: IvoreyContact): Promise<{ success: boolean; error?: string }> {
  try {
    console.log("Adding contact to Ivorey:", {
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      tags: contact.tags || ["touch-cards-signup"],
    });

    if (ZAPIER_WEBHOOK_URL) {
      const webhookPayload = {
        email: contact.email.toLowerCase(),
        first_name: contact.firstName,
        last_name: contact.lastName,
        tags: contact.tags || ["touch-cards-signup"],
      };

      console.log("Sending to Zapier webhook:", ZAPIER_WEBHOOK_URL);

      const webhookResponse = await fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookPayload),
      });

      if (webhookResponse.ok) {
        console.log("Contact sent to Zapier successfully");
        return { success: true };
      } else {
        const errorText = await webhookResponse.text();
        console.error("Zapier webhook error:", errorText);
      }
    }

    if (IVOREY_API_KEY) {
      const endpoint = "https://services.leadconnectorhq.com/contacts/upsert";
      
      const ivoreyResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${IVOREY_API_KEY}`,
          "Content-Type": "application/json",
          "Version": "2020-01-01",
        },
        body: JSON.stringify({
          email: contact.email.toLowerCase(),
          firstName: contact.firstName,
          lastName: contact.lastName,
          tags: contact.tags || ["touch-cards-signup"],
        }),
      });

      if (ivoreyResponse.ok) {
        console.log("Contact added to Ivorey via API successfully");
        return { success: true };
      }
    }

    console.error("No Ivorey integration configured. Set ZAPIER_WEBHOOK_URL or IVOREY_API_KEY in Netlify.");
    return { success: false, error: "No Ivorey integration configured" };

  } catch (error: any) {
    console.error("Error adding contact to Ivorey:", error);
    return { success: false, error: error.message };
  }
}