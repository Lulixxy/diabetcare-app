'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLiff } from "@/src/context/LiffContext";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const router = useRouter();
    const { userId, loading } = useLiff();

    async function handleRegister() {
        if (!userId) return alert("ไม่พบข้อมูลผู้ใช้จาก LINE ค่ะ");

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ line_user_id: userId, name }),
        });

        if (res.ok) {
            router.push('/dashboard');
        } else {
            alert("เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะคะ");
        }
    }

    if (loading) return <div>กำลังเตรียมระบบสมัครสมาชิก...</div>;

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