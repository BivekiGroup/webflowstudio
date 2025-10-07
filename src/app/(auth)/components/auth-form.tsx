"use client";

import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthFormState } from "../auth-state";

type AuthFormProps = {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  initialState: AuthFormState;
  submitLabel: string;
  children: ReactNode;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      className="w-full border border-emerald-400/30 bg-emerald-500/90 text-white shadow-[0_10px_45px_-25px_rgba(16,185,129,0.95)] transition-shadow hover:border-emerald-300/60 hover:bg-emerald-400"
      disabled={pending}
    >
      {pending ? "Обработка..." : label}
    </Button>
  );
}

export function AuthFormField(props: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  const { label, name, type = "text", placeholder, autoComplete, required } = props;
  return (
    <div className="space-y-2 text-left">
      <Label htmlFor={name} className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="border border-slate-800/70 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 shadow-[0_0_0_0_rgba(0,0,0,0)] focus-visible:border-emerald-400/70 focus-visible:ring-2 focus-visible:ring-emerald-500/40"
      />
    </div>
  );
}

export function AuthForm({ action, initialState, submitLabel, children }: AuthFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="relative space-y-6 overflow-hidden rounded-[26px] border border-slate-800/70 bg-slate-950/80 p-9 shadow-[0_40px_120px_-60px_rgba(16,185,129,0.8)] backdrop-blur"
    >
      <div className="pointer-events-none absolute inset-x-6 -top-28 h-40 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-0 h-32 w-32 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="space-y-4">{children}</div>
      {state.status === "error" ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.message ?? "Что-то пошло не так. Повторите попытку позднее."}
        </div>
      ) : null}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
