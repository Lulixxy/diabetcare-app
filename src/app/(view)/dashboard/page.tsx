"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLiff } from "@/src/context/LiffContext";

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

        if (!loading) {
            fetchDashboardData();
        }
    }, [userId, loading]);

    if (loading || (userId && fetchingData && data.glucoseLogs.length === 0)) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-700 mb-4"></div>
                <p className="text-teal-900 font-semibold">กำลังโหลดข้อมูลสุขภาพของคุณ...</p>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-50 p-6 text-center">
                <p className="text-slate-600 mb-4 font-medium">กรุณาเข้าสู่ระบบผ่าน LINE ก่อนใช้งานนะคะ</p>
                <button
                    onClick={() => router.push("/")}
                    className="bg-teal-700 text-white px-6 py-3 rounded-xl font-bold"
                >
                    ไปหน้าหลัก
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-md mx-auto space-y-8 bg-slate-50 min-h-screen">
            <h1 className="text-2xl font-bold text-teal-900">สุขภาพของคุณวันนี้</h1>

            <section className="bg-white p-5 rounded-3xl shadow-sm">
                <h2 className="font-bold text-teal-700 mb-4">ระดับน้ำตาลล่าสุด</h2>
                {data.glucoseLogs.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีบันทึกระดับน้ำตาลในวันนี้</p>
                ) : (
                    data.glucoseLogs.map((log: any) => (
                        <div key={log.id} className="flex justify-between py-2 border-b last:border-0">
                            <span className="font-medium text-slate-700">{log.value} mg/dL</span>
                            <span className="text-sm text-gray-500">{new Date(log.createdAt).toLocaleDateString("th-TH")}</span>
                        </div>
                    ))
                )}
            </section>

            <section className="bg-white p-5 rounded-3xl shadow-sm">
                <h2 className="font-bold text-teal-700 mb-4">ประวัติการฉีดอินซูลิน</h2>
                {data.insulinDoses.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีบันทึกการฉีดอินซูลินในวันนี้</p>
                ) : (
                    data.insulinDoses.map((dose: any) => (
                        <div key={dose.id} className="flex justify-between py-2 border-b last:border-0">
                            <span className="font-medium text-slate-700">{dose.units} Units ({dose.type === "rapid" ? "ฤทธิ์เร็ว" : "ฤทธิ์นาน"})</span>
                            <span className="text-sm text-gray-500">{new Date(dose.createdAt).toLocaleDateString("th-TH")}</span>
                        </div>
                    ))
                )}
            </section>

            <div className="grid grid-cols-2 gap-4">
                <Link href="/log-glucose" className="block text-center bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all">
                    บันทึกน้ำตาล
                </Link>
                <Link href="/log-insulin" className="block text-center bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all">
                    บันทึกอินซูลิน
                </Link>
            </div>
        </div>
    );
}