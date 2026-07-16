"use client";
import { createContext, useContext, useEffect, useState } from "react";
import liff from "@line/liff";

const LiffContext = createContext<any>(null);

export function LiffProvider({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
                if (liff.isLoggedIn()) {
                    const profile = await liff.getProfile();
                    const res = await fetch("/api/auth/check", {
                        method: "POST",
                        body: JSON.stringify({ line_user_id: profile.userId }),
                    });
                    const data = await res.json();
                    setUserId(data.user.id);
                }
            } catch (err) {
                console.error("LIFF Init failed", err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    return (
        <LiffContext.Provider value={{ userId, loading }}>
            {children}
        </LiffContext.Provider>
    );
}

export const useLiff = () => useContext(LiffContext);