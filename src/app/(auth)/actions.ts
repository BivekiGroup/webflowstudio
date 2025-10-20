"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loginUser, logoutUser, registerUser } from "@/lib/auth";
import type { AuthFormState } from "./auth-state";

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const name = formData.get("name") ? String(formData.get("name")) : undefined;

  if (password !== confirmPassword) {
    return { status: "error", message: "Пароли не совпадают." };
  }

  const result = await registerUser({ email, password, name });

  if (!result.success) {
    return { status: "error", message: result.error };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await loginUser({ email, password });
  if (!result.success) {
    return { status: "error", message: result.error };
  }

  revalidatePath("/dashboard", "layout");
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await logoutUser();
  redirect("/");
}
