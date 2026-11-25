# DevJr 120

App pessoal para organizar uma trilha de estudos de 120 dias (de dev júnior a pleno). Interface 100% em português do Brasil.

Estas regras valem para TODAS as fases e devem ser seguidas sempre.

## Stack

- Next.js (versão estável mais recente, App Router)
- TypeScript em modo strict
- Tailwind CSS
- Lucide Icons (lucide-react)
- Prisma ORM em versão ESTÁVEL (não usar release candidate/rc/beta) com SQLite
- Zod para validação
- Server Actions para mutações

## Arquitetura

Clean Architecture, DRY e SOLID.

- src/domain: tipos, entidades e regras puras (sem React, sem Prisma).
- src/repositories: único lugar que fala com o Prisma. Interfaces + implementações.
- src/use-cases: regras de aplicação, recebem repositórios por parâmetro.
- src/services: lógica pura reutilizável (ex.: algoritmo SM-2, datas, streak).
- src/actions: Server Actions finas, validam com Zod e chamam use-cases.
- src/components: UI reutilizável, separada em ui/ (genéricos) e features/.
- src/app: apenas rotas, layouts e composição.
- src/lib: prisma client singleton, utilitários.

## Regras de código

- NUNCA escrever comentários no código (nenhum //, /* */ ou JSX {/* */}). Nomes claros substituem comentários.
- Sem `any`. Tipos explícitos nas fronteiras. Funções pequenas com uma responsabilidade.
- Nada de lógica de negócio dentro de componentes.
- Campos JSON no SQLite ficam como string; converta com funções de mapeamento no repositório (parse/serialize), nunca espalhe JSON.parse pela UI.

## Visual

- Fundo da aplicação #0B0F19.
- Cards glassmorphism: bg-white/5, backdrop-blur, borda border-white/10, cantos arredondados grandes.
- Gradientes violeta → índigo em destaques e botões principais.
- Botões grandes, visíveis, com ícone Lucide, estados hover/focus/disabled claros.
- Responsivo (mobile first), foco visível para acessibilidade.

## Qualidade

Ao final de cada fase rode `npm run build` e `npx tsc --noEmit`, corrija tudo e só então diga que terminou. Resuma o que foi feito em no máximo 8 linhas e diga como testar.
