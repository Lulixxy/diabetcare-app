"use client";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { useLiff } from "@/src/context/LiffContext";
import { FaHeartbeat, FaSpinner } from 'react-icons/fa';

export default function LoginPage() {
    const router = useRouter();
    const { userId, loading } = useLiff();

    useEffect(() => {
        if (!loading && userId) {
            checkUserInDatabase(userId);
        } else if (!loading && !userId) {
            toast.error("กรุณาล็อกอินผ่าน LINE ก่อนนะคะ");
        }
    }, [userId, loading]);

    async function checkUserInDatabase(id: string) {
        console.log("Checking LINE User =", id);
        const res = await fetch('/api/auth/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ line_user_id: id }),
        });

        const data = await res.json();

        if (data.exists && !data.suspended) {
            router.push("/dashboard");
        } else if (data.suspended) {
            toast.error("บัญชีของคุณถูกระงับการใช้งานค่ะ");
        } else {
            router.push("/register");
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-white p-6 text-center">
            {/* Logo/Icon Container */}
            <div className="w-20 h-20 bg-teal-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-xl shadow-teal-200 mb-8 animate-bounce">
                <FaHeartbeat />
            </div>

            {/* Welcome Text */}
            <h1 className="text-2xl font-extrabold text-teal-900 mb-2">DiabetCare Connect</h1>
            <p className="text-slate-500 mb-10 max-w-[200px]">ดูแลสุขภาพเบาหวานของคุณไปกับเรา</p>

            {/* Loading State */}
            <div className="flex flex-col items-center gap-3">
                <FaSpinner className="animate-spin text-teal-600 text-2xl" />
                <p className="text-sm font-medium text-teal-700">กำลังตรวจสอบข้อมูลของคุณ...</p>
            </div>
        </div>
    );
}