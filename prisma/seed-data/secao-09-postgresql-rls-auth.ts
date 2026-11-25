import { evaluation, lesson, review } from "./helpers";
import type { DayContext, SeedDay } from "./types";

const CONTEXT: DayContext = {
  sectionTitle: "Seção 9 — PostgreSQL, RLS e autenticação",
  moduleTitle: "PostgreSQL, RLS e autenticação",
};

export const secao09PostgresqlRlsAuth: SeedDay[] = [
  lesson(
    CONTEXT,
    "Modelagem relacional e SQL essencial",
    "Um banco relacional organiza dados em tabelas ligadas por chaves primárias e estrangeiras. Modele entidades, relações 1:N e N:N e normalize para evitar duplicação. No SQL, SELECT, WHERE, ORDER BY e LIMIT consultam, JOIN combina tabelas e GROUP BY com agregações (COUNT, SUM, AVG) resume dados; HAVING filtra grupos e WHERE filtra linhas antes do agrupamento.",
    [
      "Tabelas se ligam por chaves primárias e estrangeiras.",
      "INNER JOIN mantém correspondências; LEFT JOIN mantém toda a esquerda.",
      "WHERE filtra linhas; HAVING filtra grupos.",
    ],
    [
      "Instalar o PostgreSQL (ou subir com Docker) e conectar com psql",
      "Desenhar o diagrama das tabelas do sistema de estudos",
      "Escrever consultas com JOIN e GROUP BY sobre dados de exemplo",
    ],
    [
      "Qual a diferença entre WHERE e HAVING?",
      "WHERE filtra linhas antes do agrupamento; HAVING filtra grupos já agregados, podendo usar funções como COUNT e SUM.",
    ],
    [
      "Simular INNER JOIN",
      "Escreva innerJoin(esquerda, direita, chaveEsquerda, chaveDireita) que retorna os objetos mesclados de cada par com chaves iguais, como um INNER JOIN.",
      "Para cada linha da esquerda, filtre as da direita com chave igual e mescle com spread.",
      "function innerJoin(esquerda, direita, chaveEsquerda, chaveDireita) {\n  return esquerda.flatMap((linhaEsquerda) =>\n    direita\n      .filter((linhaDireita) => linhaDireita[chaveDireita] === linhaEsquerda[chaveEsquerda])\n      .map((linhaDireita) => ({ ...linhaEsquerda, ...linhaDireita })),\n  );\n}\n",
      "function innerJoin(esquerda, direita, chaveEsquerda, chaveDireita) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "UUID, tipos do PostgreSQL e constraints",
    "No PostgreSQL, UUIDs são identificadores globais difíceis de adivinhar, ótimos como chave primária exposta em URLs (gen_random_uuid()). Aproveite os tipos ricos (timestamptz, jsonb, text, enums) e as constraints (NOT NULL, UNIQUE, CHECK, FOREIGN KEY) para garantir integridade no próprio banco, sem depender só da aplicação.",
    [
      "UUID evita ids sequenciais previsíveis.",
      "timestamptz e jsonb são tipos recomendados para datas e JSON.",
      "Constraints garantem integridade no próprio banco.",
    ],
    [
      "Criar uma tabela com id uuid default gen_random_uuid()",
      "Adicionar CHECK e UNIQUE em colunas do modelo",
      "Comparar jsonb com texto JSON em uma coluna de checklist",
    ],
    [
      "Por que preferir UUID a ids sequenciais em URLs públicas?",
      "Ids sequenciais são previsíveis e permitem enumerar recursos; UUIDs aleatórios dificultam esse tipo de ataque (embora não substituam autorização).",
    ],
    [
      "Validar UUID",
      "Escreva ehUuid(texto) que retorna true se o texto estiver no formato 8-4-4-4-12 de caracteres hexadecimais.",
      "Use uma regex com grupos hexadecimais.",
      "function ehUuid(texto) {\n  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(texto);\n}\n",
      "function ehUuid(texto) {\n  \n}\n",
    ],
    ),
  lesson(
    CONTEXT,
    "Row Level Security: conceitos",
    "Row Level Security (RLS) permite definir, no próprio PostgreSQL, quais linhas cada usuário pode ver ou alterar. Habilite com ALTER TABLE ... ENABLE ROW LEVEL SECURITY e crie políticas (CREATE POLICY) com USING (quais linhas são visíveis) e WITH CHECK (quais valores podem ser gravados). Sem política, ninguém (exceto superusuário e dono) acessa a tabela.",
    [
      "RLS aplica regras de acesso por linha dentro do banco.",
      "USING filtra o que se vê; WITH CHECK valida o que se grava.",
      "Superusuários e donos ignoram o RLS sem FORCE.",
    ],
    [
      "Habilitar RLS em uma tabela de tarefas",
      "Criar uma política que só mostra as linhas do próprio usuário",
      "Testar a política com dois papéis diferentes",
    ],
    [
      "Qual a diferença entre USING e WITH CHECK em uma policy?",
      "USING define quais linhas existentes são visíveis ou alteráveis; WITH CHECK define quais valores são aceitos ao inserir ou atualizar.",
    ],
    [
      "Filtro por dono",
      "Escreva linhasVisiveis(linhas, usuarioId) que retorna apenas as linhas cujo donoId é igual a usuarioId, como faria uma policy USING.",
      "Um filter simples.",
      "function linhasVisiveis(linhas, usuarioId) {\n  return linhas.filter((linha) => linha.donoId === usuarioId);\n}\n",
      "function linhasVisiveis(linhas, usuarioId) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "RLS na prática: políticas por papel",
    "Na prática, políticas combinam o usuário atual (por exemplo uma configuração de sessão como app.user_id lida com current_setting) com regras por operação: SELECT, INSERT, UPDATE e DELETE podem ter políticas diferentes. Políticas para papéis administrativos permitem acesso amplo, e a performance depende de índices nas colunas usadas na condição. Teste sempre com um usuário não proprietário.",
    [
      "Políticas podem ser diferentes por operação e por papel.",
      "Índices nas colunas da política evitam consultas lentas.",
      "Teste com um usuário que não seja dono da tabela.",
    ],
    [
      "Criar políticas separadas para SELECT e INSERT",
      "Usar current_setting('app.user_id') para identificar o usuário",
      "Criar um índice na coluna usada pela política e rodar EXPLAIN",
    ],
    [
      "Por que testar RLS com um usuário não proprietário?",
      "Porque o dono da tabela e superusuários ignoram o RLS por padrão, o que esconderia falhas nas políticas.",
    ],
    [
      "Permissão por operação",
      "Escreva podeExecutar(politicas, papel, operacao) que retorna true se politicas[papel] incluir a operação informada (por exemplo 'SELECT').",
      "Use optional chaining com includes.",
      "function podeExecutar(politicas, papel, operacao) {\n  return politicas[papel]?.includes(operacao) ?? false;\n}\n",
      "function podeExecutar(politicas, papel, operacao) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Integração NestJS + PostgreSQL",
    "Para integrar o Nest ao PostgreSQL, troque o provider do Prisma para postgresql, ajuste a DATABASE_URL e rode as migrações. Suba o banco com Docker Compose para o ambiente ser reproduzível e use variáveis de ambiente validadas. Em produção, aplique migrações com migrate deploy e use um usuário do banco com o menor privilégio possível, diferente do dono das tabelas quando houver RLS.",
    [
      "Troque o provider do Prisma e a DATABASE_URL para PostgreSQL.",
      "Docker Compose torna o banco reproduzível.",
      "Use um usuário de aplicação com o menor privilégio.",
    ],
    [
      "Subir o PostgreSQL com Docker Compose",
      "Apontar o Nest para o novo banco e rodar as migrações",
      "Criar um usuário de aplicação sem privilégios de dono",
    ],
    [
      "Por que a aplicação não deve conectar como superusuário?",
      "Porque superusuários ignoram o RLS e têm poder irrestrito; o princípio do menor privilégio limita os danos de uma falha.",
    ],
    [
      "Montar URL de conexão",
      "Escreva urlDoPostgres({ usuario, senha, host, porta, banco }) que retorna 'postgresql://usuario:senha@host:porta/banco' com usuário e senha codificados com encodeURIComponent.",
      "Aplique encodeURIComponent apenas em usuário e senha.",
      "function urlDoPostgres({ usuario, senha, host, porta, banco }) {\n  const credenciais = encodeURIComponent(usuario) + \":\" + encodeURIComponent(senha);\n  return \"postgresql://\" + credenciais + \"@\" + host + \":\" + porta + \"/\" + banco;\n}\n",
      "function urlDoPostgres(config) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Senhas, hash e cadastro de usuários",
    "Autenticação responde 'quem é você?' e autorização responde 'o que você pode fazer?'. Senhas nunca são guardadas em texto puro: use um hash lento e com salt, como bcrypt ou argon2. No cadastro valide o e-mail, rejeite duplicados com 409 e guarde apenas o hash. No login devolva a mesma mensagem para e-mail inexistente e senha errada, evitando enumeração de usuários.",
    [
      "Guarde só o hash da senha, com bcrypt ou argon2.",
      "Rejeite e-mails duplicados com 409.",
      "Use mensagens de login genéricas.",
    ],
    [
      "Gerar e comparar um hash de senha com bcrypt",
      "Implementar o cadastro guardando apenas o hash",
      "Padronizar a mensagem de erro de login",
    ],
    [
      "Por que usar bcrypt em vez de SHA-256 para senhas?",
      "Bcrypt é deliberadamente lento e inclui salt, dificultando força bruta e rainbow tables; SHA-256 é rápido e feito para integridade, não para senhas.",
    ],
    [
      "Validar força da senha",
      "Escreva senhaForte(senha) que retorna true se tiver ao menos 8 caracteres, uma maiúscula, uma minúscula e um número.",
      "Regex para cada requisito.",
      "function senhaForte(senha) {\n  return senha.length >= 8 && /[A-Z]/.test(senha) && /[a-z]/.test(senha) && /[0-9]/.test(senha);\n}\n",
      "function senhaForte(senha) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Login e JWT",
    "Um JWT tem três partes em Base64URL (header, payload e assinatura). A assinatura garante integridade, mas o payload não é criptografado: nunca coloque segredos nele. Emita um access token de vida curta e, se necessário, um refresh token; guarde-os em cookies HttpOnly, Secure e SameSite em vez de localStorage. Valide assinatura e expiração a cada requisição.",
    [
      "JWT = header.payload.assinatura; o payload é legível.",
      "Access tokens vivem pouco; refresh tokens renovam o acesso.",
      "Cookies HttpOnly protegem contra roubo por XSS.",
    ],
    [
      "Emitir um token JWT no login com a chave secreta do .env",
      "Enviar o token em cookie HttpOnly",
      "Alterar um caractere do payload e ver a verificação falhar",
    ],
    [
      "O payload de um JWT é criptografado?",
      "Não. É apenas codificado em Base64URL e pode ser lido por qualquer pessoa; a assinatura só impede alterações sem detecção.",
    ],
    [
      "Ler payload",
      "Escreva lerPayload(token) que retorna o objeto do payload (segunda parte) decodificado de Base64URL, ou null se o token não tiver três partes.",
      "Divida por '.', valide 3 partes e use Buffer.from(parte, 'base64url').",
      "function lerPayload(token) {\n  const partes = token.split(\".\");\n  if (partes.length !== 3) return null;\n  return JSON.parse(Buffer.from(partes[1], \"base64url\").toString(\"utf8\"));\n}\n",
      "function lerPayload(token) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "JWT ligado ao RLS",
    "Para unir autenticação e RLS, o guard do Nest valida o JWT e extrai o id do usuário; a cada requisição, dentro de uma transação, a aplicação define a configuração de sessão (por exemplo set_config('app.user_id', id, true)) antes das consultas. As políticas RLS leem esse valor com current_setting e filtram as linhas automaticamente, de modo que mesmo um bug na aplicação não vaze dados de outro usuário.",
    [
      "O guard valida o JWT e extrai o id do usuário.",
      "A aplicação define app.user_id na sessão do banco por transação.",
      "As políticas RLS filtram as linhas pelo usuário da sessão.",
    ],
    [
      "Criar um guard que valida o JWT e popula o usuário na requisição",
      "Definir app.user_id dentro de uma transação antes das consultas",
      "Provar que um usuário não enxerga as tarefas de outro",
    ],
    [
      "Qual a vantagem de combinar JWT e RLS?",
      "A autorização passa a ser aplicada também no banco: mesmo que a aplicação esqueça um filtro, o RLS impede o acesso a linhas de outros usuários.",
    ],
    [
      "Token expirado",
      "Escreva tokenExpirou(exp, agoraEmSegundos) que retorna true se exp (segundos desde 1970) for menor ou igual ao instante atual.",
      "Compare exp <= agoraEmSegundos.",
      "function tokenExpirou(exp, agoraEmSegundos) {\n  return exp <= agoraEmSegundos;\n}\n",
      "function tokenExpirou(exp, agoraEmSegundos) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Migrar o schema Prisma para PostgreSQL",
    "Para migrar do SQLite para o PostgreSQL, troque o provider no schema, revise os tipos (campos de lista e JSON podem virar Json nativo ou continuar como String), crie uma nova migração baseline e migre os dados existentes com um script de exportação e importação. Valide contagens e integridade antes de desligar o banco antigo e mantenha um plano de rollback.",
    [
      "Troque o provider e revise tipos e atributos do schema.",
      "Migre os dados com script e valide as contagens.",
      "Mantenha um plano de rollback antes de desligar o banco antigo.",
    ],
    [
      "Alterar o provider para postgresql e gerar a migração",
      "Exportar os dados do SQLite e importar no PostgreSQL",
      "Conferir as contagens de dias, flashcards e desafios nos dois bancos",
    ],
    [
      "O que validar depois de migrar os dados?",
      "Contagens por tabela, integridade das chaves estrangeiras, amostras de registros e o funcionamento das consultas principais.",
    ],
    [
      "Comparar contagens entre bancos",
      "Escreva compararContagens(origem, destino) que recebe objetos como { dias: 120 } e retorna as chaves cujos valores diferem entre os dois objetos.",
      "Filtre as chaves de origem comparando com destino.",
      "function compararContagens(origem, destino) {\n  return Object.keys(origem).filter((chave) => origem[chave] !== destino[chave]);\n}\n",
      "function compararContagens(origem, destino) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Autorização por papel e rotas protegidas",
    "A autorização define o que cada usuário pode fazer. Com RBAC, um guard verifica o papel do usuário (aluno, admin) antes do handler: sem token válido a resposta é 401 e sem o papel exigido é 403. Valide também a propriedade do recurso para evitar IDOR (acessar dados de outro usuário trocando o id na URL) e registre tentativas negadas.",
    [
      "401 é não autenticado; 403 é sem permissão.",
      "RBAC usa papéis; valide também a propriedade do recurso.",
      "IDOR é acessar recursos de outros usuários trocando o id.",
    ],
    [
      "Criar o decorator @Roles e um RolesGuard",
      "Restringir uma rota ao papel admin",
      "Impedir que um usuário acesse a tarefa de outro",
    ],
    [
      "O que é IDOR e como evitá-lo?",
      "Referência direta insegura a objetos: acessar recursos de outros usuários trocando um id. Evita-se verificando no servidor se o recurso pertence ao usuário autenticado (e com RLS).",
    ],
    [
      "Verificar papel",
      "Escreva temPermissao(papeisDoUsuario, exigidos) que retorna true se exigidos estiver vazio ou se o usuário tiver ao menos um dos papéis exigidos.",
      "some sobre exigidos com includes.",
      "function temPermissao(papeisDoUsuario, exigidos) {\n  if (exigidos.length === 0) return true;\n  return exigidos.some((papel) => papeisDoUsuario.includes(papel));\n}\n",
      "function temPermissao(papeisDoUsuario, exigidos) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Marco: sistema completo",
    "Marco do curso: o sistema de estudos completo, com front-end em Next.js, API em NestJS, PostgreSQL com RLS e autenticação JWT, integrando tudo de ponta a ponta. Confira o fluxo cadastro, login, dashboard, flashcards com SM-2, desafios e calendário, escreva testes dos fluxos críticos e documente a arquitetura. Este é o projeto que você apresentará em entrevistas.",
    [
      "Integre front-end, API, banco, autenticação e RLS de ponta a ponta.",
      "Teste os fluxos críticos e documente a arquitetura.",
      "Esse projeto é o centro do seu portfólio técnico.",
    ],
    [
      "Rodar o fluxo completo: cadastro, login, dashboard e flashcards",
      "Escrever testes dos fluxos críticos",
      "Documentar a arquitetura em um diagrama simples no README",
    ],
    [
      "O que apresentar de um projeto completo em uma entrevista?",
      "O problema resolvido, a arquitetura e suas decisões (camadas, autenticação, RLS), os desafios enfrentados e como você testou e publicou.",
    ],
    [
      "Resumo do progresso",
      "Escreva resumoDoCurso(dias) que recebe objetos { concluido } e retorna { total, concluidos, porcentagem } com a porcentagem arredondada para inteiro.",
      "Conte os concluídos e trate a lista vazia.",
      "function resumoDoCurso(dias) {\n  const concluidos = dias.filter((dia) => dia.concluido).length;\n  const porcentagem = dias.length === 0 ? 0 : Math.round((concluidos / dias.length) * 100);\n  return { total: dias.length, concluidos, porcentagem };\n}\n",
      "function resumoDoCurso(dias) {\n  \n}\n",
    ],
  ),
  evaluation(
    CONTEXT,
    "Avaliação da Seção 9: PostgreSQL, RLS e autenticação",
    "Avaliação da seção cobrindo modelagem, SQL, UUID, RLS, integração do Nest com PostgreSQL, hash de senhas, JWT, JWT ligado ao RLS, migração do schema e o sistema completo. Meta: nota 85; mínimo 70 para avançar para a trilha de lacunas.",
    [
      "A avaliação cobre as Aulas 73 a 83.",
      "Meta de nota 85; mínimo 70.",
      "Refaça os tópicos fracos antes de ir para a trilha de lacunas.",
    ],
    [
      "Como o RLS complementa a autorização da aplicação?",
      "Aplica a regra de acesso no próprio banco, evitando vazamentos mesmo se a aplicação esquecer um filtro.",
    ],
  ),
  review(
    CONTEXT,
    "Revisão da Seção 9",
    "Revise a seção explicando o caminho de uma requisição autenticada: cookie com JWT, guard, definição do usuário na sessão do banco, política RLS e consulta. Refaça uma política RLS do zero, revise os flashcards vencidos e liste os pontos de segurança que você ainda não consegue justificar, para reforçá-los na trilha de lacunas.",
    [
      "Saiba explicar o caminho completo de uma requisição autenticada.",
      "Refaça uma política RLS do zero, sem consultar.",
      "Liste os pontos de segurança que ainda não domina.",
    ],
    [
      "Desenhar o caminho de uma requisição autenticada até o banco",
      "Revisar os flashcards vencidos da Seção 9",
      "Anotar três lacunas para a trilha de lacunas",
    ],
    [
      "Qual a ordem do ciclo de uma requisição no Nest?",
      "Middleware, guards, interceptors, pipes, handler do controller, interceptors de saída e filtros de exceção em caso de erro.",
    ],
    [
      "Ordenar etapas",
      "Escreva ordenarEtapas(etapas) que recebe nomes como 'pipe', 'guard', 'handler', 'middleware', 'interceptor' e os devolve na ordem do ciclo: middleware, guard, interceptor, pipe, handler (ignorando desconhecidos).",
      "Filtre a ordem oficial pelas etapas recebidas.",
      "function ordenarEtapas(etapas) {\n  const ordem = [\"middleware\", \"guard\", \"interceptor\", \"pipe\", \"handler\"];\n  return ordem.filter((etapa) => etapas.includes(etapa));\n}\n",
      "function ordenarEtapas(etapas) {\n  \n}\n",
    ],
  ),
];
