import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_HOST as string,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY as string
);

export default supabase;
