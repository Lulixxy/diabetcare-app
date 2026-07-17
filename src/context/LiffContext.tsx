"use client";

import { createContext, useContext, useEffect, useState } from "react";
import liff from "@line/liff";

interface LiffContextType {
    lineUserId: string | null;
    loading: boolean;
}

const LiffContext = createContext<LiffContextType>({
    lineUserId: null,
    loading: true,
});

export function LiffProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [lineUserId, setLineUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                await liff.init({
                    liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
                });

                if (!liff.isLoggedIn()) {
                    liff.login();
                    return;
                }

                const profile = await liff.getProfile();

                setLineUserId(profile.userId);
            } catch (err) {
                console.error("LIFF Error", err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    return (
        <LiffContext.Provider value={{ lineUserId, loading }}>
            {children}
        </LiffContext.Provider>
    );
}

export const useLiff = () => useContext(LiffContext);