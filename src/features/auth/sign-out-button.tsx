import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/sign-out";

export function SignOutButton({ label = "Sign Out", showLabel = false }: { label?: string; showLabel?: boolean }) {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" size="sm" aria-label="Sign out">
        <LogOut className="size-4" />
        <span className={showLabel ? "inline" : "hidden sm:inline"}>{label}</span>
      </Button>
    </form>
  );
}
