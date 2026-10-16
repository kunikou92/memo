"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signup } from "@/app/auth/actions";
import { initialAuthFormState } from "@/app/auth/state";
import { Button, ErrorMessage, TextInput } from "@/components/ui";

export function SignupForm() {
  const [state, formAction, pending] = useActionState(
    signup,
    initialAuthFormState,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <TextInput
        id="signup-email"
        name="email"
        type="email"
        label="メールアドレス"
        autoComplete="email"
        inputMode="email"
        required
        disabled={pending}
        error={state.fieldErrors?.email}
      />
      <TextInput
        id="signup-password"
        name="password"
        type="password"
        label="パスワード"
        autoComplete="new-password"
        required
        disabled={pending}
        error={state.fieldErrors?.password}
      />

      {state.status === "error" && state.message ? (
        <ErrorMessage message={state.message} />
      ) : null}

      {state.status === "success" && state.message ? (
        <div
          role="status"
          className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {state.message}
        </div>
      ) : null}

      <Button
        type="submit"
        className="w-full"
        loading={pending}
        loadingText="登録しています…"
      >
        新規登録
      </Button>

      <p className="text-center text-sm text-slate-600">
        すでにアカウントをお持ちですか？{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-700 underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          ログイン
        </Link>
      </p>
    </form>
  );
}
