"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { currentUser } from "@/redux/features/auth/authSlice";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useSelector(currentUser);

    useEffect(() => {
        if (!user) {
            router.replace("/auth");
        }
    }, [user, router]);

    if (!user) return null;
    return <>{children}</>;
}
