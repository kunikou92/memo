import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "メモ | メモアプリ",
};

export default function NotesPage() {
  return (
    <main className="py-10">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-blue-700">メモアプリ</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">
          ログインしました
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          認証セッションが保存されています。メモ機能は今後のタスクで実装します。
        </p>
      </section>
    </main>
  );
}
