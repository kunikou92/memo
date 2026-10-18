"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import type { AuthFormState } from "@/app/auth/state";
import { USER_MESSAGES } from "@/lib/messages";
import {
  clearSupabaseAuthCookies,
  createClient,
} from "@/lib/supabase/server";

type FieldErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fieldErrors: FieldErrors = {};

  if (!email) {
    fieldErrors.email = "メールアドレスを入力してください。";
  } else if (!emailPattern.test(email)) {
    fieldErrors.email = "メールアドレスの形式を確認してください。";
  }

  if (!password) {
    fieldErrors.password = "パスワードを入力してください。";
  }

  return { email, password, fieldErrors };
}

function hasFieldErrors(fieldErrors: FieldErrors) {
  return Boolean(fieldErrors.email || fieldErrors.password);
}

async function getRequestOrigin() {
  const requestOrigin = (await headers()).get("origin");

  if (requestOrigin) {
    try {
      return new URL(requestOrigin).origin;
    } catch {
      // Fall back to the local development URL below.
    }
  }

  return "http://localhost:3000";
}

function signupErrorMessage(code?: string) {
  switch (code) {
    case "email_address_invalid":
      return "このメールアドレスは使用できません。入力内容を確認してください。";
    case "weak_password":
      return "パスワードが要件を満たしていません。より長く複雑なパスワードを設定してください。";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "短時間に多くの操作が行われました。しばらく待ってから再度お試しください。";
    default:
      return USER_MESSAGES.auth.signupFailed;
  }
}

function loginErrorMessage(code?: string) {
  switch (code) {
    case "email_not_confirmed":
      return "メール認証が完了していません。確認メール内のリンクを開いてからログインしてください。";
    case "invalid_credentials":
      return "メールアドレスまたはパスワードが正しくありません。";
    case "over_request_rate_limit":
      return "短時間に多くの操作が行われました。しばらく待ってから再度お試しください。";
    default:
      return USER_MESSAGES.auth.loginFailed;
  }
}

export async function signup(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password, fieldErrors } = validateCredentials(formData);

  if (hasFieldErrors(fieldErrors)) {
    return { status: "error", fieldErrors };
  }

  try {
    const supabase = await createClient();
    const origin = await getRequestOrigin();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/confirm`,
      },
    });

    if (error) {
      return {
        status: "error",
        message: signupErrorMessage(error.code),
      };
    }
  } catch {
    return {
      status: "error",
      message: USER_MESSAGES.communicationError,
    };
  }

  return {
    status: "success",
    message:
      "確認メールを送信しました。メール内のリンクを開いて認証を完了してください。",
  };
}

export async function login(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const { email, password, fieldErrors } = validateCredentials(formData);

  if (hasFieldErrors(fieldErrors)) {
    return { status: "error", fieldErrors };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return {
        status: "error",
        message: loginErrorMessage(error.code),
      };
    }
  } catch {
    return {
      status: "error",
      message: USER_MESSAGES.communicationError,
    };
  }

  redirect("/notes");
}

export async function logout() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut({ scope: "local" });
  } catch {
    // The local cookies are still cleared below when Supabase Auth is
    // temporarily unavailable or the stored session cannot be refreshed.
  } finally {
    await clearSupabaseAuthCookies();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
