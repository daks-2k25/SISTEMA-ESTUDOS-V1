"use client";

import { useState, useTransition, type FormEvent } from "react";
import { loginAction } from "@/actions/auth-actions";

export function useLoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError(null);

    startTransition(async () => {
      const result = await loginAction({
        username: String(data.get("username") ?? ""),
        password: String(data.get("password") ?? ""),
        rememberMe: data.get("rememberMe") === "on",
      });
      if (!result.ok) setError(result.error);
    });
  }

  return { error, isPending, handleSubmit };
}
