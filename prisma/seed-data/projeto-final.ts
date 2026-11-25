import { project, review } from "./helpers";
import type { DayContext, SeedDay } from "./types";

const SECTION = "Projeto final";

const SISTEMA: DayContext = { sectionTitle: SECTION, moduleTitle: "Revisão do sistema" };
const PORTFOLIO: DayContext = { sectionTitle: SECTION, moduleTitle: "Portfólio e GitHub" };
const ENTREVISTA: DayContext = { sectionTitle: SECTION, moduleTitle: "Preparação para entrevistas" };
const FECHAMENTO: DayContext = { sectionTitle: SECTION, moduleTitle: "Fechamento do curso" };

export const projetoFinal: SeedDay[] = [
  review(
    SISTEMA,
    "Revisão do sistema de estudos: back-end",
    "Revise o back-end do sistema: camadas (controllers finos, use-cases, repositórios), validação com DTOs e Zod, tratamento de erros, autenticação JWT, RLS e testes. Procure acoplamentos indevidos, como regra de negócio em controllers ou o Prisma fora dos repositórios, e refatore o que encontrar com a rede de segurança dos testes.",
    [
      "Controllers finos, regras em use-cases e Prisma isolado nos repositórios.",
      "Toda entrada é validada na borda.",
      "Refatore apenas com testes passando.",
    ],
    [
      "Caçar regras de negócio fora dos use-cases e movê-las",
      "Conferir que só os repositórios importam o Prisma",
      "Rodar todos os testes e corrigir o que falhar",
    ],
    [
      "Qual direção devem seguir as dependências na Clean Architecture?",
      "De fora para dentro: interface e infraestrutura dependem de casos de uso e domínio; o domínio não depende de nada externo.",
    ],
    [
      "Detectar acoplamento",
      "Escreva importaPrisma(codigo) que retorna true se o texto do código contiver uma linha de import vindo de '@prisma/client'.",
      "Use uma regex sobre a linha de import.",
      "function importaPrisma(codigo) {\n  return /import[^;]*from\\s+[\"']@prisma\\/client[\"']/.test(codigo);\n}\n",
      "function importaPrisma(codigo) {\n  \n}\n",
    ],
  ),
  review(
    SISTEMA,
    "Revisão do sistema de estudos: front-end",
    "Revise o front-end: separação entre Server e Client Components, regras fora dos componentes, estados de carregamento, erro e vazio, acessibilidade (foco visível, labels, contraste) e responsividade em 375 px e 1440 px. Teste os fluxos principais apenas com o teclado e anote qualquer ponto em que a navegação trave.",
    [
      "Mantenha o máximo no servidor e empurre 'use client' para as folhas.",
      "Trate carregamento, erro e estados vazios em todas as telas.",
      "Teste os fluxos usando só o teclado.",
    ],
    [
      "Navegar por todas as telas somente com o teclado",
      "Revisar o layout em 375 px e em 1440 px",
      "Conferir os estados de loading, erro e vazio de cada rota",
    ],
    [
      "Por que testar a interface só com o teclado?",
      "Porque revela problemas de foco, ordem de tabulação e elementos não acessíveis que afetam usuários de leitores de tela e quem não usa mouse.",
    ],
    [
      "Contraste mínimo",
      "Escreva contrasteSuficiente(razao) que retorna true se a razão de contraste for pelo menos 4.5 (nível AA para texto comum).",
      "Compare com 4.5.",
      "function contrasteSuficiente(razao) {\n  return razao >= 4.5;\n}\n",
      "function contrasteSuficiente(razao) {\n  \n}\n",
    ],
  ),
  review(
    PORTFOLIO,
    "Revisão do portfólio",
    "Revise o portfólio como um recrutador faria: em 30 segundos, ele entende quem você é, o que sabe fazer e onde ver o código? Destaque dois ou três projetos com descrição do problema, tecnologias, desafios e links para repositório e demonstração. Corrija textos, links quebrados e a performance, e escolha seus melhores projetos em vez de listar todos.",
    [
      "Em 30 segundos, o recrutador deve entender quem você é e o que faz.",
      "Destaque poucos projetos bem explicados.",
      "Confira links, textos e performance.",
    ],
    [
      "Pedir a uma pessoa para olhar o portfólio por 30 segundos e resumir o que entendeu",
      "Reescrever a descrição dos 3 melhores projetos",
      "Testar todos os links e rodar o Lighthouse",
    ],
    [
      "O que destacar em cada projeto do portfólio?",
      "O problema resolvido, as tecnologias usadas, os desafios técnicos e as decisões, com links para o código e a demonstração.",
    ],
    [
      "Links quebrados",
      "Escreva linksQuebrados(links, statusPorLink) que retorna os links cujo status em statusPorLink seja 400 ou maior, ou que não existam no objeto.",
      "filter com a checagem do status.",
      "function linksQuebrados(links, statusPorLink) {\n  return links.filter((link) => !(link in statusPorLink) || statusPorLink[link] >= 400);\n}\n",
      "function linksQuebrados(links, statusPorLink) {\n  \n}\n",
    ],
  ),
  project(
    PORTFOLIO,
    "README e GitHub",
    "O README é a porta de entrada do repositório: descreva o problema, a solução, a stack, como instalar e rodar, as variáveis de ambiente, decisões de arquitetura e inclua capturas de tela ou uma demonstração curta. Organize o perfil do GitHub com repositórios fixados, commits pequenos e mensagens claras, e mantenha o .env fora do repositório.",
    [
      "O README explica o problema, a stack e como rodar.",
      "Fixe seus melhores repositórios no perfil.",
      "Nunca versione segredos; use .env.example.",
    ],
    [
      "Escrever o README do sistema de estudos com instalação e decisões",
      "Fixar os melhores repositórios e escrever o README do perfil",
      "Varrer os repositórios em busca de segredos versionados por engano",
    ],
    [
      "O que um bom README de projeto deve conter?",
      "Descrição do problema e da solução, stack, instruções para instalar e rodar, variáveis de ambiente, decisões de arquitetura e capturas de tela ou demonstração.",
    ],
    [
      "Índice do README",
      "Escreva indiceDoReadme(titulos) que recebe títulos e retorna uma lista em markdown, uma linha por título no formato '- [Título](#titulo-em-minusculas-com-hifens)'.",
      "Gere o slug com toLowerCase e troca de espaços por hífen.",
      "function indiceDoReadme(titulos) {\n  return titulos\n    .map((titulo) => \"- [\" + titulo + \"](#\" + titulo.toLowerCase().replace(/\\s+/g, \"-\") + \")\")\n    .join(\"\\n\");\n}\n",
      "function indiceDoReadme(titulos) {\n  \n}\n",
    ],
  ),
  review(
    ENTREVISTA,
    "Simulado de entrevista: JavaScript e TypeScript",
    "Simule uma entrevista técnica sobre JavaScript e TypeScript: closures, this, event loop, Promises, async/await, coerção, módulos, tipos, genéricos e narrowing. Responda em voz alta e com exemplos de código, cronometrando cada resposta, e grave a si mesmo para identificar hesitações. Resolva ao menos dois problemas no estilo LeetCode Easy sem consultar a solução.",
    [
      "Explique conceitos em voz alta, com exemplos de código.",
      "Cronometre e grave suas respostas para achar hesitações.",
      "Treine problemas no estilo LeetCode Easy.",
    ],
    [
      "Responder em voz alta 10 perguntas de JavaScript e TypeScript",
      "Resolver 2 problemas LeetCode Easy sem consultar a solução",
      "Anotar as perguntas em que você hesitou",
    ],
    [
      "Como explicar o event loop em uma entrevista?",
      "O JavaScript tem uma pilha de chamadas e delega tarefas assíncronas ao ambiente; o event loop move callbacks das filas para a pilha quando ela está vazia, com microtasks (Promises) antes das macrotasks (timers).",
    ],
    [
      "Pontuar simulado",
      "Escreva pontuarSimulado(respostas) que recebe um array de { correta } e retorna a porcentagem de respostas corretas arredondada para inteiro (0 para lista vazia).",
      "Conte as corretas e trate o caso vazio.",
      "function pontuarSimulado(respostas) {\n  if (respostas.length === 0) return 0;\n  const corretas = respostas.filter((resposta) => resposta.correta).length;\n  return Math.round((corretas / respostas.length) * 100);\n}\n",
      "function pontuarSimulado(respostas) {\n  \n}\n",
    ],
  ),
  review(
    ENTREVISTA,
    "Simulado de entrevista: React e Next.js",
    "Simule perguntas sobre React e Next.js: estado e efeitos, key em listas, Context, renderização de Server e Client Components, Server Actions, cache e revalidação, deploy. Prepare uma explicação de dois minutos sobre uma decisão de arquitetura do seu projeto, incluindo as alternativas que você descartou e por quê.",
    [
      "Explique por que e quando usar cada hook.",
      "Diferencie Server e Client Components com exemplos.",
      "Prepare uma explicação de dois minutos sobre uma decisão sua.",
    ],
    [
      "Responder em voz alta 10 perguntas de React e Next.js",
      "Preparar a explicação de uma decisão de arquitetura do projeto",
      "Revisar os flashcards das seções 4 e 5",
    ],
    [
      "Como explicar Server Components a um entrevistador?",
      "São componentes renderizados apenas no servidor, que acessam dados diretamente e não enviam JavaScript ao cliente; os Client Components ('use client') cuidam de estado e interação.",
    ],
    [
      "Escolher tipo de componente",
      "Escreva tipoDeComponente({ usaEstado, usaEventos }) que retorna 'client' se qualquer propriedade for true e 'server' caso contrário.",
      "some sobre Object.values.",
      "function tipoDeComponente(recursos) {\n  return Object.values(recursos).some(Boolean) ? \"client\" : \"server\";\n}\n",
      "function tipoDeComponente(recursos) {\n  \n}\n",
    ],
  ),
  review(
    ENTREVISTA,
    "Simulado de entrevista: back-end, banco e infraestrutura",
    "Simule perguntas sobre Node.js, NestJS, Prisma, PostgreSQL, autenticação e infraestrutura: injeção de dependência, DTOs, N+1, índices, transações, RLS, JWT, Docker, Nginx e deploy. Treine desenhar no papel a arquitetura do seu sistema e explicar o caminho de uma requisição autenticada do navegador até o banco.",
    [
      "Saiba explicar o caminho completo de uma requisição autenticada.",
      "Domine os conceitos de N+1, índices, transações e RLS.",
      "Desenhe a arquitetura do seu sistema no papel.",
    ],
    [
      "Responder em voz alta 10 perguntas de back-end e banco",
      "Desenhar a arquitetura do sistema de estudos no papel",
      "Revisar os flashcards das seções 6 a 9 e da trilha de lacunas",
    ],
    [
      "O que é o problema N+1 e como evitá-lo?",
      "Uma consulta inicial seguida de uma consulta por item da lista. Evita-se carregando as relações na mesma consulta (include/select) ou buscando os ids de uma vez com where in.",
    ],
    [
      "Detectar N+1",
      "Escreva temNMaisUm(consultas) que recebe os textos das consultas executadas e retorna true se alguma consulta idêntica se repetir 5 ou mais vezes.",
      "Conte as ocorrências em um objeto.",
      "function temNMaisUm(consultas) {\n  const contagem = {};\n  for (const consulta of consultas) {\n    contagem[consulta] = (contagem[consulta] ?? 0) + 1;\n  }\n  return Object.values(contagem).some((quantidade) => quantidade >= 5);\n}\n",
      "function temNMaisUm(consultas) {\n  \n}\n",
    ],
  ),
  review(
    FECHAMENTO,
    "Revisão geral: flashcards e lacunas",
    "Faça a revisão geral do curso: zere a fila de flashcards vencidos, refaça sem consultar os desafios em que você mais errou e releia suas anotações de erros das avaliações. Priorize o que cai com mais frequência em entrevistas e no trabalho: JavaScript assíncrono, tipos, React, SQL e segurança. Transforme cada lacuna em um flashcard novo.",
    [
      "Zere a fila de flashcards vencidos.",
      "Refaça os desafios em que você mais errou.",
      "Priorize assuntos frequentes em entrevistas e no trabalho.",
    ],
    [
      "Zerar a fila de flashcards vencidos",
      "Refazer 5 desafios em que errou, sem consultar a solução",
      "Criar flashcards novos para cada lacuna encontrada",
    ],
    [
      "Qual a melhor forma de revisar antes de uma entrevista?",
      "Recuperar da memória (flashcards, exercícios sem consulta, explicar em voz alta), priorizando as lacunas, em vez de apenas reler o material.",
    ],
    [
      "Próximo intervalo",
      "Escreva proximoIntervalo(intervaloAtual, facilidade) que retorna o novo intervalo em dias: o atual multiplicado pela facilidade e arredondado para cima, com mínimo de 1.",
      "Math.max(1, Math.ceil(...)).",
      "function proximoIntervalo(intervaloAtual, facilidade) {\n  return Math.max(1, Math.ceil(intervaloAtual * facilidade));\n}\n",
      "function proximoIntervalo(intervaloAtual, facilidade) {\n  \n}\n",
    ],
  ),
  review(
    FECHAMENTO,
    "Revisão geral: refatorar e publicar",
    "Dedique o dia a deixar tudo publicável: refatore pontos fracos do sistema de estudos, rode testes, tsc e build, atualize o README, confira o deploy e as variáveis de ambiente e revise as configurações de segurança (CORS, cookies, headers, rate limit). Um projeto pequeno, limpo, testado e publicado vale mais do que um grande e inacabado.",
    [
      "Rode testes, tsc e build antes de publicar.",
      "Revise CORS, cookies, headers e rate limit.",
      "Um projeto pequeno, limpo e publicado vale mais que um grande e inacabado.",
    ],
    [
      "Rodar testes, tsc --noEmit e build sem erros",
      "Conferir as variáveis de ambiente e o deploy em produção",
      "Revisar as configurações de segurança do sistema publicado",
    ],
    [
      "Qual a checagem mínima antes de publicar uma versão?",
      "Testes passando, checagem de tipos e build sem erros, variáveis de ambiente configuradas, migrações aplicadas e um plano de rollback.",
    ],
    [
      "Pronto para publicar",
      "Escreva prontoParaPublicar({ testes, tipos, build, ambiente }) que retorna true apenas se todas as propriedades forem true.",
      "Object.values com every.",
      "function prontoParaPublicar(estado) {\n  return Object.values(estado).every(Boolean);\n}\n",
      "function prontoParaPublicar(estado) {\n  \n}\n",
    ],
  ),
  project(
    FECHAMENTO,
    "Fechamento do curso e próximos passos",
    "Você concluiu a trilha de 120 dias. Olhe para o caminho percorrido: do JavaScript básico a um sistema completo com Next.js, NestJS, PostgreSQL, RLS, autenticação e deploy. Registre o que aprendeu, o que ainda quer aprofundar e monte um plano para os próximos 90 dias: contribuir com projetos open source, fazer um projeto novo e manter a rotina de revisão com flashcards.",
    [
      "Registre o que aprendeu e o que quer aprofundar.",
      "Monte um plano de 90 dias com metas pequenas e mensuráveis.",
      "Mantenha a rotina de revisão com flashcards.",
    ],
    [
      "Escrever uma carta para si mesmo sobre o que aprendeu no curso",
      "Montar o plano dos próximos 90 dias com metas mensuráveis",
      "Publicar o sistema final e compartilhar o link com alguém",
    ],
    [
      "Como manter o aprendizado depois do curso?",
      "Construindo projetos novos, contribuindo com projetos abertos, mantendo a revisão espaçada e ensinando ou documentando o que aprende.",
    ],
    [
      "Dias do plano",
      "Escreva diasRestantes(hoje, fim) que recebe duas datas ISO (AAAA-MM-DD) e retorna quantos dias faltam de hoje até fim (0 se já passou).",
      "Subtraia as datas em milissegundos e converta para dias com Math.ceil.",
      "function diasRestantes(hoje, fim) {\n  const diferenca = new Date(fim).getTime() - new Date(hoje).getTime();\n  return Math.max(0, Math.ceil(diferenca / (24 * 60 * 60 * 1000)));\n}\n",
      "function diasRestantes(hoje, fim) {\n  \n}\n",
    ],
  ),
];
