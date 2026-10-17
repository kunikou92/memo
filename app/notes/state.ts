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

export type DeleteNoteState = {
  status: "idle" | "error";
  message?: string;
};

export const initialDeleteNoteState: DeleteNoteState = {
  status: "idle",
};
