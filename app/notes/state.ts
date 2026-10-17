type NoteFieldErrors = {
  title?: string;
  content?: string;
};

export type NoteFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: NoteFieldErrors;
};

export const initialNoteFormState: NoteFormState = {
  status: "idle",
};
