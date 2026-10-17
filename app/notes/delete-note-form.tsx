"use client";

import { type FormEvent, useActionState } from "react";

import { deleteNote } from "@/app/notes/actions";
import { initialDeleteNoteState } from "@/app/notes/state";
import { Button } from "@/components/ui";

type DeleteNoteFormProps = {
  noteId: string;
  noteTitle: string;
};

export function DeleteNoteForm({ noteId, noteTitle }: DeleteNoteFormProps) {
  const [state, formAction, pending] = useActionState(
    deleteNote,
    initialDeleteNoteState,
  );

  function confirmDeletion(event: FormEvent<HTMLFormElement>) {
    const confirmed = window.confirm(
      `「${noteTitle}」を完全に削除します。\nこの操作は取り消せません。本当に削除してよいですか？`,
    );

    if (!confirmed) {
      event.preventDefault();
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-2">
      <form action={formAction} onSubmit={confirmDeletion}>
        <input type="hidden" name="noteId" value={noteId} />
        <Button
          type="submit"
          variant="danger"
          loading={pending}
          loadingText="削除中…"
          className="w-full"
        >
          削除
        </Button>
      </form>
      {state.status === "error" && state.message ? (
        <p role="alert" className="max-w-64 break-words text-sm text-red-700">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
