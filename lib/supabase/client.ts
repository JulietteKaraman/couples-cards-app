import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "../environment";

export const supabaseBrowser = createClient(
  SUPABASE_URL!,
  SUPABASE_PUBLISHABLE_KEY!
);
