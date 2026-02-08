import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "../environment";

export const supabaseBrowser = createClient<Database>(
  SUPABASE_URL!,
  SUPABASE_PUBLISHABLE_KEY!
);

export type EntitlementsRow = Database['public']['Tables']['entitlements']['Row'];
