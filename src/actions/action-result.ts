export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function actionSuccess<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function actionFailure<T>(error: string): ActionResult<T> {
  return { ok: false, error };
}
