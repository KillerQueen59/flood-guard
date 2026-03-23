import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceKey, getSupabaseUrl } from "./supabase-config";

const supabaseUrl = getSupabaseUrl();
const supabaseServiceRoleKey = getSupabaseServiceKey();

export const supabaseServer = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);
