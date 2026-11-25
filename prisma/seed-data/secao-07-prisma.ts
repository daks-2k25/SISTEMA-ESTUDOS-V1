import { evaluation, lesson } from "./helpers";
import type { DayContext, SeedDay } from "./types";

const CONTEXT: DayContext = {
  sectionTitle: "Seção 7 — Prisma e schema.prisma",
  moduleTitle: "Prisma ORM",
};

export const secao07Prisma: SeedDay[] = [
  lesson(
    CONTEXT,
    "Primeiro schema e migrate",
    "Um ORM mapeia tabelas para objetos tipados. O Prisma tem o schema.prisma (fonte da verdade), o Prisma Migrate (versiona o banco) e o Prisma Client (cliente gerado e tipado). Declare um model com campos, @id, @default e @unique, rode prisma migrate dev --name init para criar a tabela e prisma generate para atualizar o client. Use uma versão estável do Prisma com SQLite no começo.",
    [
      "O Prisma tem schema, Migrate e Client gerado e tipado.",
      "@id, @default e @unique definem chave, padrão e unicidade.",
      "migrate dev cria e aplica migrações em desenvolvimento.",
    ],
    [
      "Instalar o Prisma estável e configurar o SQLite",
      "Criar o model Tarefa e rodar migrate dev --name init",
      "Abrir o SQL gerado na pasta migrations",
    ],
    [
      "Quais são as três partes principais do Prisma?",
      "Prisma Schema (modelagem), Prisma Migrate (migrações versionadas) e Prisma Client (cliente de consultas gerado e tipado).",
    ],
    [
      "Gerar identificador",
      "Escreva gerarId(prefixo, contador) que retorna o prefixo, um hífen e o contador com 4 dígitos. gerarId('dia', 7) retorna 'dia-0007'.",
      "padStart(4, '0') preenche com zeros.",
      "function gerarId(prefixo, contador) {\n  return prefixo + \"-\" + String(contador).padStart(4, \"0\");\n}\n",
      "function gerarId(prefixo, contador) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Tipos, atributos e relações",
    "O Prisma suporta String, Int, Float, Boolean, DateTime, Json e outros, com atributos como @updatedAt, @@index e @@unique. No SQLite, listas e objetos ficam como String JSON, convertidas no repositório. Relações 1:N guardam a chave estrangeira no lado muitos com @relation(fields, references) e onDelete; relações N:N podem ser implícitas ou explícitas, com um model intermediário quando a junção tem campos próprios.",
    [
      "@updatedAt, @@index e @@unique complementam os campos.",
      "A chave estrangeira fica no lado 'muitos' da relação 1:N.",
      "Use relação N:N explícita quando a junção tem campos extras.",
    ],
    [
      "Modelar Usuario com várias Tarefas e onDelete: Cascade",
      "Criar uma relação N:N entre Tarefa e Etiqueta",
      "Converter um campo de lista para String JSON com parse e serialize",
    ],
    [
      "O que faz onDelete: Cascade em uma relação?",
      "Ao excluir o registro pai, todos os filhos relacionados são excluídos automaticamente pelo banco.",
    ],
    [
      "Agrupar filhos por pai",
      "Escreva agruparPorPai(filhos) que recebe objetos com paiId e retorna um Map de paiId para o array de seus filhos.",
      "Use um Map e crie o array do grupo se ainda não existir.",
      "function agruparPorPai(filhos) {\n  const grupos = new Map();\n  for (const filho of filhos) {\n    const lista = grupos.get(filho.paiId) ?? [];\n    lista.push(filho);\n    grupos.set(filho.paiId, lista);\n  }\n  return grupos;\n}\n",
      "function agruparPorPai(filhos) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "CRUD com Prisma Client",
    "O Prisma Client expõe um delegate por model. Crie com create e createMany, leia com findUnique (campo único), findFirst, findMany e count, atualize com update e upsert e remova com delete. Filtre com where (equals, contains, in, gte...), ordene com orderBy e pagine com skip e take. Mantenha uma única instância do client (singleton) para não esgotar conexões.",
    [
      "create, findUnique, findMany, update e delete cobrem o CRUD.",
      "where, orderBy, skip e take filtram, ordenam e paginam.",
      "Use uma única instância do PrismaClient.",
    ],
    [
      "Criar, listar, atualizar e remover tarefas com o Prisma Client",
      "Usar upsert para criar ou atualizar por campo único",
      "Implementar o singleton do client em src/lib/prisma.ts",
    ],
    [
      "Por que usar um singleton do PrismaClient?",
      "Cada instância abre um pool de conexões. Com hot reload, várias instâncias esgotariam as conexões; uma instância global evita isso.",
    ],
    [
      "Calcular skip e take",
      "Escreva calcularPaginacao(pagina, limite) que retorna { skip, take }, garantindo pagina mínima 1 e limite entre 1 e 100.",
      "Math.max e Math.min limitam os valores.",
      "function calcularPaginacao(pagina, limite) {\n  const paginaSegura = Math.max(1, pagina);\n  const take = Math.min(100, Math.max(1, limite));\n  return { skip: (paginaSegura - 1) * take, take };\n}\n",
      "function calcularPaginacao(pagina, limite) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "include, select e o problema N+1",
    "include carrega relações junto com o registro e select escolhe exatamente os campos retornados; não use os dois no mesmo nível. O problema N+1 ocorre quando uma consulta lista N itens e depois faz uma consulta por item. Resolva com include/select ou com where in, e ative o log de queries para detectar o padrão.",
    [
      "include traz relações; select escolhe campos.",
      "N+1 é uma consulta inicial mais uma por item da lista.",
      "include, select ou where in resolvem o N+1.",
    ],
    [
      "Reproduzir um N+1 buscando tarefas em um laço for",
      "Corrigir com include e comparar o número de queries",
      "Usar select para não devolver campos sensíveis",
    ],
    [
      "Como corrigir um N+1 ao listar tarefas com seus usuários?",
      "Carregando os usuários na mesma consulta com include/select, ou buscando todos os ids de uma vez com where in e juntando em memória.",
    ],
    [
      "Indexar por id",
      "Escreva indexarPorId(lista) que retorna um Map de id para item, permitindo junções em memória sem laços aninhados.",
      "Percorra a lista preenchendo o Map.",
      "function indexarPorId(lista) {\n  const indice = new Map();\n  for (const item of lista) indice.set(item.id, item);\n  return indice;\n}\n",
      "function indexarPorId(lista) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Migrations, seed e transações",
    "Migrações são scripts SQL versionados: use migrate dev em desenvolvimento e migrate deploy em produção, e nunca edite uma migração já aplicada. O seed popula dados iniciais e deve ser idempotente, usando upsert. Transações agrupam operações para que todas tenham sucesso ou todas sejam desfeitas, com prisma.$transaction em lote ou interativa; erros dentro do callback causam rollback.",
    [
      "migrate dev cria migrações; migrate deploy só aplica as pendentes.",
      "Seeds idempotentes usam upsert ou checam existência.",
      "$transaction garante tudo ou nada.",
    ],
    [
      "Criar uma segunda migração adicionando um campo",
      "Escrever um seed idempotente e rodá-lo duas vezes",
      "Forçar um erro no meio de uma transação e confirmar o rollback",
    ],
    [
      "O que torna um seed idempotente?",
      "Poder rodar várias vezes com o mesmo resultado final, usando upsert ou checando se o registro já existe antes de criar.",
    ],
    [
      "Novos registros apenas",
      "Escreva novosRegistros(existentes, candidatos, chave) que retorna os candidatos cuja propriedade chave ainda não aparece em existentes.",
      "Crie um Set com os valores de chave dos existentes.",
      "function novosRegistros(existentes, candidatos, chave) {\n  const conhecidos = new Set(existentes.map((item) => item[chave]));\n  return candidatos.filter((item) => !conhecidos.has(item[chave]));\n}\n",
      "function novosRegistros(existentes, candidatos, chave) {\n  \n}\n",
    ],
  ),
  evaluation(
    CONTEXT,
    "Avaliação da Seção 7: Prisma",
    "Avaliação da seção cobrindo schema e migrate, tipos e relações, CRUD com Prisma Client, include, select, N+1, migrations, seed e transações. Meta: nota 85; mínimo 70 para avançar para o NestJS.",
    [
      "A avaliação cobre as Aulas 61 a 65.",
      "Meta de nota 85; mínimo 70.",
      "Refaça os tópicos fracos antes de ir para o NestJS.",
    ],
    [
      "Qual comando do Prisma aplica migrações em produção?",
      "prisma migrate deploy, que aplica apenas as migrações pendentes sem criar novas nem resetar o banco.",
    ],
  ),
];
