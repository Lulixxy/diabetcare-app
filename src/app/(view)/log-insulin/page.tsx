"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLiff } from "@/src/context/LiffContext";

export default function LogInsulinPage() {
    const router = useRouter();
    const [units, setUnits] = useState("");
    const [type, setType] = useState("rapid");

    const { userId, loading } = useLiff();

    if (loading) return <div>กำลังโหลดข้อมูล...</div>;
    if (!userId) return <div>กรุณาล็อกอินก่อนนะคะ</div>;

    const handleSubmit = async () => {
        if (!units) return toast.error("กรุณาระบุจำนวนหน่วยค่ะ");

        const res = await fetch("/api/insulin/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, units: parseFloat(units), type }),
        });

        if (res.ok) {
            toast.success("บันทึกการฉีดอินซูลินเรียบร้อยค่ะ");
            router.push("/dashboard");
        } else {
            toast.error("เกิดข้อผิดพลาดในการบันทึกค่ะ");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto space-y-6">
            <h1 className="text-xl font-bold text-teal-900">บันทึกอินซูลิน</h1>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">จำนวนหน่วย (Units)</label>
                <input
                    type="number"
                    step="0.5"
                    placeholder="0.0"
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl focus:border-teal-600 outline-none"
                    onChange={(e) => setUnits(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">ประเภทอินซูลิน</label>
                <select
                    className="w-full p-4 border-2 border-slate-200 rounded-2xl outline-none bg-white"
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="rapid">Rapid-acting (ออกฤทธิ์เร็ว)</option>
                    <option value="long">Long-acting (ออกฤทธิ์นาน)</option>
                </select>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-teal-700 text-white py-4 rounded-2xl font-bold hover:bg-teal-800 transition-all"
            >
                บันทึกการฉีด
            </button>
        </div>
    );
}