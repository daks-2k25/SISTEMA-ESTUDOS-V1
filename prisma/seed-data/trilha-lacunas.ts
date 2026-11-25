import { track } from "./helpers";
import type { DayContext, SeedDay } from "./types";

const SECTION = "Trilha de lacunas";

const GIT: DayContext = { sectionTitle: SECTION, moduleTitle: "Git e GitHub" };
const BANCO: DayContext = { sectionTitle: SECTION, moduleTitle: "Banco de dados avançado" };
const INFRA: DayContext = { sectionTitle: SECTION, moduleTitle: "Docker, Nginx e escala" };
const SEGURANCA: DayContext = { sectionTitle: SECTION, moduleTitle: "Segurança web" };
const QUALIDADE: DayContext = { sectionTitle: SECTION, moduleTitle: "Qualidade e deploy" };

export const trilhaLacunas: SeedDay[] = [
  track(
    GIT,
    "Git e GitHub: commits, branches e pull requests",
    "O Git registra o histórico do projeto em commits e permite trabalhar em paralelo com branches. O fluxo básico é git add, git commit e git push; merge ou rebase integram as mudanças. No GitHub, pull requests propõem e revisam alterações antes de entrarem na main. Escreva commits pequenos no imperativo, use .gitignore para nunca versionar node_modules e .env e proteja a main com revisão e CI verde.",
    [
      "add prepara, commit registra e push envia.",
      "Branches isolam o trabalho; pull requests o revisam.",
      "Nunca versione .env nem node_modules.",
    ],
    [
      "Criar uma branch, fazer commits pequenos e abrir um pull request",
      "Resolver um conflito de merge de propósito",
      "Configurar branch protection exigindo uma aprovação",
    ],
    [
      "Qual a diferença entre git merge e git rebase?",
      "Merge junta duas branches criando um commit de mesclagem e preservando o histórico; rebase reaplica seus commits sobre outra base, deixando o histórico linear, mas reescrevendo commits.",
    ],
    [
      "Mensagem de commit válida",
      "Escreva mensagemValida(mensagem) que retorna true se a primeira linha tiver de 5 a 72 caracteres e não terminar com ponto final.",
      "Pegue a primeira linha com split e confira tamanho e último caractere.",
      "function mensagemValida(mensagem) {\n  const titulo = mensagem.split(\"\\n\")[0];\n  return titulo.length >= 5 && titulo.length <= 72 && !titulo.endsWith(\".\");\n}\n",
      "function mensagemValida(mensagem) {\n  \n}\n",
    ],
  ),
  track(
    BANCO,
    "Índices e EXPLAIN",
    "Índices são estruturas auxiliares (em geral árvores B-tree) que evitam varrer a tabela inteira. Crie-os em colunas de WHERE, JOIN e ORDER BY e em chaves estrangeiras; em índices compostos a ordem das colunas importa. EXPLAIN mostra o plano da consulta e EXPLAIN ANALYZE executa e mede de verdade. Seq Scan em tabela grande costuma indicar falta de índice; índices demais deixam as escritas mais lentas.",
    [
      "Índices B-tree evitam varrer a tabela inteira.",
      "EXPLAIN ANALYZE mostra o plano e os tempos reais.",
      "Índices demais prejudicam as escritas.",
    ],
    [
      "Rodar EXPLAIN ANALYZE em uma consulta lenta e achar o Seq Scan",
      "Criar um índice e comparar o plano e o tempo",
      "Criar um índice composto e testar a ordem das colunas",
    ],
    [
      "Por que a ordem das colunas em um índice composto importa?",
      "O índice só é totalmente aproveitado quando a consulta filtra pela primeira coluna (ou prefixo): (a, b) ajuda em WHERE a e em WHERE a AND b, mas pouco em WHERE b.",
    ],
    [
      "Detectar varredura completa",
      "Escreva temSeqScan(plano) que retorna true se o texto do plano contiver 'Seq Scan', sem diferenciar maiúsculas.",
      "toLowerCase e includes.",
      "function temSeqScan(plano) {\n  return plano.toLowerCase().includes(\"seq scan\");\n}\n",
      "function temSeqScan(plano) {\n  \n}\n",
    ],
  ),
  track(
    BANCO,
    "Transações, ACID e isolamento",
    "ACID resume as garantias de uma transação: Atomicidade (tudo ou nada), Consistência, Isolamento e Durabilidade. O PostgreSQL usa MVCC e níveis de isolamento como Read Committed (padrão), Repeatable Read e Serializable para evitar anomalias. Use BEGIN, COMMIT e ROLLBACK e bloqueios como SELECT ... FOR UPDATE para evitar condições de corrida em operações como atualizar saldos ou contadores.",
    [
      "ACID: atomicidade, consistência, isolamento e durabilidade.",
      "O padrão do PostgreSQL é Read Committed, com MVCC.",
      "SELECT ... FOR UPDATE bloqueia linhas contra condições de corrida.",
    ],
    [
      "Executar BEGIN, duas alterações e ROLLBACK e confirmar que nada persistiu",
      "Simular duas sessões alterando o mesmo registro",
      "Usar prisma.$transaction para um fluxo de duas operações",
    ],
    [
      "O que a atomicidade garante?",
      "Que todas as operações da transação são aplicadas ou nenhuma é; se algo falhar no meio, tudo é desfeito.",
    ],
    [
      "Executar em transação simulada",
      "Escreva emTransacao(estado, operacoes) que copia o estado, aplica cada função de operacoes na cópia e a retorna; se alguma lançar erro, retorna o estado original sem alterações.",
      "structuredClone e try/catch.",
      "function emTransacao(estado, operacoes) {\n  const copia = structuredClone(estado);\n  try {\n    for (const operacao of operacoes) operacao(copia);\n    return copia;\n  } catch {\n    return estado;\n  }\n}\n",
      "function emTransacao(estado, operacoes) {\n  \n}\n",
    ],
  ),
  track(
    INFRA,
    "Docker e Docker Compose",
    "O Docker empacota a aplicação com suas dependências em uma imagem imutável que roda como contêiner isolado. O Dockerfile descreve a construção (FROM, WORKDIR, COPY, RUN, CMD); copie primeiro o package.json para aproveitar o cache de camadas e use multi-stage para reduzir o tamanho final. O Docker Compose sobe vários serviços (app, banco) em uma rede onde cada serviço é acessível pelo nome, com volumes para persistir dados.",
    [
      "Imagem é o modelo imutável; contêiner é uma instância em execução.",
      "Copie o package.json antes do código para aproveitar o cache.",
      "Compose sobe vários serviços; volumes persistem dados.",
    ],
    [
      "Escrever um Dockerfile multi-stage para a aplicação",
      "Criar um compose.yaml com app e PostgreSQL com volume",
      "Adicionar healthcheck ao banco e depends_on condicional na app",
    ],
    [
      "Por que usar volume para o dado de um banco em contêiner?",
      "Porque o sistema de arquivos do contêiner é efêmero; o volume mantém os dados mesmo se o contêiner for removido ou recriado.",
    ],
    [
      "Comando de build",
      "Escreva comandoDeBuild(imagem, tag, contexto = '.') que retorna 'docker build -t imagem:tag contexto'.",
      "Interpole os três valores em uma string.",
      "function comandoDeBuild(imagem, tag, contexto = \".\") {\n  return \"docker build -t \" + imagem + \":\" + tag + \" \" + contexto;\n}\n",
      "function comandoDeBuild(imagem, tag, contexto = \".\") {\n  \n}\n",
    ],
  ),
  track(
    INFRA,
    "Nginx como reverse proxy",
    "Um reverse proxy recebe as requisições dos clientes e as encaminha a servidores internos, escondendo a infraestrutura. O Nginx faz isso com blocos server e location e a diretiva proxy_pass, repassando headers como Host e X-Forwarded-For. Ele também serve arquivos estáticos, comprime respostas, aplica cache e centraliza o TLS (HTTPS). Valide a configuração com nginx -t antes de recarregar.",
    [
      "Reverse proxy encaminha requisições a servidores internos.",
      "proxy_pass e headers X-Forwarded-* preservam a informação do cliente.",
      "Valide com nginx -t antes de recarregar.",
    ],
    [
      "Configurar o Nginx para repassar / para a aplicação na porta 3000",
      "Definir os headers Host e X-Forwarded-For no proxy",
      "Habilitar HTTPS e redirecionar a porta 80",
    ],
    [
      "Para que serve a diretiva proxy_pass?",
      "Define para qual servidor interno o Nginx encaminha a requisição recebida em um location.",
    ],
    [
      "Escolher destino",
      "Escreva escolherDestino(caminho, rotas) em que rotas é como { '/api': 'http://api:4000', '/': 'http://web:3000' }. Retorne o destino do prefixo mais longo que case com o caminho, ou null.",
      "Ordene os prefixos por tamanho decrescente e use startsWith.",
      "function escolherDestino(caminho, rotas) {\n  const prefixos = Object.keys(rotas).sort((a, b) => b.length - a.length);\n  const escolhido = prefixos.find((prefixo) => caminho.startsWith(prefixo));\n  return escolhido === undefined ? null : rotas[escolhido];\n}\n",
      "function escolherDestino(caminho, rotas) {\n  \n}\n",
    ],
  ),
  track(
    INFRA,
    "Load balancers",
    "Um load balancer distribui o tráfego entre várias instâncias da aplicação para aumentar capacidade e disponibilidade, removendo instâncias com falha. No Nginx declara-se um bloco upstream e escolhe-se o algoritmo: round-robin (padrão), least_conn ou ip_hash. Para escalar horizontalmente a aplicação precisa ser stateless, guardando sessões em um armazenamento compartilhado como o Redis.",
    [
      "Load balancer distribui tráfego e remove instâncias com falha.",
      "Round-robin, least_conn e ip_hash são algoritmos comuns.",
      "Escalar horizontalmente exige aplicação stateless.",
    ],
    [
      "Subir duas instâncias da app atrás de um Nginx no Compose",
      "Configurar um upstream com round-robin e testar a distribuição",
      "Derrubar uma instância e confirmar que o serviço continua",
    ],
    [
      "Por que a aplicação precisa ser stateless para escalar?",
      "Porque requisições seguintes podem cair em instâncias diferentes; o estado deve ficar em um armazenamento compartilhado, não na memória de uma instância.",
    ],
    [
      "Round-robin",
      "Escreva criarRoundRobin(servidores) que retorna uma função proximo() que devolve os servidores em rodízio e volta ao primeiro depois do último.",
      "Mantenha um índice na closure e use o resto da divisão.",
      "function criarRoundRobin(servidores) {\n  let indice = 0;\n  return () => {\n    const servidor = servidores[indice];\n    indice = (indice + 1) % servidores.length;\n    return servidor;\n  };\n}\n",
      "function criarRoundRobin(servidores) {\n  \n}\n",
    ],
  ),
  track(
    SEGURANCA,
    "Segurança web: CORS e cookies",
    "CORS é a autorização do servidor, aplicada pelo navegador, para que outras origens leiam suas respostas; requisições não simples disparam um preflight OPTIONS e CORS nunca substitui autenticação. Cookies guardam a sessão: use HttpOnly (inacessível a scripts), Secure (só HTTPS) e SameSite (limita o envio entre sites) em cookies de autenticação, com Max-Age definido e ID de sessão aleatório regenerado após o login.",
    [
      "CORS é imposto pelo navegador e não substitui autenticação.",
      "Use HttpOnly, Secure e SameSite em cookies de autenticação.",
      "Regenere o ID da sessão depois do login.",
    ],
    [
      "Configurar CORS com a lista exata de origens do front-end",
      "Definir um cookie com HttpOnly, Secure e SameSite e vê-lo no DevTools",
      "Confirmar que document.cookie não lê o cookie HttpOnly",
    ],
    [
      "O que faz o atributo SameSite em um cookie?",
      "Define se o cookie é enviado em requisições originadas em outros sites (Strict, Lax ou None), ajudando a mitigar CSRF.",
    ],
    [
      "Parser de cookies",
      "Escreva parseCookies(cabecalho) que converte 'a=1; b=dois' em { a: '1', b: 'dois' }. Para cabeçalho vazio ou ausente, retorne {}.",
      "Separe por ';', divida cada parte no primeiro '=' e faça trim.",
      "function parseCookies(cabecalho) {\n  if (!cabecalho) return {};\n  const pares = cabecalho\n    .split(\";\")\n    .map((parte) => parte.trim())\n    .filter((parte) => parte.includes(\"=\"))\n    .map((parte) => {\n      const indice = parte.indexOf(\"=\");\n      return [parte.slice(0, indice), parte.slice(indice + 1)];\n    });\n  return Object.fromEntries(pares);\n}\n",
      "function parseCookies(cabecalho) {\n  \n}\n",
    ],
  ),
  track(
    SEGURANCA,
    "Segurança web: XSS e CSRF",
    "No XSS, o atacante faz o site executar script dele no navegador da vítima, normalmente por conteúdo não confiável inserido sem tratamento. A defesa é escapar a saída (textContent, frameworks que escapam por padrão), sanitizar HTML quando necessário e definir uma Content-Security-Policy. No CSRF, o atacante induz o navegador autenticado da vítima a enviar uma requisição indesejada; mitiga-se com cookies SameSite, tokens anti-CSRF e nunca alterando estado via GET.",
    [
      "XSS injeta script no site; escape a saída e use CSP.",
      "CSRF usa a sessão já aberta; mitigue com SameSite e tokens.",
      "Nunca altere estado com requisições GET.",
    ],
    [
      "Reproduzir um XSS com innerHTML em uma página de teste e corrigir com textContent",
      "Simular um CSRF com um formulário em outra origem e bloqueá-lo com SameSite",
      "Configurar um header Content-Security-Policy básico",
    ],
    [
      "Qual a diferença entre XSS e CSRF?",
      "XSS injeta código do atacante no site (explora a confiança do usuário no site); CSRF usa a sessão existente do usuário para disparar ações (explora a confiança do site no navegador).",
    ],
    [
      "Escapar HTML",
      "Escreva escaparHtml(texto) que troca os caracteres &, <, >, aspas duplas e aspas simples pelas entidades &amp;, &lt;, &gt;, &quot; e &#39;.",
      "Use um mapa e replace com regex; o & precisa ser tratado no mesmo passo.",
      "function escaparHtml(texto) {\n  const entidades = { \"&\": \"&amp;\", \"<\": \"&lt;\", \">\": \"&gt;\", '\"': \"&quot;\", \"'\": \"&#39;\" };\n  return texto.replace(/[&<>\"']/g, (caractere) => entidades[caractere]);\n}\n",
      "function escaparHtml(texto) {\n  \n}\n",
    ],
  ),
  track(
    QUALIDADE,
    "Rate limit e Swagger",
    "Rate limiting limita quantas requisições um cliente pode fazer em uma janela de tempo, protegendo contra abuso e força bruta em rotas como login; no Nest use @nestjs/throttler. O Swagger (OpenAPI) documenta a API de forma navegável e testável: decore DTOs e controllers e exponha a documentação em /docs. Documentação atualizada é parte da qualidade da API.",
    [
      "Rate limit protege rotas sensíveis contra abuso e força bruta.",
      "Swagger/OpenAPI documenta a API de forma interativa.",
      "Devolva 429 quando o limite for excedido.",
    ],
    [
      "Aplicar @nestjs/throttler na rota de login",
      "Gerar a documentação Swagger em /docs",
      "Testar o 429 repetindo requisições em sequência",
    ],
    [
      "Que status HTTP indica excesso de requisições?",
      "429 Too Many Requests, geralmente com o header Retry-After indicando quando tentar de novo.",
    ],
    [
      "Limitador de taxa",
      "Escreva criarLimitador(maximo, janelaMs) que retorna permitir(chave, agora): true se a chave fez menos de maximo requisições nos últimos janelaMs milissegundos (registrando a atual), senão false.",
      "Guarde os instantes por chave em um Map e descarte os mais antigos que a janela.",
      "function criarLimitador(maximo, janelaMs) {\n  const registros = new Map();\n  return (chave, agora) => {\n    const recentes = (registros.get(chave) ?? []).filter((instante) => agora - instante < janelaMs);\n    if (recentes.length >= maximo) {\n      registros.set(chave, recentes);\n      return false;\n    }\n    recentes.push(agora);\n    registros.set(chave, recentes);\n    return true;\n  };\n}\n",
      "function criarLimitador(maximo, janelaMs) {\n  \n}\n",
    ],
  ),
  track(
    QUALIDADE,
    "Testes end-to-end",
    "Testes E2E automatizam o navegador para validar fluxos completos do ponto de vista do usuário, como cadastro, login e conclusão de um dia de estudo, passando por interface, API e banco. Playwright é a ferramenta mais usada. São os mais lentos, então siga a pirâmide: muitos unitários, alguns de integração e poucos E2E dos fluxos críticos. Use seletores estáveis (roles e data-testid) e aguarde condições em vez de esperas fixas.",
    [
      "E2E valida fluxos completos pelo navegador.",
      "Siga a pirâmide: muitos unitários, poucos E2E.",
      "Use seletores estáveis e espere por condições, não por tempo fixo.",
    ],
    [
      "Instalar o Playwright e gravar o teste do fluxo principal",
      "Trocar seletores frágeis por getByRole e data-testid",
      "Rodar o E2E em modo headless no terminal",
    ],
    [
      "O que é a pirâmide de testes?",
      "Um guia de proporção: base larga de testes unitários rápidos, camada intermediária de integração e topo estreito de E2E, mais lentos e caros.",
    ],
    [
      "Esperar por uma condição",
      "Escreva a função async esperarCondicao(condicao, tentativas, intervaloMs) que verifica condicao() até retornar true, aguardando intervaloMs entre as tentativas; retorna true se cumprir ou false ao esgotar as tentativas.",
      "Laço com await new Promise(resolve => setTimeout(resolve, intervaloMs)).",
      "async function esperarCondicao(condicao, tentativas, intervaloMs) {\n  for (let tentativa = 0; tentativa < tentativas; tentativa++) {\n    if (condicao()) return true;\n    await new Promise((resolve) => setTimeout(resolve, intervaloMs));\n  }\n  return false;\n}\n",
      "async function esperarCondicao(condicao, tentativas, intervaloMs) {\n  \n}\n",
    ],
  ),
  track(
    QUALIDADE,
    "Deploy e CI/CD",
    "A integração contínua (CI) roda lint, tipos, testes e build a cada push ou pull request, e a entrega contínua (CD) publica a aplicação depois da CI. No GitHub Actions o fluxo fica em .github/workflows. Estratégias como rolling update, blue-green e canary reduzem o risco, e é preciso ter plano de rollback, imagens com tags imutáveis e migrações compatíveis com a versão anterior. Rode prisma migrate deploy no processo de release.",
    [
      "CI roda lint, tipos, testes e build a cada alteração.",
      "Rolling, blue-green e canary reduzem o risco do deploy.",
      "Tenha plano de rollback e rode migrate deploy no release.",
    ],
    [
      "Criar um workflow do GitHub Actions com tsc --noEmit, testes e build",
      "Publicar uma imagem Docker com tag da versão",
      "Descrever o rollback do projeto em 5 passos",
    ],
    [
      "Qual comando do Prisma aplica migrações em produção?",
      "prisma migrate deploy, que aplica apenas as migrações pendentes sem criar novas nem resetar o banco.",
    ],
    [
      "Variáveis faltando",
      "Escreva variaveisFaltando(env, obrigatorias) que retorna o array das variáveis obrigatórias ausentes ou vazias em env.",
      "filter sobre as obrigatórias.",
      "function variaveisFaltando(env, obrigatorias) {\n  return obrigatorias.filter((nome) => !env[nome]);\n}\n",
      "function variaveisFaltando(env, obrigatorias) {\n  \n}\n",
    ],
  ),
];
