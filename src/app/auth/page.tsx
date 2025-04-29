// src/app/auth/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const nickname = localStorage.getItem('emmo_nickname') ?? '';

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