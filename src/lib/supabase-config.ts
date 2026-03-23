const sanitizeEnv = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  return trimmed;
};

const deriveSupabaseHttpUrl = (rawValue?: string): string | undefined => {
  const value = sanitizeEnv(rawValue);
  if (!value) return undefined;

  // Already a valid Supabase project URL.
  if (value.startsWith("https://") && value.includes(".supabase.co")) {
    return value;
  }

  // Sometimes DATABASE_URL is used by mistake here; derive project ref from db.<ref>.supabase.co.
  const dbHostMatch = value.match(/db\.([a-z0-9-]+)\.supabase\.co/i);
  if (dbHostMatch?.[1]) {
    return `https://${dbHostMatch[1]}.supabase.co`;
  }

  // Support plain project ref in env.
  if (/^[a-z0-9-]+$/i.test(value)) {
    return `https://${value}.supabase.co`;
  }

  return undefined;
};

export const getSupabaseUrl = (): string => {
  const candidates = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
    process.env.DATABASE_URL,
    process.env.DIRECT_URL,
  ];

  for (const candidate of candidates) {
    const resolved = deriveSupabaseHttpUrl(candidate);
    if (resolved) return resolved;
  }

  throw new Error(
    "Missing Supabase project URL. Set NEXT_PUBLIC_SUPABASE_URL (https://<project-ref>.supabase.co).",
  );
};

export const getSupabaseUrlCandidates = (): string[] => {
  const rawCandidates = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
    process.env.DATABASE_URL,
    process.env.DIRECT_URL,
  ];

  const candidates = rawCandidates
    .map((candidate) => deriveSupabaseHttpUrl(candidate))
    .filter((candidate): candidate is string => Boolean(candidate));

  return Array.from(new Set(candidates));
};

export const getSupabaseAnonKey = (): string => {
  const key = sanitizeEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  if (!key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable",
    );
  }
  return key;
};

export const getSupabaseServiceKey = (): string => {
  return (
    sanitizeEnv(process.env.SUPABASE_SERVICE_ROLE_KEY) || getSupabaseAnonKey()
  );
};
