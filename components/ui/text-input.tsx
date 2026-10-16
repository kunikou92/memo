import type { ComponentPropsWithoutRef } from "react";

type TextInputProps = Omit<ComponentPropsWithoutRef<"input">, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

export function TextInput({
  id,
  label,
  error,
  hint,
  className = "",
  required,
  type = "text",
  ...props
}: TextInputProps) {
  const descriptionId = error
    ? `${id}-error`
    : hint
      ? `${id}-hint`
      : undefined;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-800" htmlFor={id}>
        {label}
        {required ? (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <input
        {...props}
        id={id}
        type={type}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={descriptionId}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-base text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/25 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
          error ? "border-red-600" : "border-slate-300"
        } ${className}`}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-700">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-slate-600">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
