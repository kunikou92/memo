"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { NoteFormState } from "@/app/notes/state";
import { requireAuthenticatedUserForAction } from "@/lib/auth";
import {
  isNoteId,
  NOTE_CONTENT_MAX_LENGTH,
  NOTE_TITLE_MAX_LENGTH,
} from "@/lib/notes";
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
        message: "メモを保存できませんでした。時間をおいて再度お試しください。",
      };
    }
  } catch {
    return {
      status: "error",
      message: "通信に失敗しました。接続を確認して再度お試しください。",
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
      message: "編集対象のメモを確認できませんでした。一覧から開き直してください。",
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
        message: "メモを更新できませんでした。一覧から開き直して再度お試しください。",
      };
    }
  } catch {
    return {
      status: "error",
      message: "通信に失敗しました。接続を確認して再度お試しください。",
    };
  }

  revalidatePath("/notes");
  revalidatePath(`/notes/${noteId}/edit`);
  redirect("/notes");
}
