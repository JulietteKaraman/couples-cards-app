import { KIT_API_KEY } from "@/lib/environment";

// Kit (formerly ConvertKit) v4 API client — replaces the Ivorey/GHL sync,
// which shuts down on 17 July 2026.

const KIT_V4 = "https://api.kit.com/v4";

// Tag and sequence IDs live in Juliette's Kit account.
export const KIT_TAGS = {
  cardsFreeTaster: 20896609, // "cards-free-taster" — same tag the website taster page uses
  cardsPurchaseIntent: 20922438, // "cards-purchase-intent" — started checkout in the app
} as const;

export const KIT_SEQUENCES = {
  leadMagnetDelivery: 2825131, // "Cards Free Taster — Welcome" — same sequence the website taster page uses (repointed 14 Jul; old 2812534 was deleted in the Kit rewiring)
} as const;

export interface KitContact {
  email: string;
  firstName?: string;
  tagIds?: number[];
  sequenceId?: number;
}

export async function addContactToKit(
  contact: KitContact
): Promise<{ success: boolean; error?: string }> {
  if (!KIT_API_KEY) {
    console.log("KIT_API_KEY not set - skipping Kit sync for", contact.email);
    return { success: false, error: "KIT_API_KEY not configured" };
  }

  const headers = {
    "X-Kit-Api-Key": KIT_API_KEY,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const email = contact.email.toLowerCase();

  try {
    await fetch(`${KIT_V4}/subscribers`, {
      method: "POST",
      headers,
      body: JSON.stringify({ email_address: email, first_name: contact.firstName || "" }),
    });

    for (const tagId of contact.tagIds || []) {
      await fetch(`${KIT_V4}/tags/${tagId}/subscribers`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email_address: email }),
      });
    }

    if (contact.sequenceId) {
      await fetch(`${KIT_V4}/sequences/${contact.sequenceId}/subscribers`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email_address: email }),
      });
    }

    console.log("Contact synced to Kit:", email);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error("Kit sync error:", message);
    return { success: false, error: message };
  }
}
