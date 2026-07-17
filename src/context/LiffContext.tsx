"use client";

import { createContext, useContext, useEffect, useState } from "react";
import liff from "@line/liff";

interface LiffContextType {
    userId: string | null;
    loading: boolean;
}

const LiffContext = createContext<LiffContextType>({
    userId: null,
    loading: true,
});

export function LiffProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                await liff.init({
                    liffId: process.env.NEXT_PUBLIC_LIFF_ID!,
                });

                console.log("LIFF Init Success");
                console.log("isLoggedIn =", liff.isLoggedIn());
                console.log("isInClient =", liff.isInClient());

                if (!liff.isLoggedIn()) {
                    liff.login();
                    return;
                }

                const profile = await liff.getProfile();

                console.log("LINE Profile =", profile);

                setUserId(profile.userId);
            } catch (err) {
                console.error("LIFF Init Failed", err);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    return (
        <LiffContext.Provider
            value={{
                userId,
                loading,
            }}
        >
            {children}
        </LiffContext.Provider>
    );
}

export const useLiff = () => useContext(LiffContext);