"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLiff } from "@/src/context/LiffContext";
import { FaTint, FaSyringe, FaPlus, FaHeartbeat } from "react-icons/fa";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

export default function DashboardPage() {
    const router = useRouter();
    const [data, setData] = useState({ glucoseLogs: [], insulinDoses: [] });
    const [fetchingData, setFetchingData] = useState(false);
    const { lineUserId, loading } = useLiff();

    const timelineData = useMemo(() => {
        const logs = [
            ...data.glucoseLogs.map((item: any) => ({ ...item, type: "glucose" })),
            ...data.insulinDoses.map((item: any) => ({ ...item, type: "insulin" })),
        ];
        return logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [data]);

    const chartData = useMemo(() => {
        return [...data.glucoseLogs]
            .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .map((log: any) => ({
                time: new Date(log.createdAt).toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' }),
                value: log.value,
            }));
    }, [data.glucoseLogs]);

    const groupedData = useMemo(() => {
        const allLogs = [
            ...data.glucoseLogs.map((item: any) => ({ ...item, type: "glucose", time: new Date(item.createdAt).getTime() })),
            ...data.insulinDoses.map((item: any) => ({ ...item, type: "insulin", time: new Date(item.createdAt).getTime() })),
        ].sort((a, b) => b.time - a.time);

        const groups: any[] = [];
        allLogs.forEach((log) => {
            const lastGroup = groups[groups.length - 1];
            if (lastGroup && Math.abs(lastGroup.time - log.time) < 5 * 60 * 1000) {
                lastGroup.items.push(log);
            } else {
                groups.push({ time: log.time, items: [log] });
            }
        });
        return groups;
    }, [data]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!lineUserId) return;
            setFetchingData(true);
            try {
                const dashRes = await fetch("/api/dashboard/data", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: lineUserId }),
                });
                if (dashRes.ok) setData(await dashRes.json());
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setFetchingData(false);
            }
        };
        if (!loading) fetchDashboardData();
    }, [lineUserId, loading]);

    if (loading || (lineUserId && fetchingData && data.glucoseLogs.length === 0)) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin text-teal-600 text-4xl mb-4"><FaHeartbeat /></div>
                <p className="text-teal-800 font-medium">กำลังเตรียมข้อมูลสุขภาพ...</p>
            </div>
        );
    }

    if (!lineUserId) {
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
            </header>

            {/* Graph */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-64">
                <h2 className="font-bold text-slate-800 mb-4">ระดับน้ำตาลวันนี้ (mg/dL)</h2>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={chartData} margin={{ top: 20 }}>
                        <XAxis dataKey="time" hide />
                        <Tooltip cursor={{ fill: '#f1f5f9' }} />
                        <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={40}>
                            {chartData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.value > 150 ? "#ef4444" : "#14b8a6"} />
                            ))}
                            <LabelList dataKey="value" position="top" style={{ fill: '#64748b', fontSize: '12px', fontWeight: 'bold' }} />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </section>

            {/* Table Timeline */}
            <section className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h2 className="font-bold text-slate-800 mb-4">ประวัติสุขภาพ</h2>
                <div className="space-y-4">
                    {timelineData.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีข้อมูลวันนี้</p>
                    ) : (

                        groupedData.map((group, index) => (
                            <div key={index} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                                {group.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${item.type === 'glucose' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                                                {item.type === 'glucose' ? <FaTint /> : <FaSyringe />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">
                                                    {item.type === 'glucose' ? `${item.value} mg/dL` : `${item.units} Units`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* แสดงเวลาตรงท้ายกลุ่มเพื่อให้ดูสะอาดตา */}
                                <p className="text-[10px] text-slate-400 font-bold border-t pt-2 text-right">
                                    {new Date(group.time).toLocaleTimeString("th-TH", { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        ))

                    )}
                </div>
            </section>

            {/* Nav Button */}
            <div className="grid grid-cols-2 gap-4 pt-4">
                <Link href="/log-glucose" className="flex items-center justify-center gap-2 bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-lg shadow-slate-200">
                    <FaPlus /> น้ำตาล
                </Link>
                <Link href="/log-insulin" className="flex items-center justify-center gap-2 bg-teal-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-teal-200">
                    <FaPlus /> อินซูลิน
                </Link>
            </div>
        </div>
    );
}