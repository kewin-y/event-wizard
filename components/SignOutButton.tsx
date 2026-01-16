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
          variant="secondary"
          className="hover:cursor-pointer"
          onClick={async () => {
            await signOut();
            window.location.href = "/signin";
          }}
        >
          Sign Out
        </Button>
      )}
    </>
  );
}
