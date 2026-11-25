import { evaluation, lesson } from "./helpers";
import type { DayContext, SeedDay } from "./types";

const CONTEXT: DayContext = {
  sectionTitle: "Seção 8 — NestJS",
  moduleTitle: "NestJS",
};

export const secao08Nestjs: SeedDay[] = [
  lesson(
    CONTEXT,
    "NestJS: visão geral e módulos",
    "O NestJS é um framework Node.js opinativo, escrito em TypeScript, que organiza a aplicação em módulos, controllers e providers com decorators e injeção de dependência. Um módulo (@Module) agrupa controllers, providers e importações, e a aplicação começa no AppModule. A CLI (nest new, nest generate) cria a estrutura padrão e mantém as convenções.",
    [
      "Nest organiza a aplicação em módulos, controllers e providers.",
      "@Module agrupa controllers, providers, imports e exports.",
      "A CLI gera a estrutura seguindo as convenções.",
    ],
    [
      "Criar um projeto com a CLI do Nest",
      "Gerar o módulo de tarefas com nest generate resource",
      "Ler o AppModule e identificar imports, controllers e providers",
    ],
    [
      "Para que serve o decorator @Module?",
      "Declara um módulo agrupando controllers, providers e importações e define o que é exposto a outros módulos via exports.",
    ],
    [
      "Nome do módulo",
      "Escreva nomeDoModulo(slug) que converte 'tarefas-do-dia' em 'TarefasDoDiaModule'.",
      "Divida por '-', capitalize cada parte e acrescente 'Module'.",
      "function nomeDoModulo(slug) {\n  const partes = slug.split(\"-\").map((parte) => parte[0].toUpperCase() + parte.slice(1));\n  return partes.join(\"\") + \"Module\";\n}\n",
      "function nomeDoModulo(slug) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Controllers e rotas",
    "Controllers recebem requisições e devolvem respostas. @Controller('tarefas') define o prefixo e @Get, @Post, @Patch e @Delete mapeiam métodos HTTP. Dados chegam por @Param, @Query e @Body, e o status pode ser alterado com @HttpCode. Controllers devem ser finos: apenas traduzem HTTP e delegam a regra aos services.",
    [
      "@Controller define o prefixo e @Get/@Post mapeiam métodos.",
      "@Param, @Query e @Body extraem os dados da requisição.",
      "Controllers são finos e delegam ao service.",
    ],
    [
      "Criar rotas GET e POST em um controller de tarefas",
      "Ler um id com @Param e um filtro com @Query",
      "Alterar o status de resposta com @HttpCode",
    ],
    [
      "Qual a responsabilidade de um controller?",
      "Receber a requisição, entregar os dados ao service e devolver a resposta, sem conter regras de negócio.",
    ],
    [
      "Montar rota completa",
      "Escreva montarRota(prefixo, rota) que junta os dois trechos com uma única barra, sem barras duplicadas. montarRota('tarefas', ':id') retorna '/tarefas/:id'.",
      "Filtre segmentos vazios depois de dividir por '/'.",
      "function montarRota(prefixo, rota) {\n  const segmentos = [prefixo, rota].flatMap((trecho) => trecho.split(\"/\")).filter(Boolean);\n  return \"/\" + segmentos.join(\"/\");\n}\n",
      "function montarRota(prefixo, rota) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Providers e injeção de dependência",
    "Providers são classes marcadas com @Injectable (services, repositórios) que o contêiner de DI do Nest instancia e injeta pelo construtor. Isso desacopla as classes, facilita testes com mocks e gerencia o ciclo de vida das instâncias, por padrão singleton. Para usar um provider em outro módulo, exporte-o e importe o módulo.",
    [
      "@Injectable marca classes gerenciadas pelo contêiner de DI.",
      "A injeção ocorre pelo construtor; instâncias são singleton por padrão.",
      "Para usar um provider em outro módulo, exporte-o e importe o módulo.",
    ],
    [
      "Criar um TarefasService e injetá-lo no controller",
      "Exportar um provider e consumi-lo em outro módulo",
      "Trocar a implementação por um mock em um teste",
    ],
    [
      "Qual a vantagem da injeção de dependência?",
      "Reduz o acoplamento, permite substituir implementações (mocks em testes) e centraliza a criação e o ciclo de vida dos objetos.",
    ],
    [
      "Contêiner de DI mínimo",
      "Escreva criarContainer() que retorna { registrar(nome, fabrica), resolver(nome) }; resolver chama a fábrica só na primeira vez (singleton) e lança Error se o nome não estiver registrado.",
      "Use dois Maps: fábricas e instâncias.",
      "function criarContainer() {\n  const fabricas = new Map();\n  const instancias = new Map();\n  return {\n    registrar(nome, fabrica) {\n      fabricas.set(nome, fabrica);\n    },\n    resolver(nome) {\n      if (!fabricas.has(nome)) throw new Error(\"Não registrado: \" + nome);\n      if (!instancias.has(nome)) instancias.set(nome, fabricas.get(nome)());\n      return instancias.get(nome);\n    },\n  };\n}\n",
      "function criarContainer() {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "DTOs e validação com pipes",
    "DTOs descrevem o formato esperado do corpo da requisição e funcionam como contrato da API. Com class-validator e class-transformer, decore os campos (@IsString, @IsInt, @Min) e ative o ValidationPipe global com whitelist e transform: campos não declarados são removidos e dados inválidos geram 400 automaticamente. ParseIntPipe converte parâmetros de rota.",
    [
      "DTOs com class-validator descrevem o contrato do corpo.",
      "ValidationPipe valida e devolve 400 automaticamente.",
      "whitelist remove campos não declarados.",
    ],
    [
      "Criar CriarTarefaDto com decorators do class-validator",
      "Ativar ValidationPipe global com whitelist e transform",
      "Usar ParseIntPipe em um parâmetro de rota",
    ],
    [
      "O que a opção whitelist do ValidationPipe faz?",
      "Remove do objeto validado qualquer propriedade sem decorator no DTO, evitando que campos inesperados cheguem à regra de negócio.",
    ],
    [
      "Remover campos extras",
      "Escreva aplicarWhitelist(objeto, permitidos) que retorna um novo objeto apenas com as chaves permitidas presentes no objeto.",
      "Filtre Object.entries pelas chaves permitidas.",
      "function aplicarWhitelist(objeto, permitidos) {\n  const entradas = Object.entries(objeto).filter(([chave]) => permitidos.includes(chave));\n  return Object.fromEntries(entradas);\n}\n",
      "function aplicarWhitelist(objeto, permitidos) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "PrismaService",
    "Para usar o Prisma no Nest, crie um PrismaService injetável que estende o PrismaClient, conecta em OnModuleInit e desconecta em OnModuleDestroy. Declare-o em um PrismaModule global que o exporta e injete-o nos repositórios. Assim o acesso a dados fica centralizado e é simples trocá-lo por um mock em testes.",
    [
      "PrismaService encapsula o client e gerencia a conexão no ciclo de vida.",
      "PrismaModule exporta o service para os repositórios.",
      "Injetar o service facilita mocks nos testes.",
    ],
    [
      "Criar PrismaService com onModuleInit e onModuleDestroy",
      "Criar um PrismaModule global que exporta o service",
      "Injetar o PrismaService em um repositório de tarefas",
    ],
    [
      "Por que o PrismaService implementa OnModuleDestroy?",
      "Para desconectar o client do banco de forma limpa quando a aplicação encerra, liberando as conexões.",
    ],
    [
      "Montar a URL de conexão",
      "Escreva montarUrlDoBanco({ usuario, senha, host, porta, banco }) que retorna 'postgresql://usuario:senha@host:porta/banco', codificando usuário e senha com encodeURIComponent.",
      "Aplique encodeURIComponent apenas em usuario e senha.",
      "function montarUrlDoBanco({ usuario, senha, host, porta, banco }) {\n  const credenciais = encodeURIComponent(usuario) + \":\" + encodeURIComponent(senha);\n  return \"postgresql://\" + credenciais + \"@\" + host + \":\" + porta + \"/\" + banco;\n}\n",
      "function montarUrlDoBanco(config) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Testes com Jest",
    "O Nest já vem configurado com Jest. Testes unitários isolam services e controllers com dublês (mocks, stubs, fakes) e seguem o padrão Arrange-Act-Assert; testes e2e sobem a aplicação e chamam as rotas com supertest. Prefira fakes em memória a mocks excessivos e teste o comportamento observável, não detalhes de implementação.",
    [
      "Testes unitários são rápidos e isolados; e2e sobem a aplicação.",
      "Siga Arrange-Act-Assert com nomes descritivos.",
      "Teste comportamento, não detalhes de implementação.",
    ],
    [
      "Escrever 5 testes unitários para o TarefasService com repositório fake",
      "Escrever um teste e2e para POST /tarefas com supertest",
      "Rodar a cobertura com npm run test:cov",
    ],
    [
      "O que significa o padrão Arrange-Act-Assert?",
      "Organizar o teste em três fases: preparar o cenário, executar a ação testada e verificar o resultado.",
    ],
    [
      "Espião de função",
      "Escreva criarEspiao(funcao) que retorna uma função com a propriedade chamadas (array dos argumentos de cada chamada) que também executa a original e retorna seu resultado.",
      "Guarde os argumentos antes de chamar a original.",
      "function criarEspiao(funcao) {\n  const espiao = (...argumentos) => {\n    espiao.chamadas.push(argumentos);\n    return funcao(...argumentos);\n  };\n  espiao.chamadas = [];\n  return espiao;\n}\n",
      "function criarEspiao(funcao) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Marco: API do sistema de estudos",
    "Marco da seção: implementar a API do sistema de estudos em NestJS com módulos para dias, flashcards e desafios, DTOs validados, PrismaService, tratamento de erros com exceções HTTP e testes. Mantenha a Clean Architecture: controllers finos, use-cases com a regra, repositórios isolando o Prisma e o algoritmo SM-2 como função pura.",
    [
      "Controllers finos, regras em use-cases e Prisma isolado em repositórios.",
      "Use exceções HTTP do Nest para respostas de erro consistentes.",
      "O SM-2 continua sendo uma função pura e testada.",
    ],
    [
      "Criar os módulos de dias, flashcards e desafios",
      "Expor a rota de avaliar flashcard aplicando o SM-2",
      "Cobrir os use-cases com testes unitários",
    ],
    [
      "Como o Nest responde ao lançar NotFoundException em um service?",
      "O framework captura a exceção e responde 404 com um corpo JSON padronizado com statusCode, message e error.",
    ],
    [
      "Formatar resposta de erro",
      "Escreva formatarErro(status, mensagem) que retorna { statusCode, message, error } em que error é 'Not Found' para 404, 'Conflict' para 409, 'Bad Request' para 400 e 'Internal Server Error' nos demais.",
      "Objeto de nomes com fallback.",
      "function formatarErro(status, mensagem) {\n  const nomes = { 404: \"Not Found\", 409: \"Conflict\", 400: \"Bad Request\" };\n  return { statusCode: status, message: mensagem, error: nomes[status] ?? \"Internal Server Error\" };\n}\n",
      "function formatarErro(status, mensagem) {\n  \n}\n",
    ],
  ),
  evaluation(
    CONTEXT,
    "Avaliação da Seção 8: NestJS",
    "Avaliação da seção cobrindo módulos, controllers, providers e injeção de dependência, DTOs e validação, PrismaService, testes com Jest e a API do sistema. Meta: nota 85; mínimo 70 para avançar para PostgreSQL.",
    [
      "A avaliação cobre as Aulas 66 a 72.",
      "Meta de nota 85; mínimo 70.",
      "Refaça os tópicos fracos antes de ir para PostgreSQL.",
    ],
    [
      "Qual a ordem entre guards e pipes no Nest?",
      "Guards executam antes dos pipes: primeiro a autorização, depois a transformação e validação dos dados de entrada.",
    ],
  ),
];
