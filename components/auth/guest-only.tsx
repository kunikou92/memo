import { type ReactNode } from "react";

import { redirectAuthenticatedUser } from "@/lib/auth";

type GuestOnlyProps = {
  children: ReactNode;
};

export async function GuestOnly({ children }: GuestOnlyProps) {
  await redirectAuthenticatedUser();

  return children;
}
