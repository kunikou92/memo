import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "メモアプリ",
  description: "自分専用のシンプルなメモアプリ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja">
      <body>
        <div className="mx-auto min-h-screen min-w-0 w-full max-w-3xl px-4 py-8 sm:px-6">
          {children}
        </div>
      </body>
    </html>
  );
}
