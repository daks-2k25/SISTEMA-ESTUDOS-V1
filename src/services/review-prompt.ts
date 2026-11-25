export interface ReviewPromptInput {
  title: string;
  description: string;
  userCode: string;
}

const EMPTY_CODE_PLACEHOLDER = "(ainda não escrevi nenhum código)";

export function buildReviewPrompt(input: ReviewPromptInput): string {
  const code = input.userCode.trim() === "" ? EMPTY_CODE_PLACEHOLDER : input.userCode.trim();

  return [
    "Você é um mentor de programação paciente. Estou estudando JavaScript e preciso de uma revisão do meu código.",
    "",
    "## Desafio",
    input.title,
    "",
    input.description.trim(),
    "",
    "## Meu código",
    "```javascript",
    code,
    "```",
    "",
    "## O que eu preciso",
    "1. Revise meu código linha a linha, explicando o que cada trecho faz e apontando erros de lógica, de sintaxe e más práticas.",
    "2. Diga se a solução resolve o enunciado e cite casos de borda que podem falhar.",
    "3. Dê dicas progressivas para eu corrigir sozinho.",
    "4. NÃO me entregue a solução completa nem reescreva meu código inteiro. Se precisar mostrar algo, mostre só um pequeno trecho de exemplo.",
    "5. Responda em português do Brasil.",
  ].join("\n");
}
