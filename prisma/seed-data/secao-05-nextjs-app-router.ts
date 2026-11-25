import { evaluation, lesson, project } from "./helpers";
import type { DayContext, SeedDay } from "./types";

const CONTEXT: DayContext = {
  sectionTitle: "Seção 5 — Next.js App Router",
  moduleTitle: "Next.js App Router",
};

export const secao05NextjsAppRouter: SeedDay[] = [
  lesson(
    CONTEXT,
    "Rotas e layouts",
    "No App Router, as pastas dentro de src/app definem as rotas: cada pasta é um segmento de URL e o arquivo page.tsx a torna pública. layout.tsx envolve as páginas filhas e persiste entre navegações, e layouts se aninham de fora para dentro. Route groups, como (marketing), organizam o código sem alterar a URL, e o componente Link faz navegação no cliente com prefetch.",
    [
      "Pastas em app definem segmentos de URL; page.tsx torna a rota pública.",
      "layout.tsx envolve as páginas filhas e se aninha.",
      "Route groups (nome) não aparecem na URL.",
    ],
    [
      "Criar as rotas /, /sobre e /projetos com page.tsx",
      "Criar um layout raiz com cabeçalho e rodapé",
      "Navegar entre as páginas usando o componente Link",
    ],
    [
      "O que o arquivo layout.tsx faz no App Router?",
      "Envolve as páginas e layouts filhos e mantém seu estado entre navegações, sem ser remontado.",
    ],
    [
      "Caminho de arquivo para URL",
      "Escreva caminhoParaUrl(caminho) que converte 'app/blog/page.tsx' em '/blog' e 'app/page.tsx' em '/'.",
      "Remova o prefixo 'app' e o final '/page.tsx'.",
      "function caminhoParaUrl(caminho) {\n  const url = caminho.replace(/^app/, \"\").replace(/\\/page\\.tsx$/, \"\");\n  return url === \"\" ? \"/\" : url;\n}\n",
      "function caminhoParaUrl(caminho) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Server Components e Client Components",
    "Server Components rodam apenas no servidor, acessam banco e segredos diretamente e não enviam JavaScript ao navegador. Client Components, marcados com a diretiva 'use client', permitem estado, efeitos e eventos. A regra é manter o máximo no servidor e empurrar 'use client' para as folhas da árvore, passando dados serializáveis por props.",
    [
      "Server Components acessam dados e segredos sem enviar JavaScript ao cliente.",
      "'use client' é necessário para estado, efeitos e eventos.",
      "Empurre os Client Components para as folhas da árvore.",
    ],
    [
      "Identificar quais componentes do painel precisam de 'use client'",
      "Extrair um botão interativo para um Client Component pequeno",
      "Passar dados de um Server Component a um Client Component via props",
    ],
    [
      "Quando é obrigatório usar 'use client'?",
      "Quando o componente usa hooks de estado ou efeito, handlers de eventos ou APIs do navegador.",
    ],
    [
      "Decidir tipo de componente",
      "Escreva tipoDeComponente({ usaEstado, usaEventos, usaApiDoNavegador }) que retorna 'client' se qualquer propriedade for true e 'server' caso contrário.",
      "Use some sobre Object.values.",
      "function tipoDeComponente(recursos) {\n  return Object.values(recursos).some(Boolean) ? \"client\" : \"server\";\n}\n",
      "function tipoDeComponente(recursos) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Busca de dados no servidor",
    "Em Server Components a busca de dados é feita com async/await diretamente no componente, sem useEffect nem estado de loading. Rotas dinâmicas usam pastas como [id] e params (uma Promise nas versões atuais, aguardada com await). Execute buscas independentes com Promise.all para evitar waterfalls e use Suspense para liberar a página em partes.",
    [
      "Componentes de servidor podem ser async e buscar dados direto.",
      "params e searchParams são Promises nas versões atuais.",
      "Promise.all evita waterfalls; Suspense libera a página em partes.",
    ],
    [
      "Buscar a lista de dias no servidor e renderizar sem useEffect",
      "Criar a rota dinâmica /dias/[numero] lendo params com await",
      "Envolver um componente lento em Suspense com fallback",
    ],
    [
      "O que é um request waterfall e como evitá-lo?",
      "Buscas independentes executadas em sequência somam seus tempos. Evita-se com Promise.all ou componentes separados com Suspense.",
    ],
    [
      "Ler número do dia",
      "Escreva lerNumeroDoDia(texto) que converte o parâmetro de rota em inteiro e retorna null se não for um inteiro de 1 a 120.",
      "Number e Number.isInteger antes de checar o intervalo.",
      "function lerNumeroDoDia(texto) {\n  const numero = Number(texto);\n  if (!Number.isInteger(numero)) return null;\n  return numero >= 1 && numero <= 120 ? numero : null;\n}\n",
      "function lerNumeroDoDia(texto) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Server Actions",
    "Server Actions são funções assíncronas marcadas com 'use server' que executam no servidor e podem ser ligadas a formulários, sem criar rotas de API. Servem para mutações: recebem FormData ou argumentos serializáveis, validam, chamam um use-case e revalidam o cache com revalidatePath. Trate-as como endpoints públicos, validando a entrada e conferindo autorização.",
    [
      "'use server' marca funções que rodam no servidor.",
      "Server Actions são endpoints públicos: valide e autorize.",
      "Chame use-cases e revalide o cache ao final.",
    ],
    [
      "Criar uma Server Action que cria uma tarefa a partir de FormData",
      "Ligar a action ao atributo action de um formulário",
      "Chamar revalidatePath ao fim da action",
    ],
    [
      "Server Actions precisam de validação mesmo vindo do meu formulário?",
      "Sim. São endpoints HTTP acessíveis por qualquer cliente, então a entrada deve ser validada e a autorização conferida no servidor.",
    ],
    [
      "Ler campos do FormData",
      "Escreva lerCampos(dados, nomes) que recebe um objeto com get(nome) e um array de nomes e retorna um objeto com os valores correspondentes.",
      "Object.fromEntries com map sobre os nomes.",
      "function lerCampos(dados, nomes) {\n  return Object.fromEntries(nomes.map((nome) => [nome, dados.get(nome)]));\n}\n",
      "function lerCampos(dados, nomes) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Route Handlers",
    "Route Handlers criam endpoints HTTP no App Router com arquivos route.ts que exportam funções nomeadas pelo método (GET, POST, PATCH, DELETE) usando Request e Response da web. Servem para webhooks, integrações e clientes que não usam React; para mutações da própria interface, prefira Server Actions. Valide a entrada e devolva os status corretos.",
    [
      "route.ts exporta funções nomeadas por método HTTP.",
      "Use Request e Response padrão da web.",
      "Prefira Server Actions para mutações da própria interface.",
    ],
    [
      "Criar GET /api/saude retornando { ok: true }",
      "Criar POST /api/tarefas que valida o corpo",
      "Devolver 400 para corpo inválido e 201 em caso de criação",
    ],
    [
      "Quando usar Route Handler em vez de Server Action?",
      "Para expor uma API HTTP a clientes externos, webhooks ou integrações; mutações disparadas pela própria interface ficam mais simples com Server Actions.",
    ],
    [
      "Montar resposta JSON",
      "Escreva respostaJson(corpo, status = 200) que retorna { status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) }.",
      "Um objeto simples com três campos.",
      "function respostaJson(corpo, status = 200) {\n  return {\n    status,\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify(corpo),\n  };\n}\n",
      "function respostaJson(corpo, status = 200) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Formulários e validação com Zod",
    "Zod define schemas que validam dados em runtime e inferem tipos TypeScript, eliminando duplicação entre tipo e validação. Em Server Actions use safeParse para obter sucesso ou erro sem exceções e devolva os erros por campo. Combine com useActionState para exibir mensagens no formulário e com useFormStatus para desabilitar o botão durante o envio.",
    [
      "Schemas Zod validam em runtime e geram tipos com z.infer.",
      "safeParse não lança exceções.",
      "useActionState e useFormStatus melhoram a experiência do formulário.",
    ],
    [
      "Criar um schema Zod para criar tarefa e validar na action",
      "Exibir mensagens de erro por campo com useActionState",
      "Desabilitar o botão com useFormStatus durante o envio",
    ],
    [
      "Qual a vantagem de z.infer?",
      "Gera o tipo TypeScript a partir do schema, mantendo tipo e validação sincronizados sem duplicação.",
    ],
    [
      "Validar tarefa",
      "Escreva validarTarefa({ titulo, minutos }) que retorna { sucesso: true } se titulo tem pelo menos 3 caracteres e minutos é inteiro de 1 a 600; senão { sucesso: false, erros } com as mensagens.",
      "Acumule mensagens em um array.",
      "function validarTarefa({ titulo, minutos }) {\n  const erros = [];\n  if (typeof titulo !== \"string\" || titulo.trim().length < 3) erros.push(\"Título curto demais\");\n  if (!Number.isInteger(minutos) || minutos < 1 || minutos > 600) erros.push(\"Minutos inválidos\");\n  return erros.length === 0 ? { sucesso: true } : { sucesso: false, erros };\n}\n",
      "function validarTarefa(dados) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "loading, error e not-found",
    "Arquivos especiais tratam estados da interface: loading.tsx exibe um fallback enquanto a rota carrega, error.tsx captura erros de renderização (precisa ser Client Component e recebe a função reset) e not-found.tsx cobre notFound() e rotas inexistentes. Eles valem para o segmento e seus filhos, permitindo experiências específicas por área do app.",
    [
      "loading.tsx mostra um fallback automático.",
      "error.tsx captura erros e deve ser um Client Component.",
      "not-found.tsx trata recursos inexistentes.",
    ],
    [
      "Criar um loading.tsx com esqueleto visual",
      "Criar um error.tsx com botão para tentar novamente",
      "Personalizar o not-found.tsx do projeto em português",
    ],
    [
      "Por que error.tsx precisa de 'use client'?",
      "Porque recebe a função reset e depende de interação do cliente para tentar renderizar de novo.",
    ],
    [
      "Mensagem de erro amigável",
      "Escreva mensagemAmigavel(status) que retorna 'Página não encontrada' para 404, 'Sem permissão' para 403 e 'Algo deu errado' nos demais casos.",
      "Um objeto de mensagens com fallback.",
      "function mensagemAmigavel(status) {\n  const mensagens = { 404: \"Página não encontrada\", 403: \"Sem permissão\" };\n  return mensagens[status] ?? \"Algo deu errado\";\n}\n",
      "function mensagemAmigavel(status) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Deploy do Next.js",
    "O build de produção (npm run build) gera a aplicação otimizada e npm run start a executa. Plataformas como a Vercel publicam a partir do GitHub com HTTPS e variáveis de ambiente configuradas no painel. Confira no resultado do build o que é estático e dinâmico, configure as variáveis de produção e nunca versione o arquivo .env.",
    [
      "npm run build gera a versão de produção; npm run start a executa.",
      "Variáveis de ambiente de produção são configuradas na plataforma.",
      "Nunca versione o arquivo .env.",
    ],
    [
      "Rodar o build local e ler a saída de rotas estáticas e dinâmicas",
      "Conectar o repositório a uma plataforma de deploy",
      "Configurar as variáveis de ambiente e testar a URL publicada",
    ],
    [
      "Onde configurar segredos em produção?",
      "Nas variáveis de ambiente da plataforma de deploy, nunca no código nem no repositório.",
    ],
    [
      "Variáveis faltando",
      "Escreva variaveisFaltando(env, obrigatorias) que retorna o array das variáveis obrigatórias ausentes ou vazias em env.",
      "filter sobre as obrigatórias.",
      "function variaveisFaltando(env, obrigatorias) {\n  return obrigatorias.filter((nome) => !env[nome]);\n}\n",
      "function variaveisFaltando(env, obrigatorias) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Portfólio v2 publicado",
    "Refaça o portfólio em Next.js com App Router: páginas de apresentação e projetos, metadata para SEO, layout responsivo em Tailwind e conteúdo vindo de dados tipados. Publique com HTTPS e domínio da plataforma e coloque o link no GitHub e no LinkedIn. A versão 2 deve ser mais rápida, acessível e fácil de manter que a v1.",
    [
      "Use metadata para título, descrição e Open Graph.",
      "Dados tipados mantêm o conteúdo organizado.",
      "Publique e compartilhe o link no GitHub e no LinkedIn.",
    ],
    [
      "Recriar o portfólio em Next.js com layout e páginas de projetos",
      "Definir metadata e imagem de compartilhamento",
      "Publicar e testar a URL em celular e desktop",
    ],
    [
      "Por que definir metadata em cada página?",
      "Para controlar título, descrição e pré-visualização em buscadores e redes sociais, melhorando SEO e compartilhamento.",
    ],
    [
      "Título da página",
      "Escreva tituloDaPagina(pagina, site) que retorna 'pagina | site', ou só o site se pagina estiver vazia.",
      "Valide a string vazia antes de montar.",
      "function tituloDaPagina(pagina, site) {\n  return pagina ? pagina + \" | \" + site : site;\n}\n",
      "function tituloDaPagina(pagina, site) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Marco: telas do sistema",
    "Marco da seção: construir as telas do sistema de estudos em Next.js: dashboard do dia, flashcards e calendário, com Server Components para leitura, Server Actions validadas para mutações e dados em memória ou localStorage enquanto o banco ainda não existe. Estruture as pastas em domain, use-cases, services e components, aplicando a Clean Architecture desde o início.",
    [
      "Leitura em Server Components; mutações em Server Actions.",
      "Estruture o código em domain, use-cases, services e components.",
      "Os dados virão do banco quando o back-end estiver pronto.",
    ],
    [
      "Criar as rotas do dashboard, flashcards e calendário",
      "Implementar uma Server Action validada com Zod",
      "Separar regras em services e use-cases testáveis",
    ],
    [
      "Por que aplicar Clean Architecture desde o começo?",
      "Para que regras de negócio fiquem isoladas de framework e banco, permitindo trocar a infraestrutura e testar as regras facilmente.",
    ],
    [
      "Agrupar dias por mês",
      "Escreva agruparPorMes(datas) que recebe datas ISO ('2026-11-24') e retorna um objeto com chaves 'AAAA-MM' e a quantidade de datas em cada mês.",
      "Use slice(0, 7) como chave.",
      "function agruparPorMes(datas) {\n  return datas.reduce((grupos, data) => {\n    const mes = data.slice(0, 7);\n    grupos[mes] = (grupos[mes] ?? 0) + 1;\n    return grupos;\n  }, {});\n}\n",
      "function agruparPorMes(datas) {\n  \n}\n",
    ],
  ),
  evaluation(
    CONTEXT,
    "Avaliação da Seção 5: Next.js App Router",
    "Avaliação da seção cobrindo rotas e layouts, Server e Client Components, busca de dados, Server Actions, Route Handlers, Zod, estados de loading e erro e deploy. Meta: nota 85; mínimo 70 para avançar para o back-end.",
    [
      "A avaliação cobre as Aulas 43 a 52.",
      "Meta de nota 85; mínimo 70.",
      "Refaça os tópicos fracos antes de ir para Node.js.",
    ],
    [
      "O que diferencia um Server Component de um Client Component?",
      "O Server Component roda só no servidor e não envia JavaScript ao cliente; o Client Component usa 'use client' e permite estado, efeitos e eventos.",
    ],
  ),
  project(
    CONTEXT,
    "Entrega do portfólio",
    "Entrega da primeira parte do curso: finalize e publique o portfólio v2 com seus melhores projetos, README, link do repositório e do site funcionando. Revise acessibilidade, responsividade, performance básica e textos em português correto. Peça a um colega ou amigo para navegar e anotar dificuldades antes de divulgar.",
    [
      "Entregue com repositório, README e link publicado funcionando.",
      "Peça a outra pessoa para testar o portfólio.",
      "Revise acessibilidade, responsividade e textos.",
    ],
    [
      "Revisar os textos e links do portfólio publicado",
      "Escrever o README do repositório do portfólio",
      "Compartilhar o link com uma pessoa e coletar feedback",
    ],
    [
      "O que não pode faltar na entrega de um portfólio?",
      "Link do site funcionando, repositório com README claro, projetos com descrição e código acessível, e contato visível.",
    ],
    [
      "Checklist de entrega",
      "Escreva checklistDeEntrega(estado) que recebe { site, readme, responsivo, acessivel } (booleans) e retorna os nomes dos itens ainda pendentes, na mesma ordem.",
      "Filtre as chaves com valor false.",
      "function checklistDeEntrega(estado) {\n  return Object.entries(estado)\n    .filter(([, pronto]) => !pronto)\n    .map(([nome]) => nome);\n}\n",
      "function checklistDeEntrega(estado) {\n  \n}\n",
    ],
  ),
];
