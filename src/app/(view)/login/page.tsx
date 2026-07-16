'use client'
import { useEffect, useState } from 'react';
import liff from '@line/liff';
import { toast } from 'sonner';

export default function LoginPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. เริ่มต้น LIFF
        liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! })
            .then(async () => {
                // 2. เช็คว่า Login แล้วหรือยัง
                if (!liff.isLoggedIn()) {
                    liff.login(); // ยังไม่ล็อกอิน ให้เด้งไปหน้า login ของ LINE
                } else {
                    // 3. ถ้าล็อกอินแล้ว ดึงข้อมูลโปรไฟล์
                    const profile = await liff.getProfile();
                    checkUserInDatabase(profile.userId);
                }
            })
            .catch((err) => {
                console.error("LIFF init failed", err);
                setLoading(false);
            });
    }, []);

    async function checkUserInDatabase(line_user_id: string) {
        const res = await fetch('/api/auth/check', {
            method: 'POST',
            body: JSON.stringify({ line_user_id }),
        });

        const data = await res.json();

        if (data.exists && !data.suspended) {
            window.location.href = '/dashboard'; // ไปหน้า Dashboard
        } else if (data.suspended) {
            toast.error("บัญชีของคุณถูกระงับการใช้งานค่ะ");
        } else {
            // 4. ถ้ายังไม่เคยสมัครสมาชิก ให้ไปหน้าลงทะเบียน
            window.location.href = '/register';
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-teal-50">
            <p className="text-teal-900 font-semibold text-lg">กำลังเชื่อมต่อกับ LINE...</p>
        </div>
    );
}