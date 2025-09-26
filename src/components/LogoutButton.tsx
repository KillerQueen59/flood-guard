"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Button, { ButtonSize, ButtonColor } from "@/components/Button";

export function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      label="Logout"
      buttonSize={ButtonSize.MEDIUM}
      buttonColor={ButtonColor.DANGER}
    />
  );
}
