"use client";

import Link from "next/link";
import { useActionState } from "react";

import { createNote } from "@/app/notes/actions";
import { initialNoteFormState } from "@/app/notes/state";
import { Button, ErrorMessage, Textarea, TextInput } from "@/components/ui";
import {
  NOTE_CONTENT_MAX_LENGTH,
  NOTE_TITLE_MAX_LENGTH,
} from "@/lib/notes";

export function NewNoteForm() {
  const [state, formAction, pending] = useActionState(
    createNote,
    initialNoteFormState,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <TextInput
        id="note-title"
        name="title"
        label="タイトル"
        maxLength={NOTE_TITLE_MAX_LENGTH}
        required
        disabled={pending}
        error={state.fieldErrors?.title}
        hint="100文字以内"
      />
      <Textarea
        id="note-content"
        name="content"
        label="本文"
        maxLength={NOTE_CONTENT_MAX_LENGTH}
        disabled={pending}
        error={state.fieldErrors?.content}
        hint="10,000文字以内（空欄でも保存できます）"
      />

      {state.status === "error" && state.message ? (
        <ErrorMessage message={state.message} />
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/notes"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2"
        >
          一覧へ戻る
        </Link>
        <Button
          type="submit"
          loading={pending}
          loadingText="保存しています…"
        >
          保存
        </Button>
      </div>
    </form>
  );
}
