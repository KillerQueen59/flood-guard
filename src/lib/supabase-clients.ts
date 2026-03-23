import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./supabase-config";

const supabaseUrl = getSupabaseUrl();
const supabaseAnonKey = getSupabaseAnonKey();

// Client-side Supabase client for browser components
export function createClientComponentClient() {
  console.log("Creating Supabase client with URL:", supabaseUrl);

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
