"use client";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useLiff } from "@/src/context/LiffContext";
import { toast } from "sonner";
import { FaUser, FaChevronRight, FaRegSmile } from "react-icons/fa";

export default function RegisterPage() {
    const [name, setName] = useState('');
    const router = useRouter();
    const { userId, loading } = useLiff();

    async function handleRegister() {
        console.log("LINE UserId =", userId);
        if (!userId) return toast.error("ไม่พบข้อมูลผู้ใช้จาก LINE ค่ะ");
        if (!name.trim()) return toast.error("กรุณากรอกชื่อเล่นก่อนนะคะ");

        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ line_user_id: userId, name }),
        });

        if (res.ok) {
            toast.success("ยินดีต้อนรับสู่ DiabetCare ค่ะ!");
            router.push('/dashboard');
        } else {
            toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะคะ");
        }
    }

    if (loading) return (
        <div className="flex h-screen items-center justify-center text-teal-700">
            <FaRegSmile className="animate-spin text-2xl mr-2" /> กำลังเตรียมระบบ...
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
            {/* Header section */}
            <div className="text-center mb-10">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-3xl mx-auto mb-4">
                    <FaRegSmile />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-800">ยินดีต้อนรับค่ะ</h1>
                <p className="text-slate-500 mt-2">มาตั้งชื่อเล่นให้เราจำคุณได้กันนะคะ</p>
            </div>

            {/* Input Card */}
            <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-2 mb-2">
                    <FaUser className="text-teal-500" />
                    <input
                        placeholder="ชื่อเล่นของคุณ"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 outline-none text-lg text-slate-700 placeholder:text-slate-300"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleRegister}
                className="w-full max-w-sm bg-teal-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-200"
            >
                เริ่มใช้งาน <FaChevronRight />
            </button>
        </div>
    );
}