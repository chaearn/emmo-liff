'use client';
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { supabase } from '@/lib/supabase';
import type { LineProfile } from '@/lib/types';

export default function UpdateLatestUserWithLINE() {
    const [profile, setProfile] = useState<LineProfile | null>(null);
    // const [latestUserId ] = useState<number | null>(null);
    // const [displayName, setDisplayName] = useState('');
    // const [avatar] = useState('');
    // const [error, setError] = useState<string | null>(null);
    // const [success, setSuccess] = useState<string | null>(null);

    // const handleLogout = () => {
    //     liff.logout();
    //     setProfile(null);
    //     window.location.replace('/');
    // };

    

  useEffect(() => {
    const start = async () => {
      try {
        alert("🟡 Starting LIFF init...");
        const searchParams = new URLSearchParams(window.location.search);
        const tempId = searchParams.get('temp');
        alert("The tempID: "+ tempId);
        // 🧠 Save tempId into localStorage BEFORE redirect
        if (tempId) {
        localStorage.setItem('pendingTempId', tempId);
        }
        await liff.init({
          liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
          withLoginOnExternalBrowser: true,
        });
        alert("✅ LIFF initialized");
        

        if (!liff.isLoggedIn()) {
          alert("🔁 Not logged in, redirecting...");
          liff.login({
            redirectUri: `${window.location.origin}/login#temp=${tempId}`,
          });
          return;
        }
  
        const token = liff.getAccessToken();
        alert(`🔐 Token: ${token}`);
  
        const rawProfile = await liff.getProfile();
        alert(`👤 Profile: ${rawProfile.displayName}`);

        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const tempIdFromHash = hashParams.get('temp');
        const savedTempId = localStorage.getItem('pendingTempId');
        // const effectiveTempId = savedTempId || tempIdFromHash;
        const effectiveTempId: string = savedTempId || tempIdFromHash || '';

        if (!effectiveTempId) {
            alert('❌ Missing temp ID');
            return;
        }

        const parsedProfile: LineProfile = {
            userId: rawProfile.userId,
            displayName: rawProfile.displayName,
            pictureUrl: rawProfile.pictureUrl || '', // fallback if undefined
          };

        console.log('🧩 Trying to update user with ID:', effectiveTempId);
        console.log('📦 Payload to update:', parsedProfile);

        console.log('user nickname:', localStorage.getItem('userNickname'));
        const NICKNAME = localStorage.getItem('userNickname');
        console.log('nickname saved:', NICKNAME);
        const userID = localStorage.getItem('userID');
        console.log(userID);

        const { data: updateData, error: updateError } = await supabase
            .from('emmo_users') // Specify the table
            .update({
                line_id: parsedProfile.userId,
                display_name: parsedProfile.displayName,
                avatar: parsedProfile.pictureUrl,
            }) // Specify the fields to update
            .eq('display_name', effectiveTempId) // Apply conditions
            .select('name, line_id, display_name, avatar'); // Optionally select fields to return

        if (updateError) {
            console.error('❌ Failed to update user:', updateError.message);
            alert(`❌ Failed to update user: ${updateError.message}`);
            if (updateError.message.includes('duplicate key value violates unique constraint "users_line_id_key"')) {
                setError('บัญชี LINE นี้เชื่อมกับ Emmo ไปแล้ว');
                // แสดงข้อความก่อน redirect
            }
                
        } else {
            console.log('✅ User updated in Supabase');
            alert('✅ LINE info updated!');
            console.log('📥 Updated row data:', updateData);

            setProfile(parsedProfile);
            localStorage.setItem('lineProfile', JSON.stringify(parsedProfile));
            localStorage.setItem('lineUserId', parsedProfile.userId);
            console.log('🧾 Saved lineUserId to localStorage:', parsedProfile.userId);
            const lineUserId = localStorage.getItem('lineUserId');
            console.log('🧾 Called for LINE ID:', lineUserId);
            
            // ✅ Redirect ไปยังหน้า /profile หลังจากทุกอย่างเสร็จ
            window.location.replace('/profile');
            
        }

        
        
        // ...rest of the logic...
      } catch (err) {
        if (err instanceof Error) {
          alert(`❌ Unexpected error: ${err.message}`);
        } else {
          alert('❌ Unknown error');
        }
      }
    };
  
    start();
  }, []);

  if (!profile) return <p>Loading LINE profile...</p>;
  console.log('🎉 Profile loaded', profile)

  return (
    <div style={{display:'flex', width:'100%', height:'100%'}}>
      <h1>Loading Profile</h1>      
     
    </div>
  );
}

function setError(arg0: string) {
    const [profile, setProfile] = useState<LineProfile | null>(null);
    console.log(arg0);
    liff.logout();
    setProfile(null);
    setTimeout(() => {
        window.location.href = '/login';
      }, 3000); // ⏱️ รอ 3 วินาทีค่อย redirect
    // throw new Error('Function not implemented.');
}
