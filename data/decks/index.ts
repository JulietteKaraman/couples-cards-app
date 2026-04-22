import { TOUCH_LANGUAGES_CARDS, TOUCH_LANGUAGES_SECTIONS, TouchLanguagesSectionKey, TouchLanguagesCardPrompt } from "./touch-languages";
import { TRUST_REPAIR_CARDS, TRUST_REPAIR_SECTIONS, TrustRepairSectionKey, TrustRepairCardPrompt } from "./trust-repair";
import { COUPLES_CARDS, SECTIONS as COUPLES_SECTIONS, SectionKey as CouplesSectionKey, CardPrompt as CouplesCardPrompt } from "./couples";
import { FRIENDS_CARDS, FRIENDS_SECTIONS, FriendsSectionKey, FriendsCardPrompt } from "./friends";

export type DeckType = "couples" | "friends" | "touch-languages" | "trust-repair";

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
    totalCards: 152,
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
};

export const CORE_COLLECTION_CONFIG = {
  id: "core-collection",
  name: "Core Collection",
  description: "Get Couples and Friends & Family editions together",
  price: 55,
  stripePriceId: process.env.STRIPE_CORE_COLLECTION_PRICE_ID || "",
  savings: 15,
  includes: ["couples", "friends"] as DeckType[],
};

export const BUNDLE_CONFIG = CORE_COLLECTION_CONFIG;

export const FULL_CORE_SET_CONFIG = {
  id: "full-core-set",
  name: "Full Core Set",
  description: "Get all three core decks: Touch Languages, Couples, and Friends & Family",
  price: 75,
  stripePriceId: process.env.STRIPE_FULL_CORE_SET_PRICE_ID || "",
  savings: 30,
  includes: ["couples", "friends", "touch-languages"] as DeckType[],
};

export const ALL_THREE_BUNDLE_CONFIG = FULL_CORE_SET_CONFIG;

export const EVERYTHING_CONFIG = {
  id: "everything",
  name: "Everything",
  description: "Get all four decks: Touch Languages, Couples, Friends & Family, and Trust & Repair",
  price: 85,
  stripePriceId: process.env.STRIPE_EVERYTHING_PRICE_ID || "",
  savings: 60,
  includes: ["couples", "friends", "touch-languages", "trust-repair"] as DeckType[],
};

export function getDeck(deckType: DeckType): DeckConfig {
  return DECKS[deckType];
}

export function getAllDecks(): DeckConfig[] {
  return Object.values(DECKS);
}

export function isValidDeck(deckType: string): deckType is DeckType {
  return deckType === "couples" || deckType === "friends" || deckType === "touch-languages" || deckType === "trust-repair";
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
};