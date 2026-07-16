"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLiff } from "@/src/context/LiffContext";
import { FaTint, FaSyringe, FaPlus, FaClock, FaHeartbeat } from "react-icons/fa";

export default function DashboardPage() {
    const router = useRouter();
    const [data, setData] = useState({ glucoseLogs: [], insulinDoses: [] });
    const [fetchingData, setFetchingData] = useState(false);
    const { userId, loading } = useLiff();

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userId) return;
            setFetchingData(true);
            try {
                const dashRes = await fetch("/api/dashboard/data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: userId }),
                });
                if (dashRes.ok) {
                    setData(await dashRes.json());
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setFetchingData(false);
            }
        };
        if (!loading) fetchDashboardData();
    }, [userId, loading]);

    if (loading || (userId && fetchingData && data.glucoseLogs.length === 0)) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin text-teal-600 text-4xl mb-4"><FaHeartbeat /></div>
                <p className="text-teal-800 font-medium">กำลังเตรียมข้อมูลสุขภาพ...</p>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-50 p-6 text-center">
                <div className="text-teal-600 text-5xl mb-6"><FaHeartbeat /></div>
                <p className="text-slate-600 mb-6">กรุณาเข้าสู่ระบบเพื่อดูข้อมูลสุขภาพของคุณนะคะ</p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-teal-700 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-teal-200"
                >
                    เข้าสู่ระบบ
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-md mx-auto space-y-6 bg-slate-50 min-h-screen">
            <header className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-800">สวัสดีค่ะ Luli</h1>
                <p className="text-slate-500">วันนี้คุณรู้สึกอย่างไรบ้างคะ?</p>
            </header>

            {/* Glucose Card */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 text-red-500 rounded-lg"><FaTint /></div>
                    <h2 className="font-bold text-slate-800">ระดับน้ำตาลในเลือด</h2>
                </div>
                {data.glucoseLogs.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีข้อมูลในวันนี้</p>
                ) : (
                    data.glucoseLogs.map((log: any) => (
                        <div key={log.id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                            <span className="text-xl font-bold text-teal-700">{log.value} <span className="text-sm font-normal text-slate-400">mg/dL</span></span>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <FaClock /> {new Date(log.createdAt).toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    ))
                )}
            </section>

            {/* Insulin Card */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 text-blue-500 rounded-lg"><FaSyringe /></div>
                    <h2 className="font-bold text-slate-800">การฉีดอินซูลิน</h2>
                </div>
                {data.insulinDoses.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีข้อมูลในวันนี้</p>
                ) : (
                    data.insulinDoses.map((dose: any) => (
                        <div key={dose.id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                            <span className="font-semibold text-slate-700">{dose.units} Units</span>
                            <span className="text-xs px-2 py-1 bg-slate-100 rounded-md text-slate-600">{dose.type === "rapid" ? "ฤทธิ์เร็ว" : "ฤทธิ์นาน"}</span>
                        </div>
                    ))
                )}
            </section>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
                <Link href="/log-glucose" className="flex items-center justify-center gap-2 bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-200">
                    <FaPlus /> น้ำตาล
                </Link>
                <Link href="/log-insulin" className="flex items-center justify-center gap-2 bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-200">
                    <FaPlus /> อินซูลิน
                </Link>
            </div>
        </div>
    );
}