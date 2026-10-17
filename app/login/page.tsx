import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/app/login/login-form";
import { ErrorMessage } from "@/components/ui";
import { USER_MESSAGES } from "@/lib/messages";

export const metadata: Metadata = {
  title: "ログイン | メモアプリ",
};

type LoginPageProps = {
  searchParams: Promise<{
    confirmed?: string;
    error?: string;
  }>;
};

async function LoginStatus({
  searchParams,
}: Pick<LoginPageProps, "searchParams">) {
  const params = await searchParams;

  if (params.confirmed === "true") {
    return (
      <div
        role="status"
        className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
      >
        メール認証が完了しました。登録した情報でログインしてください。
      </div>
    );
  }

  if (params.error === "confirmation") {
    return (
      <ErrorMessage message={USER_MESSAGES.auth.confirmationFailed} />
    );
  }

  return null;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
      <section
        aria-labelledby="login-heading"
        className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="mb-7 space-y-2">
          <p className="text-sm font-semibold text-blue-700">メモアプリ</p>
          <h1 id="login-heading" className="text-2xl font-bold text-slate-950">
            ログイン
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            登録したメールアドレスとパスワードを入力してください。
          </p>
        </div>
        <LoginForm>
          <Suspense fallback={null}>
            <LoginStatus searchParams={searchParams} />
          </Suspense>
        </LoginForm>
      </section>
    </main>
  );
}
