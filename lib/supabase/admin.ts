import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } from "@/lib/environment";

export const supabaseAdmin = createClient<Database>(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export type EntitlementsRow = Database['public']['Tables']['entitlements']['Row'];
