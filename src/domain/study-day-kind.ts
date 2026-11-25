export const STUDY_DAY_KINDS = [
  "AULA",
  "AVALIACAO",
  "REVISAO",
  "PROJETO",
  "TRILHA",
] as const;

export type StudyDayKind = (typeof STUDY_DAY_KINDS)[number];

export function isStudyDayKind(value: string): value is StudyDayKind {
  return (STUDY_DAY_KINDS as readonly string[]).includes(value);
}

export function parseStudyDayKind(value: string): StudyDayKind {
  if (!isStudyDayKind(value)) {
    throw new Error("Tipo de dia inválido: " + value);
  }
  return value;
}

export const STUDY_DAY_KIND_LABELS: Record<StudyDayKind, string> = {
  AULA: "Aula",
  AVALIACAO: "Avaliação",
  REVISAO: "Revisão",
  PROJETO: "Projeto",
  TRILHA: "Trilha",
};
