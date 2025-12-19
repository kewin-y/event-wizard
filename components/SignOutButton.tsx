"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignOutButton() {
    const { isAuthenticated } = useConvexAuth();
    const { signOut } = useAuthActions();
    const router = useRouter();

    return (
        <>
            {isAuthenticated && (
                <Button
                    variant="outline"
                    className="hover:cursor-pointer"
                    onClick={async () => {
                        await signOut();
                        router.push("signin");
                    }}
                >
                    Sign Out
                </Button>
            )}
        </>
    );
}
