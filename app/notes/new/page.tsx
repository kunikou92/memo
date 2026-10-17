import type { Metadata } from "next";

import { NewNoteForm } from "@/app/notes/new/new-note-form";

export const metadata: Metadata = {
  title: "メモを作成 | メモアプリ",
};

export default function NewNotePage() {
  return (
    <main className="py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-700">メモアプリ</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">
          新しいメモを作成
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          タイトルと本文を入力して保存してください。
        </p>
        <div className="mt-6">
          <NewNoteForm />
        </div>
      </section>
    </main>
  );
}
