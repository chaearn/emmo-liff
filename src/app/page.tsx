'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleNext = async () => {
    if (!name) return alert('กรอกชื่อก่อนน้าา')

    const { error } = await supabase
      .from('users')
      .insert([{ prefer_name: name }]) // ✅ เพิ่ม row แค่ prefer_name

    if (error) {
      console.error('❌ Failed to insert name:', error)
      return alert('มีบางอย่างผิดพลาดจ้า')
    }

    router.push('/login') // ✅ ไปหน้า login ต่อ
  }

  return (
    <div>
      <h1>ชื่อที่อยากให้ Emmo เรียกคุณคือ?</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="พิมพ์ชื่อเล่น"
      />
      <button onClick={handleNext}>Next</button>
    </div>
  )
}