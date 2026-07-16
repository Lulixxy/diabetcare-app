'use client'
import { useState, useEffect } from 'react';
import liff from '@line/liff';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [lineUserId, setLineUserId] = useState('');
    const router = useRouter();

    useEffect(() => {
        liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! }).then(async () => {
            const profile = await liff.getProfile();
            setLineUserId(profile.userId);
        });
    }, []);

    async function handleRegister() {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ line_user_id: lineUserId, name }),
        });

        if (res.ok) {
            router.push('/dashboard'); // สมัครเสร็จ ไปหน้า Dashboard เลย!
        } else {
            alert("เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะคะ");
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
            <h1 className="text-2xl font-bold mb-6 text-slate-800">ยินดีต้อนรับสู่ DiabetCare!</h1>
            <input
                placeholder="กรอกชื่อเล่นของคุณ"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full max-w-sm p-4 border-2 border-slate-200 rounded-2xl mb-4"
            />
            <button
                onClick={handleRegister}
                className="w-full max-w-sm bg-teal-600 text-white py-4 rounded-2xl font-bold"
            >
                เริ่มใช้งาน
            </button>
        </div>
    );
}