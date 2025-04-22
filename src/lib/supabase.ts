import { createClient } from '@supabase/supabase-js';
import type { UserProfile } from '@/lib/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

type SupabaseResult = {
  data: unknown;
  error: Error | null;
};

export async function saveUserProfile(profile: UserProfile): Promise<SupabaseResult> {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      line_id: profile.line_id,
      name: profile.name,
      avatar: profile.avatar,
    });

  return { data, error };
}

export default supabase;