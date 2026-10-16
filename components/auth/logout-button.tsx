"use client";

import { useFormStatus } from "react-dom";

import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui";

function LogoutSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="secondary"
      loading={pending}
      loadingText="ログアウトしています…"
    >
      ログアウト
    </Button>
  );
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <LogoutSubmitButton />
    </form>
  );
}
