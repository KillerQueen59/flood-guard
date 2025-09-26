import { createClientComponentClient } from "@/lib/supabase-clients";

export const login = async (data: { email: string; password: string }) => {
  const supabase = createClientComponentClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { message: "Login successful!" };
};
