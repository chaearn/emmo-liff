// src/app/auth/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabase';
// import { supabase } from '@utils/supabase/client.ts';
import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedNickname = localStorage.getItem('emmo_nickname') ?? '';
    setNickname(storedNickname);
  }, []);

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return alert(error.message);

    const { error: insertError } = await supabase
      .from('users')
      .upsert({ id: data.user?.id, prefer_name: nickname });

    if (insertError) return alert(insertError.message);
    router.push('/dashboard');
  };

  const handleGuest = async () => {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) return alert(error.message);

    await supabase.from('users').upsert({
      id: data.user?.id,
      prefer_name: nickname,
    });

    router.push('/dashboard');
  };

  return (
    <div>
      <h1>เข้าสู่ระบบ / Guest</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign up</button>
      <hr />
      <button onClick={handleGuest}>Continue as guest</button>
    </div>
  );
}