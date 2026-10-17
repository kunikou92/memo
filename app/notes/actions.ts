"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { DeleteNoteState, NoteFormState } from "@/app/notes/state";
import { requireAuthenticatedUserForAction } from "@/lib/auth";
import {
  isNoteId,
  NOTE_CONTENT_MAX_LENGTH,
  NOTE_TITLE_MAX_LENGTH,
} from "@/lib/notes";
import { USER_MESSAGES } from "@/lib/messages";
import { createClient } from "@/lib/supabase/server";

function validateNote(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const fieldErrors: NonNullable<NoteFormState["fieldErrors"]> = {};

  if (!title) {
    fieldErrors.title = "タイトルを入力してください。";
  } else if (title.length > NOTE_TITLE_MAX_LENGTH) {
    fieldErrors.title = `タイトルは${NOTE_TITLE_MAX_LENGTH}文字以内で入力してください。`;
  }

  if (content.length > NOTE_CONTENT_MAX_LENGTH) {
    fieldErrors.content = `本文は${NOTE_CONTENT_MAX_LENGTH.toLocaleString("ja-JP")}文字以内で入力してください。`;
  }

  return { title, content, fieldErrors };
}

export async function createNote(
  _previousState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const userId = await requireAuthenticatedUserForAction();
  const { title, content, fieldErrors } = validateNote(formData);

  if (fieldErrors.title || fieldErrors.content) {
    return { status: "error", fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("notes").insert({
      title,
      content,
      user_id: userId,
    });

    if (error) {
      return {
        status: "error",
        message: USER_MESSAGES.notes.saveFailed,
      };
    }
  } catch {
    return {
      status: "error",
      message: USER_MESSAGES.communicationError,
    };
  }

  revalidatePath("/notes");
  redirect("/notes");
}

export async function updateNote(
  _previousState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const userId = await requireAuthenticatedUserForAction();
  const noteId = String(formData.get("noteId") ?? "");

  if (!isNoteId(noteId)) {
    return {
      status: "error",
      message: USER_MESSAGES.notes.unavailable,
    };
  }

  const { title, content, fieldErrors } = validateNote(formData);

  if (fieldErrors.title || fieldErrors.content) {
    return { status: "error", fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .update({ title, content })
      .eq("id", noteId)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      return {
        status: "error",
        message: error
          ? USER_MESSAGES.notes.saveFailed
          : USER_MESSAGES.notes.unavailable,
      };
    }
  } catch {
    return {
      status: "error",
      message: USER_MESSAGES.communicationError,
    };
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${noteId}/edit`);
  redirect("/notes");
}

export async function deleteNote(
  _previousState: DeleteNoteState,
  formData: FormData,
): Promise<DeleteNoteState> {
  const userId = await requireAuthenticatedUserForAction();
  const noteId = String(formData.get("noteId") ?? "");

  if (!isNoteId(noteId)) {
    return {
      status: "error",
      message: USER_MESSAGES.notes.unavailable,
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notes")
      .delete()
      .eq("id", noteId)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (error || !data) {
      return {
        status: "error",
        message: error
          ? USER_MESSAGES.notes.deleteFailed
          : USER_MESSAGES.notes.unavailable,
      };
    }
  } catch {
    return {
      status: "error",
      message: USER_MESSAGES.communicationError,
    };
  }

  revalidatePath("/notes");
  return { status: "idle" };
}
