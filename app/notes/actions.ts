"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { NoteFormState } from "@/app/notes/state";
import { requireAuthenticatedUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const TITLE_MAX_LENGTH = 100;
const CONTENT_MAX_LENGTH = 10_000;

function validateNote(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "");
  const fieldErrors: NonNullable<NoteFormState["fieldErrors"]> = {};

  if (!title) {
    fieldErrors.title = "タイトルを入力してください。";
  } else if (title.length > TITLE_MAX_LENGTH) {
    fieldErrors.title = `タイトルは${TITLE_MAX_LENGTH}文字以内で入力してください。`;
  }

  if (content.length > CONTENT_MAX_LENGTH) {
    fieldErrors.content = `本文は${CONTENT_MAX_LENGTH.toLocaleString("ja-JP")}文字以内で入力してください。`;
  }

  return { title, content, fieldErrors };
}

export async function createNote(
  _previousState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const userId = await requireAuthenticatedUser();
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
