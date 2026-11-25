# DevJr 120

App pessoal para organizar uma trilha de estudos de 120 dias (de dev júnior a pleno), seguindo o curso "JavaScript ao Mercado" (83 aulas). Interface em português do Brasil.

Principais telas: **Estudar Hoje** (conteúdo, checklist, notas e sessão de 60 min), **Flashcards** com repetição espaçada (SM-2), **Desafio do Dia** com editor de código e **Calendário 120 Dias**.

## Requisitos

- Node.js 20.9 ou superior (testado com Node 24)
- npm

## Primeiros passos

```bash
npm install
npm run db:setup
npm run dev
```

Abra http://localhost:3000.

Crie o arquivo `.env` a partir do exemplo (`cp .env.example .env`). Ele precisa conter:

```
DATABASE_URL="file:./dev.db"
```

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Executa o build de produção |
| `npm test` | Testes unitários (Vitest) |
| `npx tsc --noEmit` | Checagem de tipos |
| `npm run lint` | ESLint |
| `npm run db:setup` | Cria o banco, aplica as migrações e roda o seed |
| `npm run db:seed` | Roda só o seed (idempotente, não apaga seu progresso) |
| `npm run db:reset` | Apaga o banco, reaplica as migrações e roda o seed |

## Como resetar o banco

```bash
npm run db:reset
```

Isso **apaga todo o progresso** (dias concluídos, notas, flashcards avaliados e rascunhos) e recarrega a trilha do zero. O banco é o arquivo `dev.db` na raiz do projeto.

Para só recarregar o conteúdo da trilha sem perder o progresso, use `npm run db:seed`.

## Como trocar a data de início

1. Edite `START_DATE` em `prisma/seed-data/config.ts` (formato `Date.UTC(ano, mês - 1, dia)`).
2. Rode `npm run db:reset` para recalcular as datas de todos os 120 dias.

Se você só se atrasou, não precisa trocar a data: use o botão **Reagendar dias restantes**, que aparece no topo de Estudar Hoje quando há dias atrasados. Ele redistribui os dias não concluídos a partir de hoje.

O progresso inicial (aulas já estudadas) vem de `COURSE_LESSONS_DONE`, no mesmo arquivo.

## Arquitetura

Clean Architecture dentro de `src/`:

- `domain`: tipos e erros puros
- `services`: regras puras reutilizáveis (SM-2, datas, streak, calendário)
- `use-cases`: regras de aplicação, recebem repositórios por parâmetro
- `repositories`: único lugar que fala com o Prisma
- `actions`: Server Actions finas, validadas com Zod
- `components`: UI (`ui/` genéricos e `features/`)
- `app`: rotas e composição

Stack: Next.js (App Router), TypeScript strict, Tailwind CSS, Prisma 7 com SQLite, Zod e Vitest.
