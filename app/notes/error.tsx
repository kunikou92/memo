"use client";

import { Button, ErrorMessage } from "@/components/ui";
import { USER_MESSAGES } from "@/lib/messages";

type NotesErrorProps = {
  reset: () => void;
};

export default function NotesError({ reset }: NotesErrorProps) {
  return (
    <main className="py-10">
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-950">
          エラーが発生しました
        </h1>
        <ErrorMessage message={USER_MESSAGES.notes.loadFailed} />
        <Button type="button" variant="secondary" onClick={reset}>
          再試行
        </Button>
      </section>
    </main>
  );
}
