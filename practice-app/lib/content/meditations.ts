// Juliette's own guided meditations and hypnosis for Scrumptious Confessions (specs/living-library.md).
// Voices confirmed by Juliette 19 Nov 2026. Three open on Monday 23 November (doors open), then one more
// every Friday. Files live in the PRIVATE "drops" bucket at meditations/<slug>.m4a, uploaded once at
// /admin/meditations. NEVER add: Marisa Peer, LWL, Dr Joe Dispenza, Guided Visualization, Money Mountain,
// Chakra Wisdom, The Future Self, REMAINS, RELEASE 2018, or any client recording (Rupertmeditation).
export type Meditation = { slug: string; title: string; minutes: number; shelves: string[]; publish_on: string };
export const meditationPath = (slug: string) => `meditations/${slug}.m4a`;
export const MEDITATIONS: Meditation[] = [
  {
    "slug": "feeling-safe",
    "title": "Feeling Safe & Touch Base",
    "minutes": 10,
    "shelves": [
      "touch",
      "safe"
    ],
    "publish_on": "2026-11-23"
  },
  {
    "slug": "body-confidence-and-peace",
    "title": "Body Confidence and Peace",
    "minutes": 17,
    "shelves": [
      "touch",
      "safe",
      "calm"
    ],
    "publish_on": "2026-11-23"
  },
  {
    "slug": "sleep-tight",
    "title": "Sleep Tight",
    "minutes": 9,
    "shelves": [
      "calm"
    ],
    "publish_on": "2026-11-23"
  },
  {
    "slug": "the-haven-of-peace",
    "title": "The Haven of Peace",
    "minutes": 9,
    "shelves": [
      "safe",
      "calm"
    ],
    "publish_on": "2026-11-27"
  },
  {
    "slug": "complete-body-mediation",
    "title": "Complete Body",
    "minutes": 14,
    "shelves": [
      "numb",
      "touch"
    ],
    "publish_on": "2026-12-04"
  },
  {
    "slug": "healing-shame-meditation",
    "title": "Healing Shame",
    "minutes": 6,
    "shelves": [
      "shame"
    ],
    "publish_on": "2026-12-11"
  },
  {
    "slug": "pleasure-boost-new",
    "title": "Pleasure Boost",
    "minutes": 24,
    "shelves": [
      "desire"
    ],
    "publish_on": "2026-12-18"
  },
  {
    "slug": "trust-again",
    "title": "Trust Again",
    "minutes": 19,
    "shelves": [
      "us",
      "safe"
    ],
    "publish_on": "2026-12-25"
  },
  {
    "slug": "10-min-anxiety-meditation",
    "title": "Ten Minutes for Anxiety",
    "minutes": 11,
    "shelves": [
      "calm"
    ],
    "publish_on": "2027-01-01"
  },
  {
    "slug": "erotic-guided-meditation-for-women",
    "title": "An Erotic Meditation for Women",
    "minutes": 19,
    "shelves": [
      "desire"
    ],
    "publish_on": "2027-01-08"
  },
  {
    "slug": "part-1-men-s-sexual-confidence",
    "title": "Men's Sexual Confidence",
    "minutes": 13,
    "shelves": [
      "desire",
      "men"
    ],
    "publish_on": "2027-01-15"
  },
  {
    "slug": "positive-body-image",
    "title": "Positive Body Image",
    "minutes": 10,
    "shelves": [
      "touch"
    ],
    "publish_on": "2027-01-22"
  },
  {
    "slug": "surrender-meditation",
    "title": "Surrender",
    "minutes": 22,
    "shelves": [
      "safe"
    ],
    "publish_on": "2027-01-29"
  },
  {
    "slug": "juliette-karaman-voice-and-music",
    "title": "Activation",
    "minutes": 22,
    "shelves": [
      "numb"
    ],
    "publish_on": "2027-02-05"
  },
  {
    "slug": "believe-in-yourself",
    "title": "Believe in Yourself",
    "minutes": 14,
    "shelves": [
      "shame"
    ],
    "publish_on": "2027-02-12"
  },
  {
    "slug": "hypnosis-body-image-part-1",
    "title": "Body Image Hypnosis",
    "minutes": 23,
    "shelves": [
      "touch"
    ],
    "publish_on": "2027-02-19"
  },
  {
    "slug": "r4-for-body-wisdom-part-1",
    "title": "Body Wisdom",
    "minutes": 10,
    "shelves": [
      "numb",
      "touch"
    ],
    "publish_on": "2027-02-26"
  },
  {
    "slug": "10-min-chakra-balance-guided-meditation",
    "title": "Chakra Balance",
    "minutes": 10,
    "shelves": [
      "calm"
    ],
    "publish_on": "2027-03-05"
  },
  {
    "slug": "chakra-meditation-v2-2",
    "title": "Chakra Meditation",
    "minutes": 35,
    "shelves": [
      "calm"
    ],
    "publish_on": "2027-03-12"
  },
  {
    "slug": "chakras-breath-work",
    "title": "Chakras Breath Work",
    "minutes": 34,
    "shelves": [
      "calm"
    ],
    "publish_on": "2027-03-19"
  },
  {
    "slug": "time-to-come-back-to-a-safe-place-to-feeling-fully-you",
    "title": "Come Back to a Safe Place",
    "minutes": 6,
    "shelves": [
      "safe"
    ],
    "publish_on": "2027-03-26"
  },
  {
    "slug": "divine-love-meditation",
    "title": "Divine Love",
    "minutes": 20,
    "shelves": [
      "desire",
      "us"
    ],
    "publish_on": "2027-04-02"
  },
  {
    "slug": "ease-guided-meditation-have-better-sex",
    "title": "Ease",
    "minutes": 7,
    "shelves": [
      "numb",
      "desire"
    ],
    "publish_on": "2027-04-09"
  },
  {
    "slug": "feel-the-full-perfect-you",
    "title": "Feel the Full, Perfect You",
    "minutes": 48,
    "shelves": [
      "numb"
    ],
    "publish_on": "2027-04-16"
  },
  {
    "slug": "anxiety-meditation-15-min",
    "title": "Fifteen Minutes for Anxiety",
    "minutes": 16,
    "shelves": [
      "calm"
    ],
    "publish_on": "2027-04-23"
  },
  {
    "slug": "gratitudes",
    "title": "Gratitudes",
    "minutes": 3,
    "shelves": [
      "calm"
    ],
    "publish_on": "2027-04-30"
  },
  {
    "slug": "i-am-free",
    "title": "I Am Free",
    "minutes": 3,
    "shelves": [
      "calm"
    ],
    "publish_on": "2027-05-07"
  },
  {
    "slug": "dp2-second-part",
    "title": "Letting Go of an Unwanted Feeling",
    "minutes": 26,
    "shelves": [
      "calm"
    ],
    "publish_on": "2027-05-14"
  },
  {
    "slug": "loving-compassion-hypnosis",
    "title": "Loving Compassion",
    "minutes": 27,
    "shelves": [
      "us"
    ],
    "publish_on": "2027-05-21"
  },
  {
    "slug": "hypnosis-for-meeting-your-inner-child",
    "title": "Meeting Your Inner Child",
    "minutes": 42,
    "shelves": [
      "shame"
    ],
    "publish_on": "2027-05-28"
  },
  {
    "slug": "meditation-for-mind-clarity",
    "title": "Mental Clarity",
    "minutes": 16,
    "shelves": [
      "calm"
    ],
    "publish_on": "2027-06-04"
  },
  {
    "slug": "mindfulness-meditation-longer",
    "title": "Mindfulness",
    "minutes": 8,
    "shelves": [
      "calm"
    ],
    "publish_on": "2027-06-11"
  },
  {
    "slug": "money-activation-v2",
    "title": "Money Activation",
    "minutes": 19,
    "shelves": [
      "numb",
      "calm"
    ],
    "publish_on": "2027-06-18"
  },
  {
    "slug": "old-habits-v2",
    "title": "Old Habits",
    "minutes": 24,
    "shelves": [
      "shame"
    ],
    "publish_on": "2027-06-25"
  },
  {
    "slug": "15-min-guided-meditation-to-find-peace-in-uncertain-times",
    "title": "Peace in Uncertain Times",
    "minutes": 15,
    "shelves": [
      "safe",
      "calm"
    ],
    "publish_on": "2027-07-02"
  },
  {
    "slug": "hypnosis-for-relating-to-food",
    "title": "Relating to Food",
    "minutes": 34,
    "shelves": [
      "touch",
      "shame"
    ],
    "publish_on": "2027-07-09"
  },
  {
    "slug": "last-3-minutes-release-all-negative-energy",
    "title": "Release Negative Energy",
    "minutes": 16,
    "shelves": [
      "numb",
      "desire",
      "calm"
    ],
    "publish_on": "2027-07-16"
  },
  {
    "slug": "release-your-fears-part-1",
    "title": "Release Your Fears",
    "minutes": 8,
    "shelves": [
      "numb",
      "desire",
      "safe",
      "calm"
    ],
    "publish_on": "2027-07-23"
  },
  {
    "slug": "feel-fully-you-self-care-manifesto",
    "title": "Self-Care Manifesto",
    "minutes": 3,
    "shelves": [
      "calm"
    ],
    "publish_on": "2027-07-30"
  },
  {
    "slug": "sensual-journey",
    "title": "Sensual Journey",
    "minutes": 34,
    "shelves": [
      "numb",
      "touch",
      "desire"
    ],
    "publish_on": "2027-08-06"
  },
  {
    "slug": "stop-self-sabotage",
    "title": "Stop Self-Sabotage",
    "minutes": 26,
    "shelves": [
      "shame"
    ],
    "publish_on": "2027-08-13"
  },
  {
    "slug": "weight-loss",
    "title": "Weight Loss",
    "minutes": 15,
    "shelves": [
      "touch"
    ],
    "publish_on": "2027-08-20"
  },
  {
    "slug": "relationship-to-food-hypnotherapy",
    "title": "Your Relationship with Food",
    "minutes": 23,
    "shelves": [
      "touch",
      "shame"
    ],
    "publish_on": "2027-08-27"
  }
];
