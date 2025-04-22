'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [name, setName] = useState<string>(''); // ✅ ระบุ type ชัดเจน
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = async () => {
    if (!name.trim()) {
      alert('กรุณากรอกชื่อที่อยากให้ Emmo เรียก');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('users')
      .insert({ prefer_name: name })
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('❌ Failed to insert name:', error.message);
      alert('บันทึกชื่อไม่สำเร็จ ลองอีกครั้งนะ');
      return;
    }

    // ✅ Redirect ไปหน้า login พร้อมแนบ user id (optionally)
    router.push('/login'); // หรือ `/login?id=${data.id}` ถ้าอยากใช้ต่อ
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 400 }}>
      <h1>ยินดีที่ได้รู้จัก 🌱</h1>
      <p>อยากให้ Emmo เรียกแกว่าอะไรดี?</p>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="เช่น: เอิร์น"
        style={{
          padding: '0.5rem',
          fontSize: '1rem',
          width: '100%',
          marginBottom: '1rem',
          borderRadius: 8,
          border: '1px solid #ccc',
        }}
      />

      <button
        onClick={handleNext}
        disabled={loading}
        style={{
          padding: '0.75rem',
          width: '100%',
          fontSize: '1rem',
          borderRadius: 8,
          backgroundColor: '#111827',
          color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'กำลังบันทึก...' : 'ถัดไป'}
      </button>
    </div>
  );
}