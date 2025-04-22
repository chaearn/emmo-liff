'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const AddUser: React.FC = () => {
  const [name, setName] = useState('');
  const [rowId, setRowId] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAddUser = async () => {
    setError('');
    setSuccess('');

    const tempId = uuidv4();

    const { error: insertError } = await supabase.from('users').insert([
      {
        name,
        display_name: tempId, // ใช้ tempId ชั่วคราวไว้ตามหา row
      },
    ]);

    if (insertError) {
      setError(`❌ เกิดข้อผิดพลาด: ${insertError.message}`);
      return;
    }

    // 🔍 หา row ที่เพิ่งสร้างจาก display_name = tempId
    const { data: match, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('display_name', tempId)
      .order('id', { ascending: false })
      .limit(1);

    if (selectError || !match || match.length === 0) {
      setError('❌ ไม่สามารถค้นหา row ที่เพิ่งเพิ่มได้');
      return;
    }

    setRowId(match[0].id);
    setSuccess('✅ บันทึกชื่อเรียบร้อยแล้ว 🎉');
    setName('');
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
                placeholder="ใส่ชื่อเล่นของเธอ..."
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
                <button
                  onClick={handleAddUser}
                  className="bg-black text-white px-6 py-2 rounded"
                >
                  💾 บันทึกชื่อ
                </button>
                {success && (
                  <>
                    <p className="text-green-600">{success}</p>
                    <button
                      onClick={() => router.push(`/login?temp=${rowId}`)}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
                    >
                      ➡️ ไปต่อเลย
                    </button>
                  </>
                )}
                
            </form>
            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
            
        </div>
        </main>
        </div>
  );
};

export default AddUser;