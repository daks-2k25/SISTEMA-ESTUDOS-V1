import { revalidatePath } from "next/cache";
import type { z } from "zod";
import {
  actionFailure,
  actionSuccess,
  type ActionResult,
} from "@/actions/action-result";
import { InvalidInputError, NotFoundError } from "@/domain/errors";

interface RunActionOptions<Schema extends z.ZodType, Output> {
  schema: Schema;
  input: unknown;
  handler: (data: z.infer<Schema>) => Promise<Output>;
  shouldRevalidate?: boolean;
}

function describeError(error: unknown): string {
  if (error instanceof NotFoundError || error instanceof InvalidInputError) {
    return error.message;
  }
  return "Não foi possível concluir a operação. Tente novamente.";
}

export async function runAction<Schema extends z.ZodType, Output>(
  options: RunActionOptions<Schema, Output>,
): Promise<ActionResult<Output>> {
  const parsed = options.schema.safeParse(options.input);
  if (!parsed.success) {
    return actionFailure("Dados inválidos. Revise e tente novamente.");
  }

  try {
    const output = await options.handler(parsed.data);
    if (options.shouldRevalidate !== false) {
      revalidatePath("/", "layout");
    }
    return actionSuccess(output);
  } catch (error) {
    return actionFailure(describeError(error));
  }
}
