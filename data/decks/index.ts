import { TOUCH_LANGUAGES_CARDS, TOUCH_LANGUAGES_SECTIONS, TouchLanguagesSectionKey, TouchLanguagesCardPrompt } from "./touch-languages";
import { COUPLES_CARDS, SECTIONS as COUPLES_SECTIONS, SectionKey as CouplesSectionKey, CardPrompt as CouplesCardPrompt } from "./couples";
import { FRIENDS_CARDS, FRIENDS_SECTIONS, FriendsSectionKey, FriendsCardPrompt } from "./friends";

export type DeckType = "couples" | "friends" | "touch-languages";

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
  "touch-languages": {
    id: "touch-languages",
    name: "The Touch Languages\u2122",
    description: "Explore the 5 languages of touch: Erotic, Physical, Emotional, Spiritual, and Energetic",
    price: 25,
    stripePriceId: process.env.STRIPE_TOUCH_LANGUAGES_PRICE_ID || "",
    coverImage: "/cards/touch/cover.png",
    sections: TOUCH_LANGUAGES_SECTIONS,
    cards: TOUCH_LANGUAGES_CARDS,
    totalCards: 125,
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

export const ALL_THREE_BUNDLE_CONFIG = {
  id: "all-three",
  name: "Ultimate Collection",
  description: "Get all three decks: Couples, Friends & Family, and The Touch Languages",
  price: 60,
  stripePriceId: process.env.STRIPE_ALL_THREE_PRICE_ID || "",
  savings: 15,
  includes: ["couples", "friends", "touch-languages"] as DeckType[],
};

export function getDeck(deckType: DeckType): DeckConfig {
  return DECKS[deckType];
}

export function getAllDecks(): DeckConfig[] {
  return Object.values(DECKS);
}

export function isValidDeck(deckType: string): deckType is DeckType {
  return deckType === "couples" || deckType === "friends" || deckType === "touch-languages";
}

export type { 
  CouplesSectionKey, 
  CouplesCardPrompt, 
  FriendsSectionKey, 
  FriendsCardPrompt,
  TouchLanguagesSectionKey,
  TouchLanguagesCardPrompt,
};
