"use client";
import { useEffect } from 'react';
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import { useLiff } from "@/src/context/LiffContext";

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
        <div className="min-h-screen flex items-center justify-center bg-teal-50">
            <p className="text-teal-900 font-semibold text-lg">กำลังตรวจสอบสถานะบัญชี...</p>
        </div>
    );
}