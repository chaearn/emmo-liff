'use client';
import { useState } from 'react';
import { supabase } from '@utils/supabase/client';
import { useRouter } from 'next/navigation';

const AddUser: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter()
  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { data, error } = await supabase.from('users').insert([{ name }]).select().single();

    if (error) {
      setError(error.message);
    } else {
      setSuccess('User added successfully!');
      setName('');

      // ⏺ Save the inserted row id in localStorage
      if (data && data.id) {
        localStorage.setItem('pendingUserId', data.id.toString());
      }

      router.push('/login');
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div style={{ padding: '2rem', maxWidth: 400 }}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem'}}>
                <h1 style={{ fontWeight: 'bold', fontSize: '2rem'}}>ยินดีที่ได้รู้จัก 🌱</h1>
                <p>ตอนคุยกันให้เราเรียกเธอว่าอะไรดี?</p>    
            </div>
            <form onSubmit={handleAddUser}>
                <input
                type="text"
                placeholder="แนะนำตัวหน่อย"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                    padding: '0.5rem',
                    fontSize: '1rem',
                    width: '100%',
                    marginBottom: '1rem',
                    borderRadius: 8,
                    border: '1px solid #ccc',
                    textAlign: 'center'
                }}
                />
                <button type="submit"
                style={{
                    padding: '0.75rem',
                    width: '100%',
                    fontSize: '1rem',
                    borderRadius: 8,
                    backgroundColor: '#111827',
                    color: '#fff',
                    }}>Next</button>
            </form>
            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '1rem' }}>{success}</p>}
        </div>
        </main>
        </div>
  );
};

export default AddUser;