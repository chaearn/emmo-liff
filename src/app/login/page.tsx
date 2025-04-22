'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { saveUserProfile, supabase } from '@/lib/supabase';
import type { LineProfile, UserProfile } from '@/lib/types';

export default function LoginPage() {
  const [profile, setProfile] = useState<LineProfile | null>(null);

  const handleLogout = () => {
    liff.logout();
    setProfile(null);
    window.location.replace('/login');
  };

  useEffect(() => {
    const init = async () => {
      try {
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
          withLoginOnExternalBrowser: false,
        });

        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }

        // ✅ Get LINE Profile
        const rawProfile = await liff.getProfile();
        const userProfile: LineProfile = {
          userId: rawProfile.userId,
          displayName: rawProfile.displayName,
          pictureUrl: rawProfile.pictureUrl ?? '',
        };
        setProfile(userProfile);

        // ✅ Check if Supabase already has session
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          const { error: anonLoginError } = await supabase.auth.signInAnonymously();
          if (anonLoginError) {
            console.error('❌ Failed to sign in anonymously:', anonLoginError.message);
            return;
          }
        }

        // ✅ Save user to Supabase
        const payload: UserProfile = {
          line_id: userProfile.userId,
          display_name: userProfile.displayName,
          avatar: userProfile.pictureUrl,
        };
        const { error: saveError } = await saveUserProfile(payload);
        if (saveError) console.error('❌ Supabase save error:', saveError.message);
      } catch (err) {
        console.error('❌ init error:', err);
      }
    };

    init();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {profile.displayName}</h1>
      <img src={profile.pictureUrl} alt="profile" width={120} height={120} />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}