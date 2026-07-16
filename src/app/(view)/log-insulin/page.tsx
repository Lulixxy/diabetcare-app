"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLiff } from "@/src/context/LiffContext";
import { FaSyringe, FaArrowLeft, FaSave } from "react-icons/fa";
import { FaRegPenToSquare } from "react-icons/fa6";
import { LuTrash2 } from "react-icons/lu";

export default function LogInsulinPage() {
    const router = useRouter();
    const [units, setUnits] = useState("");
    const [type, setType] = useState("rapid");
    const [doses, setDoses] = useState([]);
    const { userId, loading } = useLiff();
    const [editingId, setEditingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        toast("คุณต้องการลบรายการนี้ใช่ไหมคะ?", {
            action: {
                label: "ยืนยันการลบ",
                onClick: async () => {
                    const res = await fetch("/api/insulin", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id }),
                    });

                    if (res.ok) {
                        await fetchDoses();
                        toast.success("ลบรายการเรียบร้อยค่ะ");
                    } else {
                        toast.error("ลบไม่สำเร็จค่ะ");
                    }
                },
            },
            cancel: {
                label: "ยกเลิก",
                onClick: () => { },
            },
        });
    };

    const startEdit = (dose: any) => {
        setEditingId(dose.id);
        setUnits(dose.units.toString());
        setType(dose.type);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

        if (!units) {
            toast.error("กรุณากรอกจำนวนหน่วยอินซูลินค่ะ");
            return;
        }

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, units: parseFloat(units), type, id: editingId }),
        });

        if (res.ok) {
            toast.success(editingId ? "แก้ไขเรียบร้อยค่ะ" : "บันทึกเรียบร้อยค่ะ");
            setEditingId(null);
            setUnits("");
            setType("rapid");
            await fetchDoses();
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
                        value={units}
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
                    <FaSave />{editingId
                        ? "บันทึกการแก้ไข"
                        : "บันทึกการฉีด"}
                </button>
            </div>
            <div className="mt-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4">
                    ประวัติการฉีดล่าสุด
                </h2>
                <div className="space-y-3">
                    {doses.map((dose: any) => (
                        <div key={dose.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex justify-between items-center transition-all hover:shadow-md">
                            <div>
                                <p className="text-2xl font-extrabold text-teal-700 tracking-tight">{dose.units} <span className="text-sm text-slate-400 font-medium">Units</span></p>
                                <div className="mt-1">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${dose.type === "rapid" ? "bg-orange-50 text-orange-600" : "bg-indigo-50 text-indigo-600"}`}>
                                        {dose.type === "rapid" ? "ฤทธิ์เร็ว (Rapid)" : "ฤทธิ์นาน (Long)"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button onClick={() => startEdit(dose)} className="text-blue-500 text-xs font-bold hover:bg-blue-50 px-3 py-1 rounded-full transition-all"><FaRegPenToSquare /></button>
                                <button onClick={() => handleDelete(dose.id)} className="text-red-500 text-xs font-bold hover:bg-red-50 px-3 py-1 rounded-full transition-all"><LuTrash2 /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
