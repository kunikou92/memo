type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="break-words rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      {message}
    </div>
  );
}
