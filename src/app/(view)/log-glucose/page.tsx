"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLiff } from "@/src/context/LiffContext";
import { FaTint, FaClipboard, FaClock, FaUtensils, FaSave, FaArrowLeft } from "react-icons/fa";

export default function LogGlucosePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ value: "", type: "fasting", mealType: "breakfast", note: "" });
    const { userId, loading } = useLiff();
    const [logs, setLogs] = useState([]);
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchLogs = async () => {
        if (!userId) return;
        const res = await fetch(`/api/glucose/list?userId=${userId}`);
        const data = await res.json();
        setLogs(data);
    };

    useEffect(() => {
        if (userId) fetchLogs();
    }, [userId]);

    if (loading) return <div className="flex h-screen items-center justify-center">กำลังโหลด...</div>;
    if (!userId) return <div className="p-6 text-center">กรุณาล็อกอินก่อนนะคะ</div>;

    const handleDelete = async (id: string) => {
        toast("คุณต้องการลบรายการนี้ใช่ไหมคะ?", {
            action: {
                label: "ยืนยันการลบ",
                onClick: async () => {
                    try {
                        const res = await fetch("/api/glucose", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id }),
                        });

                        if (res.ok) {
                            await fetchLogs();
                            toast.success("ลบรายการเรียบร้อยค่ะ");
                        } else {
                            toast.error("ลบไม่สำเร็จค่ะ");
                        }
                    } catch {
                        toast.error("เกิดข้อผิดพลาด");
                    }
                },
            },
            cancel: {
                label: "ยกเลิก",
                onClick: () => { },
            },
        });
    };

    const startEdit = (log: any) => {
        setEditingId(log.id);
        setFormData({
            value: String(log.value),
            type: log.type,
            mealType: log.mealType,
            note: log.note ?? "",
        });
    };

    const handleSubmit = async () => {
        const url = editingId ? "/api/glucose" : "/api/glucose/log";
        const method = editingId ? "PUT" : "POST";

        if (!formData.value) {
            toast.error("กรุณากรอกระดับน้ำตาลค่ะ");
            return;
        }
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: editingId,
                ...formData,
                userId,
            })
        });

        if (res.ok) {
            toast.success(editingId ? "แก้ไขเรียบร้อยค่ะ" : "บันทึกเรียบร้อยค่ะ");
            setEditingId(null);
            await fetchLogs();
            setFormData({ value: "", type: "fasting", mealType: "breakfast", note: "" });
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
                        value={formData.value}
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
                        <select className="w-full text-slate-700 outline-none font-medium bg-transparent" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                            <option value="fasting">ก่อนอาหาร</option>
                            <option value="after-meal">หลังอาหาร</option>
                        </select>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200">
                        <label className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-2">
                            <FaUtensils /> มื้ออาหาร
                        </label>
                        <select className="w-full text-slate-700 outline-none font-medium bg-transparent" value={formData.mealType} onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}>
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
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    />
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-200"
                >
                    <FaSave />
                    {editingId ? "บันทึกการแก้ไข" : "บันทึกข้อมูล"}
                </button>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4">รายการบันทึกล่าสุด</h2>
                <div className="space-y-3">
                    {logs.map((log: any) => (
                        <div key={log.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center transition-all hover:shadow-md">
                            <div>
                                <p className="text-2xl font-extrabold text-teal-700 tracking-tight">{log.value} <span className="text-sm text-slate-400 font-medium">mg/dL</span></p>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                        {log.type === "fasting" ? "ก่อนอาหาร" : "หลังอาหาร"}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold bg-teal-50 text-teal-600 px-2 py-0.5 rounded-md">
                                        {log.mealType}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => startEdit(log)} className="text-blue-500 text-xs font-bold hover:bg-blue-50 px-3 py-1 rounded-full transition-all">แก้ไข</button>
                                <button onClick={() => handleDelete(log.id)} className="text-red-500 text-xs font-bold hover:bg-red-50 px-3 py-1 rounded-full transition-all">ลบ</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}