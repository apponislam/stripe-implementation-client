"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { currentUser } from "@/redux/features/auth/authSlice";

export function AuthRedirect({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const user = useSelector(currentUser);

    useEffect(() => {
        if (user && pathname !== "/") {
            router.replace("/");
        }
    }, [user, pathname, router]);

    if (user && pathname !== "/") return null;
    return <>{children}</>;
}
