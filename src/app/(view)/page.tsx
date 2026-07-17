"use client";

import { useRouter } from "next/navigation";
import { useLiff } from "@/src/context/LiffContext";
import { toast } from "sonner";
import { FaHeartbeat, FaArrowRight, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function WelcomePage() {
  const router = useRouter();
  const { lineUserId, loading } = useLiff();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-teal-50">
        <FaHeartbeat className="text-4xl text-teal-600 animate-pulse" />
        <p className="mt-4 text-teal-900 font-bold">กำลังเตรียมระบบ...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col p-8 max-w-md mx-auto">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-teal-100 rounded-3xl flex items-center justify-center text-teal-600 text-5xl shadow-inner">
          <FaHeartbeat />
        </div>
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">DiabetCare</h1>
          <p className="text-slate-500 font-medium px-4">
            ดูแลระดับน้ำตาลและอินซูลินของคุณอย่างมืออาชีพ ในรูปแบบที่เข้าใจง่ายที่สุด
          </p>
        </div>
      </div>

      {/* Action Section */}
      <div className="w-full space-y-6 mb-8">
        <button
          onClick={() => {
            if (!lineUserId) return toast.error("กรุณาล็อกอินผ่าน LINE ก่อนนะคะ");
            router.push("/register");
          }}
          className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-200"
        >
          <FaUserPlus /> ลงทะเบียนใช้งาน
        </button>

        <button
          onClick={() => {
            if (!lineUserId) return toast.error("กรุณาล็อกอินผ่าน LINE ก่อนนะคะ");
            router.push("/login");
          }}
          className="w-full text-teal-700 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-teal-50 transition-all border-2 border-teal-100"
        >
          <FaSignInAlt /> เข้าสู่ระบบ <FaArrowRight className="text-sm" />
        </button>
      </div>
    </main>
  );
}