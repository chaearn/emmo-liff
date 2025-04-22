'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { supabase } from '@/lib/supabase';
import type { LineProfile } from '@/lib/types';

export default function UpdateLatestUserWithLINE() {
  const [profile, setProfile] = useState<LineProfile | null>(null);
  const [latestUserId, setLatestUserId] = useState<number | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

        const rawProfile = await liff.getProfile();
        const userProfile: LineProfile = {
          userId: rawProfile.userId,
          displayName: rawProfile.displayName,
          pictureUrl: rawProfile.pictureUrl ?? '',
        };
        setProfile(userProfile);
        setDisplayName(userProfile.displayName);
        setAvatar(userProfile.pictureUrl ?? '');

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          const { error: anonLoginError } = await supabase.auth.signInAnonymously();
          if (anonLoginError) {
            console.error('❌ Failed to sign in anonymously:', anonLoginError.message);
            return;
          }
        }

        // Fetch latest user
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('id')
          .order('id', { ascending: false })
          .limit(1)
          .single();

        if (fetchError) {
          setError(fetchError.message);
        } else if (data) {
          setLatestUserId(data.id);
        }
      } catch (err) {
        console.error('❌ init error:', err);
      }
    };

    init();
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
      .from('users')
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