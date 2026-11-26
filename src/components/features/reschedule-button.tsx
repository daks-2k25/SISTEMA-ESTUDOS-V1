"use client";

import { useState, useTransition } from "react";
import { CalendarSync } from "lucide-react";
import { rescheduleRemainingDays } from "@/actions/reschedule-remaining-days";
import { Button } from "@/components/ui/button";
import type { ButtonSize } from "@/components/ui/button-styles";

interface RescheduleButtonProps {
  size?: ButtonSize;
}

export function RescheduleButton({ size }: RescheduleButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleReschedule() {
    startTransition(async () => {
      const result = await rescheduleRemainingDays({ confirm: true });
      setMessage(
        result.ok
          ? result.data.rescheduledCount + " dias reagendados a partir de hoje."
          : result.error,
      );
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button icon={CalendarSync} size={size} loading={isPending} onClick={handleReschedule}>
        Reagendar dias restantes
      </Button>
      {message ? (
        <p role="status" className="text-sm font-semibold text-white">
          {message}
        </p>
      ) : null}
    </div>
  );
}
