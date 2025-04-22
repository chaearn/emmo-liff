'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { supabase } from '@/lib/supabase';
import type { LineProfile } from '@/lib/types';

export default function UpdateLatestUserWithLINE() {
    const [profile, setProfile] = useState<LineProfile | null>(null);
    const [latestUserId ] = useState<number | null>(null);
    const [displayName, setDisplayName] = useState('');
    const [avatar] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleLogout = () => {
        liff.logout();
        setProfile(null);
        window.location.replace('/login');
    };

    

  useEffect(() => {
    const start = async () => {
      try {
        alert("🟡 Starting LIFF init...");
        const searchParams = new URLSearchParams(window.location.search);
        const tempId = searchParams.get('temp');
        alert("The tempID: "+ tempId);
        // 🧠 Save tempId into localStorage BEFORE redirect
        if (tempId) {
        localStorage.setItem('pendingTempId', tempId);
        }
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
          withLoginOnExternalBrowser: true,
        });
        alert("✅ LIFF initialized");
        

        if (!liff.isLoggedIn()) {
          alert("🔁 Not logged in, redirecting...");
          liff.login({
            redirectUri: `${window.location.origin}/login#temp=${tempId}`,
          });
          return;
        }
  
        const token = liff.getAccessToken();
        alert(`🔐 Token: ${token}`);
  
        const rawProfile = await liff.getProfile();
        alert(`👤 Profile: ${rawProfile.displayName}`);

        const savedTempId = localStorage.getItem('pendingTempId');
      if (!savedTempId) {
        alert('❌ Missing temp ID');
        return;
      }

        const parsedProfile: LineProfile = {
            userId: rawProfile.userId,
            displayName: rawProfile.displayName,
            pictureUrl: rawProfile.pictureUrl || '', // fallback if undefined
          };

        const { error: updateError } = await supabase
            .from('emmo_users')
            .update({
                line_id: parsedProfile.userId,
                display_name: parsedProfile.displayName,
                avatar: parsedProfile.pictureUrl,
            })
            .eq('id', parseInt(savedTempId, 10)); // 💥 ใช้ id จาก URL query param

        if (updateError) {
            alert(`❌ Failed to update user: ${updateError.message}`);
        } else {
            alert('✅ LINE info updated!');
        }

        setProfile(parsedProfile);

        // ...rest of the logic...
      } catch (err) {
        if (err instanceof Error) {
          alert(`❌ Unexpected error: ${err.message}`);
        } else {
          alert('❌ Unknown error');
        }
      }
    };
  
    start();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!latestUserId || !profile) {
      setError('Missing user info');
      return;
    }

    const { error: updateError } = await supabase
      .from('emmo_users')
      .update({
        line_id: profile.userId,
        display_name: displayName,
        avatar: avatar,
      })
      .eq('id', latestUserId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess('User info updated!');
    }
  };

  if (!profile) return <p>Loading LINE profile...</p>;
  console.log('🎉 Profile loaded', profile)

  return (
    <div>
      <h1>Welcome, {profile.displayName}</h1>
      <img src={profile.pictureUrl} alt="profile" width={120} height={120} />
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Edit display name"
          required
        />
        <button type="submit">Update Latest User</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}