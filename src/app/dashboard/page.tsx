// src/app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import liff from '@line/liff';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const connectLine = async () => {
    await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });

    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    const profile = await liff.getProfile();

    const { error } = await supabase.from('users').update({
      line_id: profile.userId,
      avatar: profile.pictureUrl,
      display_name: profile.displayName,
    }).eq('id', user.id);

    if (error) return alert(error.message);
    alert('เชื่อม LINE สำเร็จ!');
  };

  return (
    <div>
      <h1>Welcome, {user?.email ?? 'Guest'}!</h1>
      <button onClick={connectLine}>เชื่อมบัญชี LINE</button>
    </div>
  );
}