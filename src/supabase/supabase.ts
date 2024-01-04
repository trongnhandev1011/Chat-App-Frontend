import { SupabaseClient, createClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabase: SupabaseClient<any, "public", any>;

export const getSupabaseInstance = () => {
  if (supabase == null) {
    supabase = createClient(
      "https://gfobuirdbpqwrhfjpvgj.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdmb2J1aXJkYnBxd3JoZmpwdmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQyOTk5NjMsImV4cCI6MjAxOTg3NTk2M30.kVdRyBhCtZnUsGtXE0QCZlqT6AukdxSAkeg4wQAd7qU"
    );
  }

  return supabase;
};
