'use client'
import type { LineProfile, UserProfile } from '@/lib/types';

import { useEffect, useState } from 'react'
import liff from '@line/liff'
import { saveUserProfile } from '@/lib/supabase'

const handleLogout = () => {
    liff.logout();
    window.location.replace('/login'); // หรือใช้ router.replace('/login') ก็ได้
};

export default function LoginPage() {
    const platform = 'line';
  const [profile, setProfile] = useState<LineProfile | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        if (platform === 'line') {
          await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })

          if (!liff.isLoggedIn()) {
            liff.login()
          } else {
            const rawProfile = await liff.getProfile();

            const userProfile: LineProfile = {
            userId: rawProfile.userId,
            displayName: rawProfile.displayName,
            pictureUrl: rawProfile.pictureUrl ?? '', // ✅ fallback ถ้า undefined
            };
            setProfile(userProfile);

            const payload: UserProfile = {
                line_id: userProfile.userId,
                display_name: userProfile.displayName,
                avatar: userProfile.pictureUrl
            };

            const result = await saveUserProfile(payload);
            const error = result?.error;

            if (error) console.error('Supabase error:', error)
          }
        }
        // TODO: Add more platform auth (e.g., Facebook) here
      } catch (err) {
        console.error(`${platform} init error:`, err)
      }
    }

    init()
  }, [platform])

  if (!profile) return <p>Loading...</p>

  return (
    <div>
      <h1>Welcome, {profile?.displayName}</h1>
        <img
        src={profile.pictureUrl ?? ''}
        alt="profile"
        width={120}
        height={120}
        />
        <button onClick={handleLogout}>
            Logout
        </button>
    </div>
  )
}

