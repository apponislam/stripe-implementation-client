import { ReactNode } from "react";
import { AuthRedirect } from "@/components/auth/AuthRedirect";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <AuthRedirect>{children}</AuthRedirect>
        </>
    );
}
