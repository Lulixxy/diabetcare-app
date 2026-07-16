"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLiff } from "@/src/context/LiffContext";
import { FaTint, FaClipboard, FaClock, FaUtensils, FaSave, FaArrowLeft } from "react-icons/fa";

export default function LogGlucosePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ value: "", type: "fasting", mealType: "breakfast", note: "" });
    const { userId, loading } = useLiff();

    if (loading) return <div className="flex h-screen items-center justify-center">กำลังโหลด...</div>;
    if (!userId) return <div className="p-6 text-center">กรุณาล็อกอินก่อนนะคะ</div>;

    const handleSubmit = async () => {
        if (!formData.value) {
            toast.error("กรุณากรอกระดับน้ำตาลค่ะ");
            return;
        }
        const res = await fetch("/api/glucose/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, userId }),
        });

        if (res.ok) {
            toast.success("บันทึกข้อมูลเรียบร้อยค่ะ");
            router.push("/dashboard");
        } else {
            toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้งนะคะ");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-slate-50 min-h-screen">
            <button onClick={() => router.back()} className="text-slate-500 mb-6 flex items-center gap-2 hover:text-teal-700">
                <FaArrowLeft /> ย้อนกลับ
            </button>

            <h1 className="text-2xl font-extrabold text-slate-800 mb-6">บันทึกน้ำตาล</h1>

            <div className="space-y-4">
                {/* Glucose Input */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-2">
                        <FaTint /> ค่าระดับน้ำตาล (mg/dL)
                    </label>
                    <input
                        type="number"
                        placeholder="0"
                        className="w-full text-2xl font-bold text-teal-700 outline-none"
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    />
                </div>

                {/* Selection Grids */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200">
                        <label className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-2">
                            <FaClock /> ช่วงเวลา
                        </label>
                        <select className="w-full text-slate-700 outline-none font-medium bg-transparent" onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                            <option value="fasting">ก่อนอาหาร</option>
                            <option value="after-meal">หลังอาหาร</option>
                        </select>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200">
                        <label className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-2">
                            <FaUtensils /> มื้ออาหาร
                        </label>
                        <select className="w-full text-slate-700 outline-none font-medium bg-transparent" onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}>
                            <option value="breakfast">มื้อเช้า</option>
                            <option value="lunch">มื้อเที่ยง</option>
                            <option value="dinner">มื้อเย็น</option>
                            <option value="snack">ของว่าง</option>
                        </select>
                    </div>
                </div>

                {/* Note */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-2">
                        <FaClipboard /> โน้ตเพิ่มเติม
                    </label>
                    <textarea
                        placeholder="เช่น มื้อนี้ทานอะไรมา..."
                        className="w-full text-slate-700 outline-none resize-none h-20"
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-200"
                >
                    <FaSave /> บันทึกข้อมูล
                </button>
            </div>
        </div>
    );
}