import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <section
      aria-labelledby="empty-state-title"
      className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center"
    >
      <h2 id="empty-state-title" className="text-lg font-semibold text-slate-900">
        {title}
      </h2>
      <p className="mt-2 text-sm text-slate-600">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </section>
  );
}
