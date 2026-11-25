import { evaluation, lesson, review } from "./helpers";
import type { DayContext, SeedDay } from "./types";

const CONTEXT: DayContext = {
  sectionTitle: "Seção 4 — React com TypeScript",
  moduleTitle: "React com TypeScript",
};

export const secao04ReactTypescript: SeedDay[] = [
  lesson(
    CONTEXT,
    "Componentes e JSX/TSX",
    "Componentes React são funções que recebem props e retornam JSX, uma sintaxe parecida com HTML compilada para JavaScript (TSX quando usa TypeScript). O nome do componente começa com maiúscula, expressões JavaScript entram entre chaves, atributos usam camelCase (className, onClick) e o retorno precisa de uma única raiz ou de um Fragment.",
    [
      "Componentes são funções que retornam JSX.",
      "Nomes de componentes começam com letra maiúscula.",
      "Expressões JavaScript entram entre chaves no JSX.",
    ],
    [
      "Criar um projeto React com TypeScript usando Vite",
      "Criar o componente Cartao que renderiza título e texto",
      "Usar Fragment e um operador ternário no JSX",
    ],
    [
      "Por que componentes precisam começar com maiúscula?",
      "Porque o JSX diferencia tags HTML nativas (minúsculas) de componentes (maiúsculas).",
    ],
    [
      "Criar elemento",
      "Escreva criarElemento(tipo, props, ...filhos) que retorna { tipo, props: { ...props, filhos } }, imitando o que o JSX gera.",
      "Use spread nas props e rest para os filhos.",
      "function criarElemento(tipo, props, ...filhos) {\n  return { tipo, props: { ...props, filhos } };\n}\n",
      "function criarElemento(tipo, props, ...filhos) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Props e composição",
    "Props são os argumentos de um componente: fluem do pai para o filho e são somente leitura. A prop children permite compor componentes, deixando o pai decidir o conteúdo interno. Tipe as props com uma interface, use valores padrão na desestruturação e prefira composição a herança.",
    [
      "Props fluem do pai para o filho e são imutáveis.",
      "children permite compor componentes.",
      "Tipe as props com interface e defina padrões na desestruturação.",
    ],
    [
      "Criar um Botao com as props variante e desabilitado tipadas",
      "Criar um Card que aceita children",
      "Passar uma função como prop (callback) do pai para o filho",
    ],
    [
      "Um componente pode alterar as próprias props?",
      "Não. Props são somente leitura; para dados mutáveis use estado ou peça ao pai, via callback, para alterar.",
    ],
    [
      "Mesclar props padrão",
      "Escreva comPropsPadrao(props, padrao) que retorna um objeto com os padrões sobrescritos pelas props cujo valor não seja undefined.",
      "Filtre as entradas com valor undefined antes de mesclar.",
      "function comPropsPadrao(props, padrao) {\n  const definidas = Object.fromEntries(\n    Object.entries(props).filter(([, valor]) => valor !== undefined),\n  );\n  return { ...padrao, ...definidas };\n}\n",
      "function comPropsPadrao(props, padrao) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "useState",
    "useState guarda um valor que, ao mudar, faz o componente renderizar de novo. O setter agenda a atualização e não altera a variável imediatamente. Use a forma funcional quando o novo valor depende do anterior e nunca mute objetos ou arrays do estado: crie cópias com spread, map e filter.",
    [
      "Alterar o estado agenda uma nova renderização.",
      "Use setX(anterior => ...) quando depender do valor anterior.",
      "Nunca mute objetos ou arrays do estado.",
    ],
    [
      "Criar um contador com incrementar, decrementar e zerar",
      "Adicionar e remover itens de uma lista guardada no estado",
      "Atualizar um objeto no estado sem mutá-lo",
    ],
    [
      "Por que setContador(c + 1) três vezes seguidas só soma 1?",
      "Porque c é o valor capturado na renderização atual. Use a forma funcional setContador(c => c + 1) para encadear as atualizações.",
    ],
    [
      "Remover item imutável",
      "Escreva removerItem(lista, id) que retorna uma nova lista sem o item de determinado id, sem alterar a original.",
      "Use filter.",
      "function removerItem(lista, id) {\n  return lista.filter((item) => item.id !== id);\n}\n",
      "function removerItem(lista, id) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "useEffect",
    "useEffect sincroniza o componente com sistemas externos: requisições, timers, listeners. O array de dependências define quando o efeito roda e a função retornada limpa o efeito anterior. Evite efeitos para valores que podem ser calculados na renderização; em desenvolvimento o Strict Mode executa efeitos duas vezes para expor limpezas ausentes.",
    [
      "useEffect sincroniza o componente com sistemas externos.",
      "O array de dependências controla quando o efeito roda.",
      "Sempre limpe timers, listeners e assinaturas.",
    ],
    [
      "Criar um relógio com setInterval e função de limpeza",
      "Atualizar o título da aba com useEffect",
      "Remover um efeito desnecessário calculando o valor na renderização",
    ],
    [
      "Para que serve a função retornada por um useEffect?",
      "É a limpeza (cleanup): roda antes do próximo efeito e quando o componente desmonta, removendo timers, listeners e assinaturas.",
    ],
    [
      "Debounce",
      "Escreva debounce(funcao, espera) que retorna uma função que só chama funcao após espera milissegundos sem novas chamadas.",
      "Guarde o id do setTimeout na closure e use clearTimeout a cada chamada.",
      "function debounce(funcao, espera) {\n  let temporizador;\n  return (...argumentos) => {\n    clearTimeout(temporizador);\n    temporizador = setTimeout(() => funcao(...argumentos), espera);\n  };\n}\n",
      "function debounce(funcao, espera) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Listas e key",
    "Para renderizar listas use map e dê a cada item uma key estável e única, normalmente o id. A key permite ao React identificar o que mudou; usar o índice quebra o estado dos itens quando a lista é reordenada ou filtrada. Para condicionais use ternário, && ou retorno antecipado, cuidando para não renderizar 0 sem querer.",
    [
      "Cada item de uma lista precisa de uma key estável e única.",
      "Evite o índice como key em listas dinâmicas.",
      "Use ternário, && ou retorno antecipado para condicionais.",
    ],
    [
      "Renderizar a lista de tarefas com key baseada no id",
      "Mostrar uma mensagem de lista vazia",
      "Reproduzir o bug de key por índice reordenando itens com inputs",
    ],
    [
      "Por que a key não deve ser o índice?",
      "Porque, ao reordenar, filtrar ou inserir, o índice muda e o React associa o estado ao item errado.",
    ],
    [
      "Filtrar tarefas por status",
      "Escreva filtrarPorStatus(tarefas, status) em que status é 'todas', 'abertas' ou 'concluidas' e cada tarefa tem o campo concluida.",
      "Use filter com um teste para cada status.",
      "function filtrarPorStatus(tarefas, status) {\n  if (status === \"abertas\") return tarefas.filter((t) => !t.concluida);\n  if (status === \"concluidas\") return tarefas.filter((t) => t.concluida);\n  return tarefas;\n}\n",
      "function filtrarPorStatus(tarefas, status) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Formulários controlados",
    "Em um formulário controlado, o valor do input vem do estado e é atualizado em onChange, deixando o React como fonte da verdade. Use preventDefault no submit, tipe os eventos (React.ChangeEvent, React.FormEvent) e valide os dados com Zod antes de enviar, exibindo erros por campo.",
    [
      "Inputs controlados leem value do estado e atualizam em onChange.",
      "Use preventDefault no onSubmit.",
      "Valide com Zod e exiba erros por campo.",
    ],
    [
      "Criar um formulário de nova tarefa com input controlado",
      "Validar título e minutos com um schema Zod",
      "Escrever um handler genérico baseado em event.target.name",
    ],
    [
      "O que é um componente controlado?",
      "Um campo cujo valor é controlado pelo estado do React: value vem do estado e cada mudança atualiza o estado via onChange.",
    ],
    [
      "Atualizar campo por nome",
      "Escreva atualizarCampo(formulario, nome, valor) que retorna uma cópia do formulário com o campo nome atualizado.",
      "Spread com chave computada.",
      "function atualizarCampo(formulario, nome, valor) {\n  return { ...formulario, [nome]: valor };\n}\n",
      "function atualizarCampo(formulario, nome, valor) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Estado compartilhado: Context e useReducer",
    "Quando vários componentes precisam do mesmo estado, eleve-o ao ancestral comum ou use Context para evitar prop drilling. useReducer centraliza transições complexas em uma função pura reducer(estado, acao), facilitando testes. Divida contextos para não renderizar toda a árvore a cada mudança.",
    [
      "Eleve o estado ao ancestral comum mais próximo.",
      "Context evita prop drilling para dados globais.",
      "O reducer é uma função pura (estado, ação) => novoEstado.",
    ],
    [
      "Criar um ThemeContext com provider e hook useTheme",
      "Implementar o checklist do dia com useReducer",
      "Separar o contexto de estado do contexto de dispatch",
    ],
    [
      "O que é prop drilling e como o Context o resolve?",
      "É passar props por vários componentes que não as usam. O Context disponibiliza o valor a qualquer descendente via useContext.",
    ],
    [
      "Reducer do checklist",
      "Escreva reducerChecklist(tarefas, acao) tratando { tipo: 'alternar', id } (inverte feita), { tipo: 'adicionar', tarefa } e { tipo: 'remover', id }. Retorne sempre um novo array.",
      "Switch sobre acao.tipo usando map, spread e filter.",
      "function reducerChecklist(tarefas, acao) {\n  switch (acao.tipo) {\n    case \"alternar\":\n      return tarefas.map((t) => (t.id === acao.id ? { ...t, feita: !t.feita } : t));\n    case \"adicionar\":\n      return [...tarefas, acao.tarefa];\n    case \"remover\":\n      return tarefas.filter((t) => t.id !== acao.id);\n    default:\n      return tarefas;\n  }\n}\n",
      "function reducerChecklist(tarefas, acao) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Busca de dados no cliente",
    "Em aplicações React puras, a busca de dados acontece em useEffect com fetch, controlando três estados: carregando, erro e sucesso. Cancele requisições obsoletas com AbortController, trate respostas não ok e extraia a lógica para um hook customizado (useFetch) tipado com genéricos para reutilizar em várias telas.",
    [
      "Controle os estados de carregando, erro e sucesso.",
      "Cancele requisições obsoletas com AbortController.",
      "Extraia a lógica para um hook customizado tipado.",
    ],
    [
      "Buscar dados de uma API em useEffect com estados de loading e erro",
      "Cancelar a requisição ao desmontar o componente",
      "Extrair um hook useFetch genérico",
    ],
    [
      "Por que cancelar requisições em useEffect?",
      "Para evitar atualizar estado de componentes desmontados e respostas fora de ordem quando as dependências mudam rápido.",
    ],
    [
      "Estado de requisição",
      "Escreva estadoDaRequisicao({ carregando, erro, dados }) que retorna 'carregando' se carregando for true, 'erro' se houver erro, 'vazio' se dados for lista vazia e 'pronto' nos demais casos.",
      "Teste na ordem: carregando, erro, vazio.",
      "function estadoDaRequisicao({ carregando, erro, dados }) {\n  if (carregando) return \"carregando\";\n  if (erro) return \"erro\";\n  if (Array.isArray(dados) && dados.length === 0) return \"vazio\";\n  return \"pronto\";\n}\n",
      "function estadoDaRequisicao(estado) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Refs, memoização e hooks customizados",
    "useRef guarda valores mutáveis sem re-renderizar e dá acesso ao DOM; useMemo e useCallback memoizam valores e funções e só valem quando há custo medido ou filhos memoizados. Hooks customizados (useLocalStorage, useDebounce) extraem lógica com estado para reuso e seguem as regras dos hooks: só no topo, nunca em condições.",
    [
      "useRef persiste valores sem causar renderização.",
      "Memoização só vale quando há custo medido.",
      "Hooks customizados começam com use e seguem as regras dos hooks.",
    ],
    [
      "Focar um input ao montar o componente com useRef",
      "Criar um hook useLocalStorage tipado com genéricos",
      "Medir uma renderização com o Profiler antes de memoizar",
    ],
    [
      "Dois componentes com o mesmo custom hook compartilham estado?",
      "Não. Cada chamada cria seu próprio estado; para compartilhar dados use Context ou eleve o estado.",
    ],
    [
      "Memoizar de um argumento",
      "Escreva memoizar(funcao) que guarda resultados em um Map e só chama funcao quando o argumento ainda não foi calculado.",
      "Use has, get e set em um Map dentro da closure.",
      "function memoizar(funcao) {\n  const cache = new Map();\n  return (argumento) => {\n    if (!cache.has(argumento)) cache.set(argumento, funcao(argumento));\n    return cache.get(argumento);\n  };\n}\n",
      "function memoizar(funcao) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Marco: painel de estudos em React",
    "Marco da seção: construir o painel de estudos em React com TypeScript. A tela mostra o dia, o checklist, as notas e os flashcards, com estado compartilhado via Context/useReducer e persistência no localStorage, reaproveitando os tipos e o SM-2 da seção anterior. Separe componentes de interface das funções puras de regra e escreva testes para os reducers.",
    [
      "Reaproveite tipos e funções puras das seções anteriores.",
      "Mantenha regras fora dos componentes.",
      "Teste os reducers e as funções puras.",
    ],
    [
      "Montar as telas do dia, checklist e notas em componentes pequenos",
      "Ligar o estado compartilhado ao localStorage",
      "Escrever testes para o reducer do checklist",
    ],
    [
      "Por que manter regras fora dos componentes?",
      "Funções puras são fáceis de testar e reaproveitar; os componentes ficam apenas com a apresentação.",
    ],
    [
      "Resumo do painel",
      "Escreva resumoDoPainel(dias) que recebe objetos { concluido } e retorna { total, concluidos, restantes }.",
      "Conte os concluídos com filter.",
      "function resumoDoPainel(dias) {\n  const concluidos = dias.filter((dia) => dia.concluido).length;\n  return { total: dias.length, concluidos, restantes: dias.length - concluidos };\n}\n",
      "function resumoDoPainel(dias) {\n  \n}\n",
    ],
  ),
  evaluation(
    CONTEXT,
    "Avaliação da Seção 4: React com TypeScript",
    "Avaliação da seção cobrindo componentes, props, useState, useEffect, listas e key, formulários, estado compartilhado, busca de dados, hooks customizados e o painel de estudos. Meta: nota 85; mínimo 70 para avançar para Next.js.",
    [
      "A avaliação cobre as Aulas 33 a 42.",
      "Meta de nota 85; mínimo 70.",
      "Refaça os tópicos fracos antes de ir para Next.js.",
    ],
    [
      "Qual a regra de ouro para atualizar estado de objetos e arrays?",
      "Nunca mutar: crie novas cópias (spread, map, filter) e passe ao setter.",
    ],
  ),
  review(
    CONTEXT,
    "Revisão da Seção 4",
    "Revise a seção reconstruindo, do zero e sem consultar, uma lista de tarefas completa com formulário, estado compartilhado e busca de dados. Explique em voz alta quando cada hook é necessário, revise os flashcards vencidos e transforme em flashcards novos tudo o que travou durante a reconstrução.",
    [
      "Reconstruir do zero revela as lacunas reais.",
      "Saiba explicar quando cada hook é necessário.",
      "Transforme cada travada em um flashcard.",
    ],
    [
      "Refazer uma lista de tarefas completa sem consultar a solução",
      "Revisar os flashcards vencidos da Seção 4",
      "Anotar três lacunas e criar flashcards para elas",
    ],
    [
      "Quando um efeito é realmente necessário?",
      "Quando é preciso sincronizar com algo externo ao React (rede, timers, DOM). Valores derivados devem ser calculados na renderização.",
    ],
    [
      "Alternar item do checklist",
      "Escreva alternarTarefa(tarefas, id) que retorna uma nova lista com o campo feita invertido para a tarefa de determinado id.",
      "Use map com spread.",
      "function alternarTarefa(tarefas, id) {\n  return tarefas.map((tarefa) => (tarefa.id === id ? { ...tarefa, feita: !tarefa.feita } : tarefa));\n}\n",
      "function alternarTarefa(tarefas, id) {\n  \n}\n",
    ],
  ),
];
