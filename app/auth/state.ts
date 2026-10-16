type FieldErrors = {
  email?: string;
  password?: string;
};

export type AuthFormState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: FieldErrors;
};

export const initialAuthFormState: AuthFormState = {
  status: "idle",
};
