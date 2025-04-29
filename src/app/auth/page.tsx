// src/app/auth/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabase';
import { supabase } from 'supabaseClient';


export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);


    // useEffect(() => {
    //     const storedNickname = localStorage.getItem('emmo_nickname') ?? '';
    //     setNickname(storedNickname);
    // }, []);

//   const handleSignup = async () => {
//     const { data, error } = await supabase.auth.signUp({ email, password });
//     if (error) return alert(error.message);

//     const { error: insertError } = await supabase
//       .from('users')
//       .upsert({ id: data.user?.id, prefer_name: nickname });

//     if (insertError) return alert(insertError.message);
//     router.push('/dashboard');
//   };

const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const storedNickname = localStorage.getItem('emmo_nickname') ?? '';
        setNickname(storedNickname);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    
    if (error) {
        setError(error.message);
    } else {
        setSuccess('Sign-up successful! Please check your email for confirmation.');
        const user = data?.user;
    
        if (user) {
            
            // Instead of upserting into auth.users, store additional info in your custom table
            const { data: updateData, error: updateError } = await supabase
                        .from('emmo_profiles') // Specify the table
                        .update({
                            user_id: user.id,
                        }) // Specify the fields to update
                        .eq('name', nickname) // Apply conditions
                        .select('user_id'); // Optionally select fields to return
            
                    if (updateError) {
                        console.error('❌ Failed to update user:', updateError.message);
                      
                            
                    } else {
                        
                        console.log('📥 Updated row data:', updateData);
                    }
    
            // Redirect to the dashboard
            router.push('/dashboard');
        }
    }
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 font-[family-name:var(--font-geist-sans)]" style={{minHeight:'100svh'}}>
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp}>
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Sign Up</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <div>
            <button onClick={handleGuest}>Continue as guest</button>
        </div>
    </div>
    
  );
}

// pages/signup.tsx
// import { useState } from 'react';
// import { supabase } from '../supabaseClient';

// const SignUp = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState<string | null>(null);
//     const [success, setSuccess] = useState<string | null>(null);

//     const handleSignUp = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);
//         setSuccess(null);

//         const { user, error } = await supabase.auth.signUp({
//             email,
//             password,
//         });

//         if (error) {
//             setError(error.message);
//         } else {
//             setSuccess('Sign-up successful! Please check your email for confirmation.');
//             // Optionally, you can insert additional user data into the profiles table here
//         }
//     };

//     return (
//         <div>
//             <h1>Sign Up</h1>
//             <form onSubmit={handleSignUp}>
//                 <div>
//                     <label>Email:</label>
//                     <input
//                         type="email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Sign Up</button>
//             </form>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//             {success && <p style={{ color: 'green' }}>{success}</p>}
//         </div>
//     );
// };

// export default SignUp;