'use client'
import { toast } from 'sonner';

export default function GlucoseFormModal({ onClose }: { onClose: () => void }) {
    async function submitGlucose(formData: FormData) {
        const glucose = formData.get("glucose");
        const type = formData.get("type");
        const mealType = formData.get("mealType"); // รับค่าใหม่
        const note = formData.get("note");         // รับค่าใหม่

        const res = await fetch("/api/glucose", {
            method: "POST",
            body: JSON.stringify({ glucose, type, mealType, note }),
        });

        if (res.ok) {
            toast.success("บันทึกข้อมูลสำเร็จ!");
            onClose();
            window.location.reload();
        } else {
            toast.error("เกิดข้อผิดพลาดค่ะ");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-xl">
                <h2 className="text-xl font-bold text-slate-800 mb-6">บันทึกระดับน้ำตาล</h2>

                <form action={submitGlucose} className="space-y-4">
                    <input
                        name="glucose"
                        type="number"
                        placeholder="ระดับน้ำตาล (mg/dL)"
                        required
                        className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-teal-600 outline-none text-slate-900 placeholder-slate-400"
                    />

                    <select name="type" className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none text-slate-900 bg-white">
                        <option value="fasting">ก่อนอาหาร (Fasting)</option>
                        <option value="after-meal">หลังอาหาร</option>
                    </select>

                    <select name="mealType" className="w-full p-3 border-2 border-slate-200 rounded-xl outline-none text-slate-900 bg-white">
                        <option value="">-- มื้ออาหาร --</option>
                        <option value="breakfast">มื้อเช้า</option>
                        <option value="lunch">มื้อเที่ยง</option>
                        <option value="dinner">มื้อเย็น</option>
                        <option value="snack">อาหารว่าง</option>
                    </select>

                    <textarea
                        name="note"
                        placeholder="บันทึกเพิ่มเติม (เช่น กินขนมหวานไปนิดหน่อย...)"
                        className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-teal-600 outline-none text-slate-900 placeholder-slate-400 h-24"
                    />

                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={onClose} className="flex-1 py-3 text-slate-500 font-semibold">ยกเลิก</button>
                        <button type="submit" className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-semibold">บันทึก</button>
                    </div>
                </form>
            </div>
        </div>
    );
}