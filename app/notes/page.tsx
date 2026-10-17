import type { Metadata } from "next";
import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { Button, EmptyState, ErrorMessage } from "@/components/ui";
import { requireAuthenticatedUser } from "@/lib/auth";
import { formatJapaneseDateTime } from "@/lib/date";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "メモ | メモアプリ",
};

export default async function NotesPage() {
  const userId = await requireAuthenticatedUser();
  const supabase = await createClient();
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return (
    <main className="py-10">
      <section aria-labelledby="notes-heading" className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue-700">メモアプリ</p>
              <h1
                id="notes-heading"
                className="mt-2 text-2xl font-bold text-slate-950"
              >
                メモ一覧
              </h1>
            </div>
            <LogoutButton />
          </div>
          <div className="mt-6">
            <Link
              href="/notes/new"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              新しいメモを作成
            </Link>
          </div>
        </div>

        {error ? (
          <ErrorMessage message="メモを取得できませんでした。時間をおいて再度お試しください。" />
        ) : notes && notes.length > 0 ? (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <article className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="break-words text-lg font-semibold text-slate-950">
                      {note.title}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      更新日時: {" "}
                      <time dateTime={note.updated_at}>
                        {formatJapaneseDateTime(note.updated_at)}
                      </time>
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/notes/${note.id}/edit`}
                      className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
                    >
                      編集
                    </Link>
                    <Button
                      variant="secondary"
                      disabled
                      title="削除機能は次のタスクで実装します"
                    >
                      削除
                    </Button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            title="メモはまだありません"
            message="最初のメモを作成してみましょう。"
            action={
              <Link
                href="/notes/new"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                メモを作成
              </Link>
            }
          />
        )}
      </section>
    </main>
  );
}
