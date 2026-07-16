"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLiff } from "@/src/context/LiffContext";

export default function LogGlucosePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ value: "", type: "fasting", mealType: "breakfast", note: "" });

    const { userId, loading } = useLiff();

    if (loading) return <div>กำลังโหลดข้อมูล...</div>;
    if (!userId) return <div>กรุณาล็อกอินก่อนนะคะ</div>;

    const handleSubmit = async () => {
        const res = await fetch("/api/glucose/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...formData, userId }),
        });

        if (res.ok) {
            toast.success("บันทึกข้อมูลเรียบร้อยค่ะ");
            router.push("/dashboard");
        } else {
            toast.error("เกิดข้อผิดพลาดค่ะ");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto space-y-4">
            <h1 className="text-xl font-bold text-teal-900">บันทึกระดับน้ำตาล</h1>

            <input
                type="number"
                placeholder="ค่าระดับน้ำตาล (mg/dL)"
                className="w-full p-4 border rounded-2xl"
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            />

            <select className="w-full p-4 border rounded-2xl" onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                <option value="fasting">ก่อนอาหาร (Fasting)</option>
                <option value="after-meal">หลังอาหาร (After-meal)</option>
            </select>

            <select className="w-full p-4 border rounded-2xl" onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}>
                <option value="breakfast">มื้อเช้า</option>
                <option value="lunch">มื้อเที่ยง</option>
                <option value="dinner">มื้อเย็น</option>
                <option value="snack">ของว่าง</option>
            </select>

            <textarea
                placeholder="โน้ตเพิ่มเติม (เช่น มื้อนี้ทานอะไรมา)"
                className="w-full p-4 border rounded-2xl"
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />

            <button onClick={handleSubmit} className="w-full bg-teal-700 text-white py-4 rounded-2xl font-bold">
                บันทึกข้อมูล
            </button>
        </div>
    );
}