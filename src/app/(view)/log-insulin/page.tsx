"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLiff } from "@/src/context/LiffContext";
import { FaSyringe, FaArrowLeft, FaSave, FaClock } from "react-icons/fa";

export default function LogInsulinPage() {
    const router = useRouter();
    const [units, setUnits] = useState("");
    const [type, setType] = useState("rapid");
    const [doses, setDoses] = useState([]);
    const { userId, loading } = useLiff();
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("ยืนยันการลบรายการนี้ใช่ไหมคะ?")) return;
        await fetch("/api/insulin", {
            method: "DELETE",
            body: JSON.stringify({ id })
        });
        fetchDoses();
        toast.success("ลบรายการแล้วค่ะ");
    };

    const startEdit = (dose: any) => {
        setEditingId(dose.id);
        setUnits(dose.units.toString());
        setType(dose.type);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // เลื่อนไปด้านบนเพื่อแก้ไขฟอร์ม
    };

    if (loading)
        return (
            <div className="flex h-screen items-center justify-center">
                กำลังโหลด...
            </div>
        );
    if (!userId)
        return <div className="p-6 text-center">กรุณาล็อกอินก่อนนะคะ</div>;

    const fetchDoses = async () => {
        if (!userId) return;
        const res = await fetch(`/api/insulin/list?userId=${userId}`);
        const data = await res.json();
        setDoses(data);
    };

    useEffect(() => {
        if (userId) fetchDoses();
    }, [userId]);

    const handleSubmit = async () => {
        const url = editingId ? "/api/insulin" : "/api/insulin/log";
        const method = editingId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, units: parseFloat(units), type, id: editingId }),
        });

        if (res.ok) {
            toast.success(editingId ? "แก้ไขเรียบร้อยค่ะ" : "บันทึกเรียบร้อยค่ะ");
            setEditingId(null);
            setUnits("");
            fetchDoses();
        } else {
            toast.error("เกิดข้อผิดพลาดในการบันทึกค่ะ");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-slate-50 min-h-screen">
            <button
                onClick={() => router.back()}
                className="text-slate-500 mb-6 flex items-center gap-2 hover:text-teal-700 transition-colors"
            >
                <FaArrowLeft /> ย้อนกลับ
            </button>

            <h1 className="text-2xl font-extrabold text-slate-800 mb-6">
                บันทึกอินซูลิน
            </h1>

            <div className="space-y-6">
                {/* Units Input */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-3">
                        <FaSyringe /> จำนวนหน่วย (Units)
                    </label>
                    <input
                        type="number"
                        step="0.5"
                        placeholder="0.0"
                        className="w-full text-4xl font-bold text-teal-700 outline-none placeholder:text-slate-200"
                        onChange={(e) => setUnits(e.target.value)}
                    />
                </div>

                {/* Insulin Type Selection */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500">
                        ประเภทอินซูลิน
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setType("rapid")}
                            className={`p-4 rounded-2xl border-2 transition-all ${type === "rapid" ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600"}`}
                        >
                            <span className="block font-bold">ฤทธิ์เร็ว</span>
                            <span className="text-[10px] opacity-75">Rapid-acting</span>
                        </button>
                        <button
                            onClick={() => setType("long")}
                            className={`p-4 rounded-2xl border-2 transition-all ${type === "long" ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600"}`}
                        >
                            <span className="block font-bold">ฤทธิ์นาน</span>
                            <span className="text-[10px] opacity-75">Long-acting</span>
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-teal-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-teal-700 transition-all shadow-lg shadow-teal-200 mt-6"
                >
                    <FaSave /> บันทึกการฉีด
                </button>
            </div>
            <div className="mt-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                    ประวัติการฉีดล่าสุด
                </h2>
                <div className="space-y-3">
                    {doses.map((dose: any) => (
                        <div key={dose.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center">
                            <div>
                                <p className="text-xl font-black text-teal-700">{dose.units} Units</p>
                                <p className="text-xs text-slate-500 font-bold">{dose.type === "rapid" ? "Rapid-acting" : "Long-acting"}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(dose)} className="text-blue-500 text-xs font-bold px-2 py-1 bg-blue-50 rounded-lg">แก้ไข</button>
                                <button onClick={() => handleDelete(dose.id)} className="text-red-500 text-xs font-bold px-2 py-1 bg-red-50 rounded-lg">ลบ</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
