"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLiff } from "@/src/context/LiffContext";
import { toast } from "sonner";

export default function WelcomePage() {
  const router = useRouter();
  const { userId, loading } = useLiff();

  useEffect(() => {
    if (!loading && userId) {
      toast.info("คุณมีบัญชีอยู่แล้วค่ะ ระบบกำลังพาไปหน้า Dashboard");
      router.push("/dashboard");
    }
  }, [userId, loading, router]);

  const handleAuth = async (action: "register" | "login") => {
    if (loading) return;

    if (!userId) {
      toast.error("กรุณาล็อกอินผ่าน LINE ก่อนนะคะ");
      return;
    }

    if (action === "register") {
      router.push("/register");
    } else {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-teal-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-700"></div>
        <p className="mt-4 text-teal-900 font-bold">กำลังโหลด DiabetCare...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-teal-50 flex flex-col items-center justify-between p-8 max-w-md mx-auto">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 w-full">
        <div className="text-6xl">💉</div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-teal-900">DiabetCare</h1>
          <p className="text-teal-700 font-medium">
            ดูแลระดับน้ำตาลของคุณอย่างมืออาชีพ
          </p>
        </div>
      </div>

      <div className="w-full space-y-4 mb-10">
        <button
          onClick={() => handleAuth("register")}
          className="w-full bg-teal-700 text-white py-4 rounded-2xl font-bold text-lg hover:bg-teal-800 transition-all"
        >
          ลงทะเบียนเข้าใช้งาน
        </button>

        <div className="text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-teal-800 font-bold underline underline-offset-4"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </main>
  );
}
