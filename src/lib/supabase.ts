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
            display_name: profile.display_name,
            avatar: profile.avatar,
        });
  
    if (error) {
        console.error('❌ Supabase error when saving user profile:', error.message);
    }
  
    const session = await supabase.auth.getSession();
    console.log('📦 Current Supabase session:', session);
  
    return { data, error };
  }

export default supabase;