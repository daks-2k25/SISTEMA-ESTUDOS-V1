import { evaluation, lesson } from "./helpers";
import type { DayContext, SeedDay } from "./types";

const CONTEXT: DayContext = {
  sectionTitle: "Seção 3 — TypeScript",
  moduleTitle: "TypeScript",
};

export const secao03Typescript: SeedDay[] = [
  lesson(
    CONTEXT,
    "TypeScript: tipos básicos",
    "TypeScript é JavaScript com tipagem estática: os tipos são verificados na compilação e apagados no resultado. Anote string, number, boolean, arrays (string[]) e tuplas, deixe o compilador inferir o restante e ative strict no tsconfig. Prefira unknown a any e uniões de literais a enums.",
    [
      "Os tipos existem só na compilação e são apagados depois.",
      "Anote parâmetros e retornos; deixe o resto ser inferido.",
      "Evite any; prefira unknown e valide antes de usar.",
    ],
    [
      "Instalar o TypeScript e criar um tsconfig com strict ativado",
      "Tipar 5 funções do módulo de JavaScript",
      "Trocar um any por unknown e escrever o narrowing necessário",
    ],
    [
      "Qual a diferença entre any e unknown?",
      "any desliga a checagem de tipos; unknown aceita qualquer valor mas obriga a verificar o tipo antes de usar.",
    ],
    [
      "Descrever o tipo",
      "Escreva descreverValor(valor) que retorna 'texto' para string, 'numero' para number, 'lista' para array e 'outro' nos demais casos.",
      "Cheque Array.isArray antes do typeof.",
      'function descreverValor(valor) {\n  if (Array.isArray(valor)) return "lista";\n  if (typeof valor === "string") return "texto";\n  if (typeof valor === "number") return "numero";\n  return "outro";\n}\n',
      "function descreverValor(valor) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Interfaces e type aliases",
    "interface e type descrevem a forma de objetos. interface é extensível com extends e pode ser mesclada; type também cria uniões, interseções e tuplas. Propriedades opcionais (?) incluem undefined no tipo e readonly impede reatribuição na compilação. Use esses contratos para tipar entidades como Tarefa e Flashcard.",
    [
      "interface descreve objetos e pode ser estendida.",
      "type também cria uniões, interseções e tuplas.",
      "Propriedades opcionais incluem undefined.",
    ],
    [
      "Modelar Tarefa e Flashcard com interfaces",
      "Criar um type de união para o status de uma tarefa",
      "Estender uma interface com extends",
    ],
    [
      "Quando usar interface e quando usar type?",
      "interface para contratos de objetos e classes; type para uniões, interseções, tuplas e tipos derivados.",
    ],
    [
      "Criar entidade",
      "Escreva criarTarefa(titulo) que retorna { titulo, concluida: false, criadaEm } com criadaEm sendo a data atual em ISO.",
      "Use new Date().toISOString().",
      "function criarTarefa(titulo) {\n  return { titulo, concluida: false, criadaEm: new Date().toISOString() };\n}\n",
      "function criarTarefa(titulo) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Uniões e narrowing",
    "Uma união (A | B) aceita mais de um tipo. O narrowing refina o tipo dentro de verificações com typeof, instanceof, in e igualdade. Uniões discriminadas, com uma propriedade literal em comum, permitem um switch exaustivo com never no default. Type predicates (valor is Tipo) criam guards reutilizáveis.",
    [
      "Uniões aceitam mais de um tipo; narrowing escolhe qual.",
      "Uniões discriminadas e switch exaustivo evitam casos esquecidos.",
      "Type predicates criam guards reutilizáveis.",
    ],
    [
      "Criar a união Forma = Circulo | Quadrado e uma função area",
      "Escrever um type guard ehTarefa(valor: unknown)",
      "Garantir exaustividade com never no default do switch",
    ],
    [
      "O que é uma união discriminada?",
      "Uma união de tipos com uma propriedade literal em comum (o discriminante), que permite ao compilador refinar o tipo em um switch ou if.",
    ],
    [
      "Área por tipo",
      "Escreva area(forma) que retorna a área de { tipo: 'circulo', raio } (PI * raio ao quadrado) ou de { tipo: 'quadrado', lado } (lado ao quadrado).",
      "Use um if ou switch sobre forma.tipo.",
      'function area(forma) {\n  if (forma.tipo === "circulo") return Math.PI * forma.raio ** 2;\n  return forma.lado ** 2;\n}\n',
      "function area(forma) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Genéricos",
    "Genéricos permitem escrever funções, tipos e classes reutilizáveis que preservam o tipo, usando parâmetros de tipo como T. Restrinja com extends (T extends { id: string }) e use keyof para chaves. Preferem-se genéricos a any sempre que existe relação entre o tipo de entrada e o de saída.",
    [
      "Genéricos preservam o tipo sem recorrer ao any.",
      "T extends restringe o que o parâmetro aceita.",
      "keyof T gera a união das chaves de um tipo.",
    ],
    [
      "Escrever uma função genérica primeiro<T>(lista: T[])",
      "Criar a interface genérica Resultado<T> com sucesso e erro",
      "Restringir um genérico para exigir a propriedade id",
    ],
    [
      "Para que servem os genéricos?",
      "Para criar código reutilizável que mantém a relação entre os tipos de entrada e saída, sem perder segurança como acontece com any.",
    ],
    [
      "Encontrar por id",
      "Escreva buscarPorId(lista, id) que retorna o item cujo id é igual ao informado, ou null se não existir.",
      "find com ?? null.",
      "function buscarPorId(lista, id) {\n  return lista.find((item) => item.id === id) ?? null;\n}\n",
      "function buscarPorId(lista, id) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Utility types",
    "Tipos utilitários derivam novos tipos de um existente: Partial (tudo opcional), Required, Pick e Omit (selecionar ou remover chaves), Record (dicionário), Readonly, ReturnType, Parameters e Awaited. Eles evitam duplicação e mantêm os tipos sincronizados com a fonte, como em Omit<Tarefa, 'id'> para criar uma nova tarefa.",
    [
      "Partial, Pick, Omit e Record cobrem a maioria dos casos.",
      "Derive tipos em vez de duplicar definições.",
      "Awaited e ReturnType extraem tipos de funções e Promises.",
    ],
    [
      "Criar os tipos NovaTarefa, AtualizarTarefa e TarefaPublica",
      "Tipar um dicionário de configurações com Record",
      "Extrair o tipo retornado por uma função async",
    ],
    [
      "Qual a diferença entre Pick e Omit?",
      "Pick mantém apenas as chaves informadas; Omit mantém todas exceto as informadas.",
    ],
    [
      "Aplicar atualização parcial",
      "Escreva aplicarAtualizacao(original, parcial) que retorna um novo objeto com os campos de original sobrescritos pelos de parcial, como faria um Partial. Não altere o original.",
      "Spread dos dois objetos em um literal novo.",
      "function aplicarAtualizacao(original, parcial) {\n  return { ...original, ...parcial };\n}\n",
      "function aplicarAtualizacao(original, parcial) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Marco: tipar o modelo e implementar o SM-2",
    "Marco da seção: tipar o modelo de dados do sistema de estudos (StudyDay, Flashcard, DailyChallenge) e implementar o algoritmo SM-2 de repetição espaçada como função pura. O SM-2 recebe o cartão e a nota (1 a 4) e devolve o novo intervalo, fator de facilidade, repetições e próxima data. Escreva testes para os casos principais.",
    [
      "Modele as entidades com interfaces antes de codar a lógica.",
      "O SM-2 é uma função pura: recebe cartão e nota, devolve o novo estado.",
      "Testes cobrem acerto, erro, piso do fator de facilidade e sequência 1, 6, n.",
    ],
    [
      "Definir as interfaces Flashcard e ResultadoDeRevisao",
      "Implementar calcularProximaRevisao(cartao, nota, agora)",
      "Testar as quatro notas e o piso de 1.3 do fator de facilidade",
    ],
    [
      "Por que o SM-2 deve receber a data atual por parâmetro?",
      "Para ser uma função pura e determinística, fácil de testar, sem depender do relógio do sistema.",
    ],
    [
      "Próximo intervalo simples",
      "Escreva proximoIntervalo(repeticoes, intervaloAtual, facilidade) que retorna 1 se repeticoes for 0, 6 se for 1 e Math.round(intervaloAtual * facilidade) nos demais casos.",
      "Três ramos: repetições 0, 1 e maiores.",
      "function proximoIntervalo(repeticoes, intervaloAtual, facilidade) {\n  if (repeticoes === 0) return 1;\n  if (repeticoes === 1) return 6;\n  return Math.round(intervaloAtual * facilidade);\n}\n",
      "function proximoIntervalo(repeticoes, intervaloAtual, facilidade) {\n  \n}\n",
    ],
  ),
  evaluation(
    CONTEXT,
    "Avaliação da Seção 3: TypeScript",
    "Avaliação da seção cobrindo tipos básicos, interfaces e type, uniões e narrowing, genéricos, utility types e o modelo tipado do sistema. Meta: nota 85; mínimo 70 para avançar para React.",
    [
      "A avaliação cobre as Aulas 27 a 32.",
      "Meta de nota 85; mínimo 70.",
      "Refaça os tópicos fracos antes de ir para React.",
    ],
    [
      "O que o modo strict do TypeScript garante?",
      "Ativa checagens rigorosas (strictNullChecks, noImplicitAny etc.), evitando erros comuns como acessar valores possivelmente nulos.",
    ],
  ),
];
