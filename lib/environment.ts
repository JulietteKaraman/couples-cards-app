

// Supabase (available on both client and server
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
export const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;
export const SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

// Site URL (client-available)
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;

// Stripe (server-only)
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_SECRET_KEY;
export const STRIPE_COUPLES_PRICE_ID = process.env.STRIPE_COUPLES_PRICE_ID ?? process.env.STRIPE_COUPLES_PRICE_ID;
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? process.env.STRIPE_WEBHOOK_SECRET;