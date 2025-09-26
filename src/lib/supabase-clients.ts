import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client for browser components
export function createClientComponentClient() {
  console.log("Creating Supabase client with URL:", supabaseUrl);

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
