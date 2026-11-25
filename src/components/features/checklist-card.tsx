"use client";

import { useOptimistic, useState, useTransition, type FormEvent } from "react";
import { ListChecks, Plus, Trash2 } from "lucide-react";
import {
  addCustomTask,
  removeCustomTask,
  toggleChecklistTask,
} from "@/actions/study-day-actions";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/ui/button";
import { CardTitle, GlassCard } from "@/components/ui/glass-card";
import type { ChecklistTask } from "@/domain/study-day";
import {
  MAX_CUSTOM_TASK_LENGTH,
  addCustomTask as addCustomTaskToList,
  removeCustomTask as removeCustomTaskFromList,
  toggleTask,
} from "@/services/checklist";

type OptimisticChange =
  | { type: "toggle"; taskId: string }
  | { type: "add"; taskId: string; label: string }
  | { type: "remove"; taskId: string };

function applyChange(
  tasks: ChecklistTask[],
  change: OptimisticChange,
): ChecklistTask[] {
  if (change.type === "toggle") return toggleTask(tasks, change.taskId);
  if (change.type === "add") {
    return addCustomTaskToList(tasks, change.label, change.taskId);
  }
  return removeCustomTaskFromList(tasks, change.taskId);
}

interface ChecklistCardProps {
  studyDayId: string;
  tasks: ChecklistTask[];
}

export function ChecklistCard({ studyDayId, tasks }: ChecklistCardProps) {
  const [optimisticTasks, applyOptimistic] = useOptimistic(tasks, applyChange);
  const [, startTransition] = useTransition();
  const [newLabel, setNewLabel] = useState("");
  const [error, setError] = useState<string | null>(null);

  const doneCount = optimisticTasks.filter((task) => task.done).length;

  function run(change: OptimisticChange, perform: () => Promise<ActionResult<null>>) {
    startTransition(async () => {
      applyOptimistic(change);
      const result = await perform();
      setError(result.ok ? null : result.error);
    });
  }

  function handleToggle(taskId: string) {
    run({ type: "toggle", taskId }, () =>
      toggleChecklistTask({ studyDayId, taskId }),
    );
  }

  function handleRemove(taskId: string) {
    run({ type: "remove", taskId }, () =>
      removeCustomTask({ studyDayId, taskId }),
    );
  }

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const label = newLabel.trim();
    if (label === "") return;
    setNewLabel("");
    const taskId = crypto.randomUUID();
    run({ type: "add", taskId, label }, () =>
      addCustomTask({ studyDayId, taskId, label }),
    );
  }

  return (
    <GlassCard ariaLabel="Checklist do dia">
      <CardTitle
        icon={<ListChecks aria-hidden className="size-5 text-violet-300" />}
        action={
          <span className="text-sm font-semibold text-slate-300">
            {doneCount} de {optimisticTasks.length}
          </span>
        }
      >
        O que fiz hoje
      </CardTitle>

      <ul className="space-y-2">
        {optimisticTasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <label className="flex min-h-10 flex-1 cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleToggle(task.id)}
                className="size-5 shrink-0 accent-violet-500"
              />
              <span
                className={
                  task.done ? "text-slate-400 line-through" : "text-slate-100"
                }
              >
                {task.label}
              </span>
            </label>
            {task.isCustom ? (
              <button
                type="button"
                onClick={() => handleRemove(task.id)}
                aria-label={"Remover tarefa: " + task.label}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-rose-500/15 hover:text-rose-300"
              >
                <Trash2 aria-hidden className="size-4" />
              </button>
            ) : null}
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label htmlFor="nova-tarefa" className="sr-only">
          Nova tarefa personalizada
        </label>
        <input
          id="nova-tarefa"
          value={newLabel}
          maxLength={MAX_CUSTOM_TASK_LENGTH}
          onChange={(event) => setNewLabel(event.target.value)}
          placeholder="Adicionar tarefa personalizada"
          className="min-h-12 flex-1 rounded-2xl border border-white/10 bg-[#111827] px-4 text-sm text-white placeholder:text-slate-400"
        />
        <Button type="submit" icon={Plus} size="md" disabled={newLabel.trim() === ""}>
          Adicionar
        </Button>
      </form>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-semibold text-rose-300">
          {error}
        </p>
      ) : null}
    </GlassCard>
  );
}
