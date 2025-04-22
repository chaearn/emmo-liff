'use client'
import { useEffect, useState } from 'react'
import liff from '@line/liff'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      try {
        // 1. LINE LIFF INIT
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
          withLoginOnExternalBrowser: false,
        })

        if (!liff.isLoggedIn()) {
          liff.login()
          return
        }

        // 2. GET LINE PROFILE
        const raw = await liff.getProfile()
        const userProfile = {
          userId: raw.userId,
          displayName: raw.displayName,
          pictureUrl: raw.pictureUrl ?? '',
        }
        setProfile(userProfile)

        // 3. SUPABASE: ดึง row ล่าสุดที่มีแค่ prefer_name
        const { data: latestRows, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)

        if (fetchError || !latestRows?.[0]) {
          console.error('❌ ไม่พบ row ล่าสุด:', fetchError)
          return
        }

        const latestUser = latestRows[0]

        // 4. UPDATE ROW นั้น ด้วยข้อมูล LINE
        const { error: updateError } = await supabase
          .from('users')
          .update({
            line_id: userProfile.userId,
            avatar: userProfile.pictureUrl,
            display_name: userProfile.displayName,
          })
          .eq('id', latestUser.id)

        if (updateError) {
          console.error('❌ อัปเดต LINE profile ไม่สำเร็จ:', updateError)
        }
      } catch (err) {
        console.error('❌ init error:', err)
      }
    }

    init()
  }, [])

  if (!profile) return <p>Loading...</p>

  return (
    <div>
      <h1>Welcome, {profile.displayName}</h1>
      <img src={profile.pictureUrl} alt="profile" width={120} height={120} />
      <button onClick={() => liff.logout()}>Logout</button>
    </div>
  )
}