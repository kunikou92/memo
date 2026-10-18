import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";

import { DeleteNoteForm } from "@/app/notes/delete-note-form";
import { LogoutButton } from "@/components/auth/logout-button";
import { EmptyState, ErrorMessage } from "@/components/ui";
import { requireAuthenticatedUser } from "@/lib/auth";
import { formatJapaneseDateTime } from "@/lib/date";
import { USER_MESSAGES } from "@/lib/messages";
import { NOTES_PER_PAGE } from "@/lib/notes";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "メモ | メモアプリ",
};

export const instant = false;

type NotesPageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

function parsePage(value: string | string[] | undefined) {
  if (value === undefined) {
    return 1;
  }

  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const page = Number(value);

  return Number.isSafeInteger(page) ? page : null;
}

function notesPageHref(page: number) {
  return page === 1 ? "/notes" : `/notes?page=${page}`;
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  await connection();
  const currentPage = parsePage((await searchParams).page);

  if (currentPage === null) {
    redirect("/notes");
  }

  const userId = await requireAuthenticatedUser();
  const supabase = await createClient();
  const rangeStart = (currentPage - 1) * NOTES_PER_PAGE;
  const rangeEnd = rangeStart + NOTES_PER_PAGE - 1;
  const { data: notes, error, count } = await supabase
    .from("notes")
    .select("id, title, updated_at", { count: "exact" })
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .order("id", { ascending: false })
    .range(rangeStart, rangeEnd);

  const totalPages = Math.max(1, Math.ceil((count ?? 0) / NOTES_PER_PAGE));

  if (!error && currentPage > totalPages) {
    redirect(notesPageHref(totalPages));
  }

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
          <div className="space-y-3">
            <ErrorMessage message={USER_MESSAGES.notes.loadFailed} />
            <a
              href="/notes"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
            >
              再試行
            </a>
          </div>
        ) : notes && notes.length > 0 ? (
          <div className="space-y-6">
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
                    <div className="flex flex-wrap gap-2 sm:shrink-0">
                      <Link
                        href={`/notes/${note.id}/edit`}
                        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
                      >
                        編集
                      </Link>
                      <DeleteNoteForm
                        noteId={note.id}
                        noteTitle={note.title}
                      />
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            {totalPages > 1 ? (
              <nav
                aria-label="メモ一覧のページ移動"
                className="flex flex-wrap items-center justify-center gap-3"
              >
                {currentPage > 1 ? (
                  <Link
                    href={notesPageHref(currentPage - 1)}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
                  >
                    前のページ
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400"
                  >
                    前のページ
                  </span>
                )}

                <span className="text-sm text-slate-600" aria-live="polite">
                  {currentPage} / {totalPages} ページ
                </span>

                {currentPage < totalPages ? (
                  <Link
                    href={notesPageHref(currentPage + 1)}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
                  >
                    次のページ
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-400"
                  >
                    次のページ
                  </span>
                )}
              </nav>
            ) : null}
          </div>
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
