export type AuthFormState = {
  status: "idle" | "error";
  message?: string;
};

export const defaultAuthState: AuthFormState = { status: "idle" };
