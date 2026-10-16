"use client";

import Link from "next/link";
import { useActionState, type ReactNode } from "react";

import { login } from "@/app/auth/actions";
import { initialAuthFormState } from "@/app/auth/state";
import { Button, ErrorMessage, TextInput } from "@/components/ui";

type LoginFormProps = {
  children?: ReactNode;
};

export function LoginForm({ children }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(
    login,
    initialAuthFormState,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {children}

      <TextInput
        id="login-email"
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
        id="login-password"
        name="password"
        type="password"
        label="パスワード"
        autoComplete="current-password"
        required
        disabled={pending}
        error={state.fieldErrors?.password}
      />

      {state.status === "error" && state.message ? (
        <ErrorMessage message={state.message} />
      ) : null}

      <Button
        type="submit"
        className="w-full"
        loading={pending}
        loadingText="ログインしています…"
      >
        ログイン
      </Button>

      <p className="text-center text-sm text-slate-600">
        アカウントをお持ちでないですか？{" "}
        <Link
          href="/signup"
          className="font-semibold text-blue-700 underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          新規登録
        </Link>
      </p>
    </form>
  );
}
