"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
          onClick={() => {
            void signOut().then(() => {
              router.push("/signin");
            });
          }}
        >
          Sign Out
          <ArrowRight />
        </Button>
      )}
    </>
  );
}
