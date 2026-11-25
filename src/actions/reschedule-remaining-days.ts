"use server";

import { z } from "zod";
import type { ActionResult } from "@/actions/action-result";
import { runAction } from "@/actions/run-action";
import { APP_TIME_ZONE } from "@/lib/app-config";
import { studyDayRepository } from "@/lib/repositories";
import { rescheduleFromToday } from "@/use-cases/reschedule-from-today";

const rescheduleInputSchema = z.object({
  confirm: z.literal(true),
});

export interface RescheduleActionData {
  rescheduledCount: number;
  firstDate: string | null;
  lastDate: string | null;
}

export async function rescheduleRemainingDays(
  input: unknown,
): Promise<ActionResult<RescheduleActionData>> {
  return runAction({
    schema: rescheduleInputSchema,
    input,
    handler: async () => {
      const result = await rescheduleFromToday(
        studyDayRepository,
        new Date(),
        APP_TIME_ZONE,
      );
      return {
        rescheduledCount: result.rescheduledCount,
        firstDate: result.firstDate?.toISOString() ?? null,
        lastDate: result.lastDate?.toISOString() ?? null,
      };
    },
  });
}
