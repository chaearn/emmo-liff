'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@utils/supabase/client';
import { v4 as uuidv4 } from 'uuid';

const AddUserPage: React.FC = () => {
  const [name, setName] = useState('');
  const [tempId, setTempId] = useState<string | null>(null); // save uuid only
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAddUser = async () => {
    setError('');
    setSuccess('');
    const newTempId = uuidv4();
    setTempId(newTempId);

    const { data: insertData, error: insertError } = await supabase
      .from('emmo_users')
      .insert([
        { name, display_name: newTempId },
      ])
      .select('id, name'); // Ensure select is chained correctly

    if (insertError) {
      console.error('❌ Insert Error:', insertError.message);
      setError(`❌ บันทึกล้มเหลว: ${insertError.message}`);
      return;
    } else {
      
      const userID = localStorage.getItem('userID');
      console.log('📥 Saved user ID:', userID);
      
    }
    
    const newUserId :string = insertData[0].id; // Get the ID of the newly created row
    console.log('📥 New user ID:', newUserId);
    localStorage.setItem('userID', newUserId);
    // Store the nickname in local storage
    localStorage.setItem('userNickname', name);
    
    
    setSuccess('✅ บันทึกชื่อเรียบร้อยแล้ว 🎉');
    console.log('user nickname:', localStorage.getItem('userNickname'));
    
    // setName('');
  };

  const handleFindRow = async () => {
   
    router.push(`/login?temp=${tempId}`);
  };


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 font-[family-name:var(--font-geist-sans)]" style={{minHeight:'100svh'}}>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div style={{ padding: '2rem', maxWidth: 400 }}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem'}}>
                <h1 style={{ fontWeight: 'bold', fontSize: '2rem'}}>ยินดีที่ได้รู้จัก 🌱</h1>
                <p>ตอนคุยกันให้เราเรียกเธอว่าอะไรดี?</p>    
            </div>
            <form 
              onSubmit={(e) => {
                e.preventDefault(); // ✅ ป้องกัน reload
                handleAddUser();    // ✅ เรียกแค่รอบเดียว
              }}
            >
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
                  type="submit"
                  style={{ padding: '0.75rem', width: '100%', fontSize: '1rem', borderRadius: '8px', backgroundColor: '#111827', color: '#fff' }}
                >
                  💾 บันทึกชื่อ
                </button>

              
            </form>
            {success && (
            <button
              onClick={handleFindRow}
              style={{ marginTop: '1rem', padding: '0.75rem', width: '100%', fontSize: '1rem', borderRadius: '8px', backgroundColor: '#111827', color: '#fff' }}
            >
              ➡️ ไปต่อเลย
            </button>
          )}

          {success && <p style={{ color: 'green', textAlign: 'center', marginTop: '1rem' }}>{success}</p>}
          {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

        </div>
        </main>
        </div>
  );
};

export default AddUserPage;