import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

import { EditNoteForm } from "@/app/notes/[id]/edit/edit-note-form";
import { requireAuthenticatedUser } from "@/lib/auth";
import { isNoteId } from "@/lib/notes";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "メモを編集 | メモアプリ",
};

export const instant = false;

type EditNotePageProps = {
  params: Promise<{ id: string }>;
};

async function EditNoteContent({ params }: EditNotePageProps) {
  await connection();
  const [{ id }, userId] = await Promise.all([
    params,
    requireAuthenticatedUser(),
  ]);

  if (!isNoteId(id)) {
    redirect("/notes");
  }

  const supabase = await createClient();
  const { data: note, error } = await supabase
    .from("notes")
    .select("id, title, content")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !note) {
    redirect("/notes");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-blue-700">メモアプリ</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-950">メモを編集</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        内容を変更して保存してください。
      </p>
      <div className="mt-6">
        <EditNoteForm note={note} />
      </div>
    </section>
  );
}

function EditNoteFallback() {
  return (
    <section
      role="status"
      className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm sm:p-8"
    >
      メモを読み込んでいます…
    </section>
  );
}

export default function EditNotePage({ params }: EditNotePageProps) {
  return (
    <main className="py-10">
      <Suspense fallback={<EditNoteFallback />}>
        <EditNoteContent params={params} />
      </Suspense>
    </main>
  );
}
