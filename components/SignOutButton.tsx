"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";

export default function SignOutButton({
  ...props
}: React.ComponentProps<"button">) {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  return (
    <>
      {isAuthenticated && (
        <Button
          variant="outline"
          onClick={async () => {
            await signOut();
            window.location.href = "/signin";
          }}
          {...props}
        >
          Sign Out
        </Button>
      )}
    </>
  );
}
