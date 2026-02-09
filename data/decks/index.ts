import { COUPLES_CARDS, SECTIONS as COUPLES_SECTIONS, SectionKey as CouplesSectionKey, CardPrompt as CouplesCardPrompt } from "./couples";
import { FRIENDS_CARDS, FRIENDS_SECTIONS, FriendsSectionKey, FriendsCardPrompt } from "./friends";

export type DeckType = "couples" | "friends";

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
    price: 25,
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
    price: 25,
    stripePriceId: process.env.STRIPE_FRIENDS_PRICE_ID || "",
    coverImage: "/cards/friends/cover.png",
    sections: FRIENDS_SECTIONS,
    cards: FRIENDS_CARDS,
    totalCards: 152,
  },
};

export const BUNDLE_CONFIG = {
  id: "bundle",
  name: "Complete Collection",
  description: "Get both Couples and Friends & Family editions",
  price: 45,
  stripePriceId: process.env.STRIPE_BUNDLE_PRICE_ID || "",
  savings: 5,
  includes: ["couples", "friends"] as DeckType[],
};

export function getDeck(deckType: DeckType): DeckConfig {
  return DECKS[deckType];
}

export function getAllDecks(): DeckConfig[] {
  return Object.values(DECKS);
}

export function isValidDeck(deckType: string): deckType is DeckType {
  return deckType === "couples" || deckType === "friends";
}

export type { CouplesSectionKey, CouplesCardPrompt, FriendsSectionKey, FriendsCardPrompt };