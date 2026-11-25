import { evaluation, lesson } from "./helpers";
import type { DayContext, SeedDay } from "./types";

const CONTEXT: DayContext = {
  sectionTitle: "Seção 6 — Node.js e Express",
  moduleTitle: "Node.js e Express",
};

export const secao06NodejsExpress: SeedDay[] = [
  lesson(
    CONTEXT,
    "HTTP: requisições, métodos e status",
    "HTTP é um protocolo de requisição e resposta sem estado. Uma requisição tem método, URL, headers e corpo; a resposta traz status, headers e corpo. GET lê, POST cria, PUT substitui, PATCH altera parte e DELETE remove. O primeiro dígito do status indica a família: 2xx sucesso, 3xx redirecionamento, 4xx erro do cliente e 5xx erro do servidor.",
    [
      "GET lê, POST cria, PUT substitui, PATCH altera parte e DELETE remove.",
      "2xx sucesso, 4xx erro do cliente, 5xx erro do servidor.",
      "401 é não autenticado e 403 é sem permissão.",
    ],
    [
      "Inspecionar uma requisição real na aba Network do DevTools",
      "Testar GET e POST de uma API pública com curl",
      "Desenhar a tabela de rotas REST de um recurso Tarefa",
    ],
    [
      "Qual a diferença entre 401 e 403?",
      "401: o usuário não está autenticado. 403: está autenticado, mas não tem permissão para o recurso.",
    ],
    [
      "Classificar status",
      "Escreva classificarStatus(codigo) que retorna 'sucesso' para 2xx, 'redirecionamento' para 3xx, 'erro do cliente' para 4xx, 'erro do servidor' para 5xx e 'outro' nos demais casos.",
      "Math.floor(codigo / 100) dá a família.",
      "function classificarStatus(codigo) {\n  const familias = { 2: \"sucesso\", 3: \"redirecionamento\", 4: \"erro do cliente\", 5: \"erro do servidor\" };\n  return familias[Math.floor(codigo / 100)] ?? \"outro\";\n}\n",
      "function classificarStatus(codigo) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Módulos nativos: fs, path e process",
    "O Node traz módulos nativos como fs (arquivos), path (caminhos) e process (ambiente e argumentos). Prefira a API de promises (fs/promises) com async/await, monte caminhos com path.join para funcionar em qualquer sistema operacional e leia variáveis com process.env. Trate erros de arquivo inexistente com try/catch.",
    [
      "Use fs/promises com async/await.",
      "path.join evita problemas de separadores entre sistemas.",
      "process.env guarda as variáveis de ambiente.",
    ],
    [
      "Ler e escrever um arquivo JSON com fs/promises",
      "Montar caminhos com path.join e path.basename",
      "Ler uma variável de ambiente com valor padrão",
    ],
    [
      "Por que usar path.join em vez de concatenar caminhos?",
      "Porque ele usa o separador correto do sistema (barra ou barra invertida) e normaliza o resultado.",
    ],
    [
      "Extensão do arquivo",
      "Escreva extensaoDoArquivo(nome) que retorna a extensão sem o ponto em minúsculas, ou '' se não houver. extensaoDoArquivo('Foto.PNG') retorna 'png'.",
      "Use lastIndexOf('.') e slice.",
      "function extensaoDoArquivo(nome) {\n  const indice = nome.lastIndexOf(\".\");\n  return indice === -1 ? \"\" : nome.slice(indice + 1).toLowerCase();\n}\n",
      "function extensaoDoArquivo(nome) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Express: primeiro servidor",
    "O Express é um framework minimalista sobre o módulo http. Crie um app, registre rotas por método e caminho e responda com res.json ou res.status(...).send. Rotas têm parâmetros (req.params), query string (req.query) e corpo (req.body, após o middleware express.json). Escute em uma porta lida de process.env.PORT.",
    [
      "app.get, app.post etc. registram rotas por método.",
      "req.params, req.query e req.body trazem os dados da requisição.",
      "express.json() é necessário para ler o corpo JSON.",
    ],
    [
      "Criar um servidor Express com GET /saude",
      "Criar uma rota com parâmetro /tarefas/:id",
      "Habilitar express.json() e ler o corpo de um POST",
    ],
    [
      "Por que req.body vem undefined em um POST com JSON?",
      "Porque falta o middleware express.json(), que interpreta o corpo antes das rotas.",
    ],
    [
      "Extrair parâmetros de rota",
      "Escreva extrairParametros(padrao, caminho) que recebe '/tarefas/:id' e '/tarefas/7' e retorna { id: '7' }, ou null se não casarem.",
      "Divida por '/' e compare segmento a segmento; ':' marca parâmetro.",
      "function extrairParametros(padrao, caminho) {\n  const partesPadrao = padrao.split(\"/\");\n  const partesCaminho = caminho.split(\"/\");\n  if (partesPadrao.length !== partesCaminho.length) return null;\n  const parametros = {};\n  for (let indice = 0; indice < partesPadrao.length; indice++) {\n    const parte = partesPadrao[indice];\n    if (parte.startsWith(\":\")) parametros[parte.slice(1)] = partesCaminho[indice];\n    else if (parte !== partesCaminho[indice]) return null;\n  }\n  return parametros;\n}\n",
      "function extrairParametros(padrao, caminho) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Rotas GET e POST: API de tarefas",
    "Construa uma API REST de tarefas em memória: GET /tarefas lista, GET /tarefas/:id detalha, POST /tarefas cria com status 201 e PATCH e DELETE alteram e removem. Valide o corpo, responda 404 para ids inexistentes e 400 para dados inválidos. Teste cada rota com curl ou um cliente HTTP.",
    [
      "POST bem-sucedido responde 201; DELETE sem corpo responde 204.",
      "Responda 404 para recurso inexistente e 400 para dados inválidos.",
      "Teste todas as rotas com um cliente HTTP.",
    ],
    [
      "Implementar GET e POST de tarefas com array em memória",
      "Responder 404 para um id inexistente",
      "Testar as rotas com curl e conferir os status",
    ],
    [
      "Qual status devolver ao criar um recurso com POST?",
      "201 Created, idealmente com o header Location apontando para o novo recurso.",
    ],
    [
      "Paginar lista",
      "Escreva paginar(itens, pagina, limite) que retorna { itens, pagina, limite, total, totalPaginas } com páginas começando em 1.",
      "slice((pagina - 1) * limite, pagina * limite) e Math.ceil para o total de páginas.",
      "function paginar(itens, pagina, limite) {\n  const inicio = (pagina - 1) * limite;\n  return {\n    itens: itens.slice(inicio, inicio + limite),\n    pagina,\n    limite,\n    total: itens.length,\n    totalPaginas: Math.ceil(itens.length / limite),\n  };\n}\n",
      "function paginar(itens, pagina, limite) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Middlewares",
    "Middlewares são funções (req, res, next) executadas em sequência antes do handler final: registram logs, autenticam, validam ou encerram a resposta. Chamar next() passa o controle adiante; não chamar nem responder deixa a requisição pendurada. A ordem de registro importa, e middlewares de erro têm quatro parâmetros (erro, req, res, next).",
    [
      "Middleware é uma função (req, res, next) em cadeia.",
      "Sem next() nem resposta, a requisição fica pendurada.",
      "A ordem de registro define a ordem de execução.",
    ],
    [
      "Criar um middleware de log com método, URL e tempo de resposta",
      "Criar um middleware de autenticação por header Authorization",
      "Registrar um middleware de erro com quatro parâmetros",
    ],
    [
      "O que acontece se um middleware não chamar next() nem responder?",
      "A requisição fica pendurada até o timeout, pois o fluxo nunca avança.",
    ],
    [
      "Executar cadeia de middlewares",
      "Escreva executarCadeia(middlewares, contexto) que chama cada função com (contexto, proximo), em que chamar proximo() executa a seguinte. Retorne o contexto no final.",
      "Use um índice e uma função proximo.",
      "function executarCadeia(middlewares, contexto) {\n  let indice = 0;\n  const proximo = () => {\n    const atual = middlewares[indice++];\n    if (atual) atual(contexto, proximo);\n  };\n  proximo();\n  return contexto;\n}\n",
      "function executarCadeia(middlewares, contexto) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Validação com Zod e tratamento de erros",
    "Valide corpo, parâmetros e query com Zod na entrada de cada rota e responda 400 com os erros por campo. Centralize o tratamento de erros em um middleware que converte erros de domínio em status HTTP (NaoEncontrado em 404, Conflito em 409) e esconde detalhes em respostas 500. Nunca exponha stack traces ao cliente.",
    [
      "Valide entradas na borda com Zod e responda 400.",
      "Um middleware central converte erros de domínio em status HTTP.",
      "Não exponha stack traces em respostas 500.",
    ],
    [
      "Validar o corpo de POST /tarefas com Zod",
      "Criar as classes NaoEncontradoError e ConflitoError",
      "Mapear os erros para 404 e 409 em um middleware",
    ],
    [
      "Por que centralizar o tratamento de erros?",
      "Evita duplicação, garante respostas consistentes e impede vazar detalhes internos.",
    ],
    [
      "Mapear erro para status",
      "Escreva statusDoErro(erro) que retorna 404 se erro.name for 'NaoEncontradoError', 409 se for 'ConflitoError', 400 se for 'ValidacaoError' e 500 nos demais casos.",
      "Objeto de mapeamento com fallback para 500.",
      "function statusDoErro(erro) {\n  const status = { NaoEncontradoError: 404, ConflitoError: 409, ValidacaoError: 400 };\n  return status[erro.name] ?? 500;\n}\n",
      "function statusDoErro(erro) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Organização em camadas e variáveis de ambiente",
    "Organize a API em camadas: rotas, controllers (traduzem HTTP), use-cases (regras) e repositórios (dados). Receba dependências por parâmetro para testar com repositórios em memória. Configurações que variam por ambiente ficam em variáveis de ambiente, validadas na inicialização com Zod; versione um .env.example e jamais o .env.",
    [
      "Controllers traduzem HTTP; regras ficam em use-cases.",
      "Receba dependências por parâmetro para facilitar testes.",
      "Valide as variáveis de ambiente na inicialização.",
    ],
    [
      "Mover a lógica das rotas para use-cases e repositórios",
      "Criar .env, .env.example e incluir .env no .gitignore",
      "Validar process.env com um schema Zod ao iniciar",
    ],
    [
      "Por que receber o repositório por parâmetro no use-case?",
      "Para poder trocar a implementação (por exemplo um repositório em memória nos testes) sem alterar a regra de negócio.",
    ],
    [
      "Serviço com repositório injetado",
      "Escreva criarServicoDeTarefas(repositorio) que retorna { listar(), criar(titulo) }; criar lança Error('Título obrigatório') se o título for vazio e delega a repositorio.salvar.",
      "Receba o repositório por parâmetro e valide antes de salvar.",
      "function criarServicoDeTarefas(repositorio) {\n  return {\n    listar: () => repositorio.listar(),\n    criar(titulo) {\n      if (!titulo || !titulo.trim()) throw new Error(\"Título obrigatório\");\n      return repositorio.salvar({ titulo: titulo.trim() });\n    },\n  };\n}\n",
      "function criarServicoDeTarefas(repositorio) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "CORS e integração com o front-end",
    "O navegador bloqueia leituras entre origens diferentes (protocolo, domínio ou porta) pela Same-Origin Policy. CORS é a autorização do servidor, via headers Access-Control-Allow-*, para que outras origens leiam a resposta. Requisições não simples disparam um preflight OPTIONS. Libere apenas origens conhecidas, nunca use * com credenciais e lembre que CORS não é autenticação.",
    [
      "Origem = protocolo + domínio + porta.",
      "CORS é uma autorização do servidor aplicada pelo navegador.",
      "Libere apenas origens conhecidas; nunca * com credenciais.",
    ],
    [
      "Reproduzir um erro de CORS chamando a API de outra porta",
      "Configurar o middleware cors com origens específicas",
      "Observar a requisição OPTIONS de preflight na aba Network",
    ],
    [
      "CORS protege o servidor contra clientes não autorizados?",
      "Não. Só instrui o navegador sobre quais origens podem ler a resposta; curl e outros servidores ignoram. A proteção real vem de autenticação e autorização.",
    ],
    [
      "Validar origem permitida",
      "Escreva origemPermitida(origem, permitidas) que retorna a própria origem se estiver na lista (comparação exata) ou null caso contrário, inclusive se origem for undefined.",
      "Use includes e nunca devolva origem sem checar a lista.",
      "function origemPermitida(origem, permitidas) {\n  if (!origem) return null;\n  return permitidas.includes(origem) ? origem : null;\n}\n",
      "function origemPermitida(origem, permitidas) {\n  \n}\n",
    ],
  ),
  evaluation(
    CONTEXT,
    "Avaliação da Seção 6: Node.js e Express",
    "Avaliação da seção cobrindo HTTP, módulos nativos, Express, rotas GET e POST, middlewares, validação, camadas e CORS. Meta: nota 85; mínimo 70 para avançar para o Prisma.",
    [
      "A avaliação cobre as Aulas 53 a 60.",
      "Meta de nota 85; mínimo 70.",
      "Refaça os tópicos fracos antes de ir para o Prisma.",
    ],
    [
      "O que o middleware express.json() faz?",
      "Interpreta o corpo JSON da requisição e o disponibiliza em req.body antes dos handlers.",
    ],
  ),
];
