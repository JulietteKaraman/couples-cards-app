import { TOUCH_LANGUAGES_CARDS, TOUCH_LANGUAGES_SECTIONS, TouchLanguagesSectionKey, TouchLanguagesCardPrompt } from "./touch-languages";
import { TRUST_REPAIR_CARDS, TRUST_REPAIR_SECTIONS, TrustRepairSectionKey, TrustRepairCardPrompt } from "./trust-repair";
import { COUPLES_CARDS, SECTIONS as COUPLES_SECTIONS, SectionKey as CouplesSectionKey, CardPrompt as CouplesCardPrompt } from "./couples";
import { FRIENDS_CARDS, FRIENDS_SECTIONS, FriendsSectionKey, FriendsCardPrompt } from "./friends";
import { ONE_TOUCH_CARDS, ONE_TOUCH_SECTIONS, OneTouchSectionKey, OneTouchCardPrompt } from "./one-touch";
import { REPAIR_KIT_CARDS, REPAIR_KIT_SECTIONS, REPAIR_KIT_PHASES, RepairKitSectionKey, RepairKitCardPrompt } from "./repair-kit";
import { HOLIDAY_SURVIVAL_CARDS, HOLIDAY_SURVIVAL_SECTIONS, HolidaySurvivalSectionKey, HolidaySurvivalCardPrompt } from "./holiday-survival";

export type DeckType = "couples" | "friends" | "touch-languages" | "trust-repair" | "one-touch" | "repair-kit" | "holiday-survival";

// Decks worked one card at a time in a fixed order (the journey player),
// instead of the random-draw page.
export const SEQUENTIAL_DECKS: DeckType[] = ["repair-kit"];
export function isSequentialDeck(deckType: string): boolean {
  return (SEQUENTIAL_DECKS as string[]).includes(deckType);
}

export type SectionConfig = {
  title: string;
  coverImg: string;
  templateImg: string;
};

export type PromptLine = { text: string; bold?: boolean };

export type CardData = {
  id: number;
  section: string;
  lines: PromptLine[];
};

export type DeckConfig = {
  id: DeckType;
  name: string;
  description: string;
  price: number;
  stripePriceId: string;
  coverImage: string;
  sections: Record<string, SectionConfig>;
  cards: CardData[];
  totalCards: number;
};

export const DECKS: Record<DeckType, DeckConfig> = {
  couples: {
    id: "couples",
    name: "Couples Edition",
    description: "Deepen your connection with your partner through meaningful conversations",
    price: 35,
    stripePriceId: process.env.STRIPE_COUPLES_PRICE_ID || "",
    coverImage: "/cards/couples/cover.png",
    sections: COUPLES_SECTIONS,
    cards: COUPLES_CARDS,
    totalCards: 150,
  },
  friends: {
    id: "friends",
    name: "Friends & Family Edition",
    description: "Strengthen bonds with friends and family through heartfelt conversations",
    price: 35,
    stripePriceId: process.env.STRIPE_FRIENDS_PRICE_ID || "",
    coverImage: "/cards/friends/cover.png",
    sections: FRIENDS_SECTIONS,
    cards: FRIENDS_CARDS,
    totalCards: 153,
  },
  "touch-languages": {
    id: "touch-languages",
    name: "The Touch Languages\u2122",
    description: "Explore the 5 languages of touch: Erotic, Physical, Emotional, Spiritual, and Energetic",
    price: 35,
    stripePriceId: process.env.STRIPE_TOUCH_LANGUAGES_PRICE_ID || "",
    coverImage: "/cards/touch/cover.png",
    sections: TOUCH_LANGUAGES_SECTIONS,
    cards: TOUCH_LANGUAGES_CARDS,
    totalCards: 125,
  },
  "trust-repair": {
    id: "trust-repair",
    name: "Trust & Repair",
    description: "Navigate the drift and return to trust together",
    price: 15,
    stripePriceId: process.env.STRIPE_TRUST_REPAIR_PRICE_ID || "",
    coverImage: "/cards/trust/cover.png",
    sections: TRUST_REPAIR_SECTIONS,
    cards: TRUST_REPAIR_CARDS,
    totalCards: 50,
  },
  "one-touch": {
    id: "one-touch",
    name: "One Touch",
    description: "Part of the One Touch course. A daily prompt to meet your own body and voice.",
    price: 0,
    stripePriceId: "",
    coverImage: "/cards/one-touch/cover.png",
    sections: ONE_TOUCH_SECTIONS,
    cards: ONE_TOUCH_CARDS,
    totalCards: 23,
  },
  "repair-kit": {
    id: "repair-kit",
    name: "The Romantic Relationship Repair Kit",
    description: "31 prompts, worked in order across five modules, to move from drift back to trust.",
    price: 0,
    stripePriceId: "",
    coverImage: "/cards/repair-kit/cover.png",
    sections: REPAIR_KIT_SECTIONS,
    cards: REPAIR_KIT_CARDS,
    totalCards: 31,
  },
  "holiday-survival": {
    id: "holiday-survival",
    name: "The Holiday Survival Kit",
    description: "25 prompts to move through holiday stress into real connection, rooted in the Dyad Technique.",
    price: 0,
    stripePriceId: "",
    coverImage: "/cards/holiday/cover.png",
    sections: HOLIDAY_SURVIVAL_SECTIONS,
    cards: HOLIDAY_SURVIVAL_CARDS,
    totalCards: 25,
  },
};

export const FULL_SET_CONFIG = {
  id: "full-set",
  name: "Full Set",
  description: "Get all three decks: Trust & Repair, Couples, and Friends & Family",
  price: 55,
  stripePriceId: process.env.STRIPE_FULL_SET_PRICE_ID || "",
  savings: 30,
  includes: ["trust-repair", "couples", "friends"] as DeckType[],
};

export function getDeck(deckType: DeckType): DeckConfig {
  return DECKS[deckType];
}

export function getAllDecks(): DeckConfig[] {
  return Object.values(DECKS);
}

export function isValidDeck(deckType: string): deckType is DeckType {
  return deckType === "couples" || deckType === "friends" || deckType === "touch-languages" || deckType === "trust-repair" || deckType === "one-touch" || deckType === "repair-kit" || deckType === "holiday-survival";
}

export type {
  CouplesSectionKey,
  CouplesCardPrompt,
  FriendsSectionKey,
  FriendsCardPrompt,
  TouchLanguagesSectionKey,
  TouchLanguagesCardPrompt,
  TrustRepairSectionKey,
  TrustRepairCardPrompt,
  OneTouchSectionKey,
  OneTouchCardPrompt,
  RepairKitSectionKey,
  RepairKitCardPrompt,
  HolidaySurvivalSectionKey,
  HolidaySurvivalCardPrompt,
};

export { REPAIR_KIT_PHASES };