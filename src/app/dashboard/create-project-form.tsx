"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createProjectAction, type CreateProjectFormState } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full bg-emerald-500 text-slate-950 hover:bg-emerald-400" disabled={pending}>
      {pending ? "Создаем..." : "Создать"}
    </Button>
  );
}

const createProjectInitialState: CreateProjectFormState = { status: "idle" };

export function CreateProjectForm({ ownerHint }: { ownerHint: string }) {
  const [state, formAction] = useActionState(createProjectAction, createProjectInitialState);
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setIsOpen(false);
    }
  }, [state.status]);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-emerald-500 text-slate-950 hover:bg-emerald-400"
      >
        <Plus className="mr-2 h-4 w-4" />
        Создать проект
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800/95 to-slate-900/90 p-8 shadow-2xl shadow-black/50">
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.03] to-transparent" />

        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-800/50 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold text-white">Новый проект</h2>
          <p className="text-sm text-slate-400">Создайте проект для визуальной разработки</p>
        </div>

        <form ref={formRef} action={formAction} className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="project-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Название
            </Label>
            <Input
              id="project-name"
              name="name"
              placeholder="Например, Интернет-магазин"
              className="h-11 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus-visible:border-emerald-500/50 focus-visible:ring-2 focus-visible:ring-emerald-500/20"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="project-description" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Описание (опционально)
            </Label>
            <textarea
              id="project-description"
              name="description"
              placeholder="Коротко опишите что вы хотите создать"
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:border-emerald-500/50 focus-visible:ring-2 focus-visible:ring-emerald-500/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="project-status" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Статус
              </Label>
              <select
                id="project-status"
                name="status"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3.5 text-sm text-white focus-visible:outline-none focus-visible:border-emerald-500/50 focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                defaultValue="IN_PROGRESS"
              >
                <option value="IN_PROGRESS">В работе</option>
                <option value="DEMO">Демо</option>
                <option value="PREPARATION">Подготовка</option>
              </select>
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="project-owner" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Владелец
              </Label>
              <Input
                id="project-owner"
                name="owner"
                placeholder={ownerHint}
                defaultValue={ownerHint}
                className="h-11 border-slate-700 bg-slate-800/50 text-white placeholder:text-slate-500 focus-visible:border-emerald-500/50 focus-visible:ring-2 focus-visible:ring-emerald-500/20"
              />
            </div>
          </div>

          {state.status === "error" && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 text-sm font-medium text-red-300" role="alert">
              {state.message}
            </div>
          )}
          {state.status === "success" && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3.5 text-sm font-medium text-emerald-300" role="status">
              {state.message}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 h-11 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Отмена
            </Button>
            <div className="flex-1">
              <SubmitButton />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
