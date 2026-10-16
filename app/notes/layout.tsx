import { Suspense, type ReactNode } from "react";

import { requireAuthenticatedUser } from "@/lib/auth";

type NotesLayoutProps = {
  children: ReactNode;
};

async function ProtectedNotes({ children }: NotesLayoutProps) {
  await requireAuthenticatedUser();

  return children;
}

function AuthenticationFallback() {
  return (
    <main className="py-10">
      <p role="status" className="text-sm text-slate-600">
        ログイン状態を確認しています…
      </p>
    </main>
  );
}

export default function NotesLayout({ children }: NotesLayoutProps) {
  return (
    <Suspense fallback={<AuthenticationFallback />}>
      <ProtectedNotes>{children}</ProtectedNotes>
    </Suspense>
  );
}
