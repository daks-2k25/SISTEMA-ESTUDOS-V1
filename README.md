# DevJr 120

App pessoal para organizar uma trilha de estudos de 120 dias (de dev júnior a pleno), seguindo o curso "JavaScript ao Mercado" (83 aulas). Interface em português do Brasil.

Principais telas: **Estudar Hoje** (conteúdo, checklist, notas e sessão de 60 min), **Flashcards** com repetição espaçada (SM-2), **Desafio do Dia** com editor de código e **Calendário 120 Dias**.

## Requisitos

- Node.js 20.12 ou superior (testado com Node 24)
- npm
- Um banco PostgreSQL. O projeto usa o [Neon](https://neon.tech) (plano gratuito atende)

## Banco de dados (Neon)

1. Crie um projeto no Neon e abra **Connect**.
2. Copie as **duas** connection strings:
   - **com pooler** (o host contém `-pooler`): usada pelo app, vira `DATABASE_URL`;
   - **sem pooler** (conexão direta): usada pelas migrações, vira `DIRECT_URL`.
3. Copie o exemplo e preencha:

```bash
cp .env.example .env
```

## Login

O app tem um único usuário, definido em `src/lib/auth-config.ts`. A senha fica no código apenas como hash.

1. Gere o hash da senha com `npm run auth:hash` e cole o resultado em `passwordHash`.
2. Defina `SESSION_SECRET` no `.env` (texto aleatório com 32+ caracteres; o `.env.example` mostra como gerar).
3. Na Vercel, cadastre o mesmo `SESSION_SECRET` em **Environment Variables**.

Cinco senhas erradas seguidas bloqueiam o IP por 15 minutos. Com **Lembrar de mim**, a sessão dura 30 dias; sem ele, termina ao fechar o navegador (ou em 12 horas).

## Primeiros passos

```bash
npm install
npm run db:setup
npm run dev
```

`db:setup` aplica as migrações e carrega a trilha dos 120 dias. Depois abra http://localhost:3000.

## Comandos

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm start` | Executa o build de produção |
| `npm test` | Testes unitários (Vitest) |
| `npx tsc --noEmit` | Checagem de tipos |
| `npm run lint` | ESLint |
| `npm run db:setup` | Aplica as migrações e roda o seed |
| `npm run db:seed` | Roda só o seed (não apaga progresso; sincroniza o conteúdo dos desafios com o plano) |
| `npm run db:backup` | Salva um backup JSON do banco em `backups/` |
| `npm run auth:hash` | Gera o hash da senha de login |
| `npm run db:reset` | **Apaga o banco inteiro**, reaplica as migrações e roda o seed |

## Como resetar o banco

```bash
npm run db:reset
```

Isso **apaga todo o progresso** (dias concluídos, notas, flashcards avaliados e rascunhos) do banco apontado pelo `.env`. Confira o `DATABASE_URL` antes de rodar e **nunca use contra o banco de produção**.

Para só atualizar o conteúdo da trilha sem perder o progresso, use `npm run db:seed`.

## Como trocar a data de início

1. Edite `START_DATE` em `prisma/seed-data/config.ts` (formato `Date.UTC(ano, mês - 1, dia)`).
2. Rode `npm run db:reset` para recalcular as datas de todos os 120 dias.

Se você só se atrasou, não precisa trocar a data: use o botão **Reagendar dias restantes**, que fica sempre no topo do Calendário (e aparece em Estudar Hoje quando há dias atrasados). Ele redistribui os dias não concluídos a partir de hoje.

As aulas já estudadas e as datas reais de conclusão vêm de `STUDIED_LESSON_DATES`, no mesmo arquivo. O seed nunca grava uma conclusão no futuro.

## Backup

- No app: botão **Exportar backup (JSON)** no topo do Calendário (rota `/api/backup`, exige login).
- No terminal: `npm run db:backup` salva o arquivo em `backups/` (pasta ignorada pelo Git).

## Integrações

Todas são opcionais e configuradas só por variáveis de ambiente (no `.env` e em **Vercel → Settings → Environment Variables**). Sem a variável, a integração mostra um aviso amigável em vez de quebrar.

| Variável | Para que serve |
|---|---|
| `STUDY_START_HOUR` | Hora dos eventos do calendário .ics (0 a 23, padrão 19) |
| `CALENDAR_TOKEN` | Permite assinar o calendário pela URL `/api/calendario.ics?token=...` |
| `GITHUB_USERNAME` | Usuário do GitHub mostrado no card do dashboard |
| `GITHUB_TOKEN` | Opcional; aumenta o limite de requisições à API do GitHub |
| `CRON_SECRET` | Protege a rota do lembrete diário (`/api/cron/lembrete`) |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | Lembrete pelo Telegram |
| `RESEND_API_KEY` / `EMAIL_TO` | Lembrete por e-mail (Resend) |

Para gerar `CALENDAR_TOKEN` e `CRON_SECRET`, use o mesmo comando do `SESSION_SECRET` (um valor diferente para cada).

**Flashcards:** em Flashcards há **Importar** (JSON ou CSV com prévia), **Exportar para Anki** (CSV) e **Exportar flashcards (JSON)**.

**Calendário:** em Calendário há **Copiar resumo para o curso** (markdown) e o card **Adicionar ao calendário** (.ics para baixar ou URL para assinar).

### Lembrete diário pelo Telegram

1. No Telegram, abra o **@BotFather**, envie `/newbot`, escolha nome e usuário do bot e guarde o token. Ele vai em `TELEGRAM_BOT_TOKEN`.
2. Abra a conversa com o seu bot e mande qualquer mensagem (por exemplo, `oi`).
3. No navegador, abra `https://api.telegram.org/bot<SEU_TOKEN>/getUpdates`. Procure `"chat":{"id": ...}`: esse número vai em `TELEGRAM_CHAT_ID`.
4. Crie um `CRON_SECRET`.
5. Na Vercel, cadastre `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` e `CRON_SECRET` e faça um novo deploy (**Deployments → ⋯ → Redeploy**). Variáveis novas só valem depois do redeploy.

O `vercel.json` agenda o lembrete todo dia às 22:00 UTC (19:00 em Brasília). Ele só envia se o dia de hoje ainda não estiver concluído. Para testar sem esperar:

```bash
curl -H "Authorization: Bearer SEU_CRON_SECRET" https://SEU-APP.vercel.app/api/cron/lembrete
```

Para e-mail, crie uma conta no Resend, gere a `RESEND_API_KEY` e defina `EMAIL_TO`. O remetente usado é `onboarding@resend.dev`, que serve para testes enviando ao e-mail da própria conta do Resend; para outros destinos é preciso verificar um domínio no Resend.

## Publicar na Vercel

1. Importe o repositório na Vercel (framework Next.js, sem alterar comandos: o script `vercel-build` já aplica as migrações antes do build).
2. Em **Settings → Environment Variables**, cadastre `DATABASE_URL` (com pooler) e `DIRECT_URL` (sem pooler).
3. Faça o deploy. As tabelas são criadas automaticamente pelas migrações.
4. Carregue a trilha **uma única vez** no banco do Neon, rodando na sua máquina com o `.env` apontando para o Neon:

```bash
npm run db:seed
```

5. O app não tem login: qualquer pessoa com a URL pode alterar os dados. Ative a **Deployment Protection** (proteção por senha ou login) da Vercel no projeto.

## Arquitetura

Clean Architecture dentro de `src/`:

- `domain`: tipos e erros puros
- `services`: regras puras reutilizáveis (SM-2, datas, streak, calendário)
- `use-cases`: regras de aplicação, recebem repositórios por parâmetro
- `repositories`: único lugar que fala com o Prisma
- `actions`: Server Actions finas, validadas com Zod
- `components`: UI (`ui/` genéricos e `features/`)
- `app`: rotas e composição

Stack: Next.js (App Router), TypeScript strict, Tailwind CSS, Prisma 7 com PostgreSQL (Neon), Zod e Vitest.
