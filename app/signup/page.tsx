import type { Metadata } from "next";

import { SignupForm } from "@/app/signup/signup-form";

export const metadata: Metadata = {
  title: "新規登録 | メモアプリ",
};

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
      <section
        aria-labelledby="signup-heading"
        className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="mb-7 space-y-2">
          <p className="text-sm font-semibold text-blue-700">メモアプリ</p>
          <h1 id="signup-heading" className="text-2xl font-bold text-slate-950">
            アカウントを作成
          </h1>
          <p className="text-sm leading-6 text-slate-600">
            登録後に届くメールから、メールアドレスを認証してください。
          </p>
        </div>
        <SignupForm />
      </section>
    </main>
  );
}
