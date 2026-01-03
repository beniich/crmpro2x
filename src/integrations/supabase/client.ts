import { createClient } from "@supabase/supabase-js";
import { supabase as mockSupabase } from "./client.mock";
import type { Database } from "./types";

// Import types from potential real client source
import type { Session as SupabaseSession, User as SupabaseUser } from "@supabase/supabase-js";
// Import types from mock
import type { Session as MockSession, User as MockUser } from "./client.mock";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export unified types to support both modes
export type User = SupabaseUser | MockUser;
export type Session = SupabaseSession | MockSession;

// Export the client
// If env vars are present, use real Supabase. Otherwise, use mock.
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient<Database>(supabaseUrl, supabaseKey)
  : mockSupabase;

// Log mode for debugging
console.log(`[Supabase] Running in ${supabaseUrl && supabaseKey ? 'REAL' : 'MOCK'} mode`);
