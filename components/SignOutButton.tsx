"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SignOutButton({ className }: { className?: string }) {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const router = useRouter();

  return (
    <>
      {isAuthenticated && (
        <Button
          variant="outline"
          className={className}
          onClick={() => {
            void signOut().then(() => {
              router.replace("/signin");
            });
          }}
        >
          Sign Out
        </Button>
      )}
    </>
  );
}
