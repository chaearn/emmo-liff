'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { supabase } from '@/lib/supabase';
import type { LineProfile } from '@/lib/types';

export default function ProfilePage() {
  const [profile, setProfile] = useState<LineProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  
  const handleLogout = async () => {
    await liff.init({
        liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
      });
    liff.logout();
    setProfile(null);
    localStorage.clear();
    window.location.replace('/login');
  };

  useEffect(() => {
    const start = async () => {
      const storedProfile = localStorage.getItem('lineProfile');
      const storedNickname = localStorage.getItem('userNickname');

      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setProfile(parsed);
        setDisplayName(parsed.displayName);
        setAvatar(parsed.pictureUrl);
        if (storedNickname) setNickname(storedNickname);
      } else {
        window.location.href = '/login';
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('emmo_users')
        .select('line_id, avatar')
        .eq('line_id', JSON.parse(storedProfile).userId)
        .single();

      if (fetchError) {
        console.error('❌ Fetch Error:', fetchError.message);
        setError(`❌ ดึงข้อมูลล้มเหลว: ${fetchError.message}`);
      } else {
        localStorage.setItem('lineID', data.line_id);
        console.log('📥 LINE ID:', data.line_id);
      }
    };

    start();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!profile) {
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
      .eq('line_id', profile.userId);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess('User info updated!');
    }
  };

  return (
    <div>
      <h1>Welcome, {nickname || profile?.displayName}</h1>
      <img src={avatar} alt="profile" width={120} height={120} />
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