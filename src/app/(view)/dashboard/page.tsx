"use client";
import { useEffect, useState } from "react";
import liff from "@line/liff";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [data, setData] = useState({ glucoseLogs: [], insulinDoses: [] });

    useEffect(() => {
        liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! }).then(async () => {
            const profile = await liff.getProfile();
            // เช็ค User เพื่อหา userId จริงๆ
            const res = await fetch("/api/auth/check", {
                method: "POST",
                body: JSON.stringify({ line_user_id: profile.userId }),
            });
            const userData = await res.json();

            // ดึงข้อมูล Dashboard
            const dashRes = await fetch("/api/dashboard/data", {
                method: "POST",
                body: JSON.stringify({ userId: userData.user.id }),
            });
            setData(await dashRes.json());
        });
    }, []);

    return (
        <div className="p-6 max-w-md mx-auto space-y-8 bg-slate-50 min-h-screen">
            <h1 className="text-2xl font-bold text-teal-900">สุขภาพของคุณวันนี้</h1>

            {/* ส่วนแสดงน้ำตาล */}
            <section className="bg-white p-5 rounded-3xl shadow-sm">
                <h2 className="font-bold text-teal-700 mb-4">ระดับน้ำตาลล่าสุด</h2>
                {data.glucoseLogs.map((log: any) => (
                    <div key={log.id} className="flex justify-between py-2 border-b">
                        <span>{log.value} mg/dL</span>
                        <span className="text-sm text-gray-500">{new Date(log.createdAt).toLocaleDateString()}</span>
                    </div>
                ))}
            </section>

            {/* ส่วนแสดงอินซูลิน */}
            <section className="bg-white p-5 rounded-3xl shadow-sm">
                <h2 className="font-bold text-teal-700 mb-4">ประวัติการฉีดอินซูลิน</h2>
                {data.insulinDoses.map((dose: any) => (
                    <div key={dose.id} className="flex justify-between py-2 border-b">
                        <span>{dose.units} Units ({dose.type})</span>
                        <span className="text-sm text-gray-500">{new Date(dose.createdAt).toLocaleDateString()}</span>
                    </div>
                ))}
            </section>

            {/* ปุ่มนำทางไปยังหน้าบันทึกต่างๆ */}
            <div className="grid grid-cols-2 gap-4">
                <a href="/log-glucose" className="block text-center bg-teal-600 text-white py-4 rounded-2xl font-bold">บันทึกน้ำตาล</a>
                <a href="/log-insulin" className="block text-center bg-teal-600 text-white py-4 rounded-2xl font-bold">บันทึกอินซูลิน</a>
            </div>
        </div>
    );
}