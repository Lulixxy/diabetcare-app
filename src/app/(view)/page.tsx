"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import liff from "@line/liff";
import { toast } from "sonner";

export default function WelcomePage() {
  const router = useRouter();
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const startApp = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        setIsLiffReady(true);
      } catch (error) {
        console.error("LIFF Init Error:", error);
      }
    };
    startApp();
  }, []);

  const handleAuth = async (action: "register" | "login") => {
    if (!isLiffReady || isChecking) return;
    setIsChecking(true);

    try {
      if (!liff.isLoggedIn()) {
        liff.login();
        return;
      }

      const profile = await liff.getProfile();
      const line_id = profile.userId;

      const res = await fetch("/api/auth/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line_user_id: line_id }),
      });

      const data = await res.json();

      if (res.status === 403 && data.suspended) {
        toast.error("บัญชีของคุณถูกระงับการใช้งานค่ะ");
        return;
      }

      const exists = data.exists;

      if (action === "register") {
        if (exists) {
          toast.info("คุณมีบัญชีอยู่แล้วค่ะ ระบบกำลังพาไปหน้า Dashboard");
          router.push("/dashboard");
        } else {
          router.push("/register");
        }
      } else if (action === "login") {
        if (exists) {
          router.push("/dashboard");
        } else {
          toast.error("ไม่พบบัญชี กรุณาลงทะเบียนก่อนนะคะ");
          router.push("/register");
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      toast.error("เกิดข้อผิดพลาดในการตรวจสอบข้อมูลค่ะ");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main className="min-h-screen bg-teal-50 flex flex-col items-center justify-between p-8 max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 w-full">
        {/* ตรงนี้ Luli เปลี่ยนเป็นรูปโลโก้ DiabetCare ของ Luli ได้เลยนะคะ */}
        <div className="text-6xl">💉</div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-teal-900">DiabetCare</h1>
          <p className="text-teal-700 font-medium">ดูแลระดับน้ำตาลของคุณอย่างมืออาชีพ</p>
        </div>
      </div>

      <div className="w-full space-y-4 mb-10">
        <button
          onClick={() => handleAuth("register")}
          disabled={isChecking}
          className="w-full bg-teal-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-800 transition-all"
        >
          {isChecking ? "กำลังตรวจสอบ..." : "ลงทะเบียนเข้าใช้งาน"}
        </button>

        <div className="text-center">
          <button
            onClick={() => handleAuth("login")}
            disabled={isChecking}
            className="text-teal-800 font-bold underline underline-offset-4"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </main>
  );
}