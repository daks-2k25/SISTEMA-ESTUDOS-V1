import { fullDay, js, lines, py, sh } from "./helpers";
import type { DayContext, SeedDay } from "./types";

const SECTION = "Seção 1 — JavaScript";

const MODULE_1_1: DayContext = {
  sectionTitle: SECTION,
  moduleTitle: "Módulo 1.1 — Primeiros passos",
};

const MODULE_1_2: DayContext = {
  sectionTitle: SECTION,
  moduleTitle: "Módulo 1.2 — Fundamentos da linguagem",
};

const MODULE_1_3: DayContext = {
  sectionTitle: SECTION,
  moduleTitle: "Módulo 1.3 — Dados, erros e classes",
};

const MODULE_1_4: DayContext = {
  sectionTitle: SECTION,
  moduleTitle: "Módulo 1.4 — Código assíncrono",
};

const REVIEW_1: DayContext = {
  sectionTitle: SECTION,
  moduleTitle: "Revisão da Seção 1",
};

export const secao01Javascript: SeedDay[] = [
  fullDay("AULA", MODULE_1_1, {
    topicTitle: "O que é JavaScript e onde roda",
    summaryContent: lines(
      "## O que é JavaScript",
      "JavaScript é a linguagem de programação da web. Ela nasceu para dar vida às páginas no navegador e hoje também roda no servidor com o **Node.js**. A especificação oficial se chama **ECMAScript** (ES2015, ES2020...) e cada motor a implementa: o **V8** (Chrome e Node), o SpiderMonkey (Firefox) e o JavaScriptCore (Safari).",
      "### Onde o JavaScript roda",
      "- **Navegador:** manipula a página (DOM), responde a cliques, faz requisições.\n- **Node.js:** executa fora do navegador, acessa arquivos, rede e banco, e permite construir APIs.\n- Outros ambientes: Deno, Bun, apps desktop (Electron) e mobile (React Native).",
      "### Ponte Python → JavaScript",
      "Se você vem do Python, muita coisa é familiar: linguagens interpretadas, tipagem dinâmica e funções como valores. As diferenças que mais surpreendem no começo: blocos usam **chaves** em vez de indentação, instruções terminam com `;` (opcional, mas recomendado), e o programa roda em **uma única thread** com um *event loop*.",
      py(`
nome = "Ana"
print("Olá,", nome)
`),
      js(`
const nome = "Ana";
console.log("Olá,", nome);
`),
      "### Armadilhas comuns",
      "- JavaScript **não** é Java: só o nome é parecido.\n- O mesmo código pode se comportar diferente no navegador e no Node (existe `window` num, `process` no outro).\n- Tudo o que você aprender de ECMAScript vale nos dois ambientes.",
    ),
    keyTakeaways: [
      "JavaScript roda no navegador e no servidor (Node.js).",
      "ECMAScript é a especificação; V8 é um dos motores que a executa.",
      "Blocos usam chaves e a execução é de uma única thread.",
    ],
    tasks: [
      "Abrir o DevTools do navegador e digitar console.log('Olá') no Console",
      "Escrever em um papel as diferenças entre navegador e Node.js",
      "Listar 3 semelhanças e 3 diferenças entre Python e JavaScript",
    ],
    flashcards: [
      {
        question: "O que é ECMAScript?",
        answer:
          "É a especificação padrão da linguagem. JavaScript é a implementação dessa especificação nos motores como V8, SpiderMonkey e JavaScriptCore.",
      },
      {
        question: "Quais são os dois principais ambientes onde JavaScript roda?",
        answer:
          "No navegador (acesso ao DOM e a APIs web) e no Node.js (acesso a arquivos, rede e sistema operacional, sem DOM).",
      },
      {
        question: "Qual a diferença visual mais evidente entre Python e JavaScript?",
        answer:
          "Python delimita blocos por indentação; JavaScript usa chaves { } e normalmente termina instruções com ponto e vírgula.",
        codeExample: js(`
if (idade >= 18) {
  console.log("maior de idade");
}
`),
      },
    ],
    challenges: [
      {
        title: "Seu primeiro script",
        description:
          "Escreva a função saudacao(nome) que retorna a frase 'Olá, <nome>! Bem-vindo ao JavaScript.'.",
        starterCode: "function saudacao(nome) {\n  \n}\n",
        hint: "Concatene as partes com + ou use template literal.",
        solutionCode:
          'function saudacao(nome) {\n  return "Olá, " + nome + "! Bem-vindo ao JavaScript.";\n}\n',
      },
    ],
  }),
  fullDay("AULA", MODULE_1_1, {
    topicTitle: "Instalando VS Code e Node",
    summaryContent: lines(
      "## Preparando o ambiente",
      "Você precisa de duas ferramentas: o **VS Code** (editor) e o **Node.js** (runtime). Instale a versão **LTS** do Node, que traz também o **npm**, o gerenciador de pacotes. Depois confira no terminal:",
      sh(`
node -v
npm -v
`),
      "### Rodando seu primeiro arquivo",
      "Crie `ola.js` e execute com `node ola.js`. O comando `node` sozinho abre o **REPL**, um console interativo para testar expressões rapidamente.",
      js(`
const linguagem = "JavaScript";
console.log("Rodando " + linguagem + " no Node");
console.log(process.argv.length);
`),
      "### Extensões úteis no VS Code",
      "ESLint (aponta problemas), Prettier (formata o código), e o terminal integrado (`Ctrl+'`) para não sair do editor.",
      "### Ponte Python → JavaScript",
      "Em vez de `python arquivo.py`, você roda `node arquivo.js`. O `pip` vira o **npm**; o ambiente virtual (`venv`) vira a pasta **node_modules** dentro do projeto, e o `requirements.txt` vira o **package.json**.",
      py(`
pip install requests
`),
      sh(`
npm install axios
`),
      "### Armadilhas comuns",
      "- Instalar uma versão antiga do Node e depois não achar recursos modernos: use sempre a LTS atual.\n- Rodar o comando na pasta errada: `node ola.js` precisa estar na pasta do arquivo.\n- Nunca versione a pasta `node_modules`.",
    ),
    keyTakeaways: [
      "Instale o Node.js na versão LTS; o npm vem junto.",
      "node arquivo.js executa um script; node sozinho abre o REPL.",
      "package.json e node_modules fazem o papel de requirements.txt e venv.",
    ],
    tasks: [
      "Instalar VS Code e Node.js LTS e conferir node -v e npm -v",
      "Criar a pasta curso-js com um arquivo ola.js e executá-lo",
      "Abrir o REPL com node e testar 3 expressões",
      "Instalar as extensões ESLint e Prettier no VS Code",
    ],
    flashcards: [
      {
        question: "Para que serve o npm?",
        answer:
          "É o gerenciador de pacotes do Node: instala, atualiza e remove dependências e executa scripts definidos no package.json.",
      },
      {
        question: "Como executar um arquivo JavaScript com o Node?",
        answer: "Com o comando node nome-do-arquivo.js no terminal, dentro da pasta do arquivo.",
        codeExample: sh(`
node ola.js
`),
      },
      {
        question: "Qual o equivalente do requirements.txt do Python no mundo Node?",
        answer: "O arquivo package.json, que lista dependências e scripts; o package-lock.json fixa as versões exatas.",
      },
    ],
    challenges: [
      {
        title: "Ler argumentos do terminal",
        description:
          "Escreva argumentosDoUsuario(argv) que recebe o array process.argv e retorna apenas os argumentos passados pelo usuário, ignorando os dois primeiros (caminho do node e do script).",
        starterCode: "function argumentosDoUsuario(argv) {\n  \n}\n",
        hint: "Os dois primeiros itens de process.argv são do sistema. Use slice(2).",
        solutionCode: "function argumentosDoUsuario(argv) {\n  return argv.slice(2);\n}\n",
      },
    ],
  }),
  fullDay("AULA", MODULE_1_1, {
    topicTitle: "Console e depuração",
    summaryContent: lines(
      "## Conhecendo o console",
      "O objeto `console` é seu principal aliado. Além de `console.log`, existem `console.error` (erros), `console.warn` (avisos), `console.table` (tabelas para arrays e objetos) e `console.time`/`console.timeEnd` (medir tempo).",
      js(`
const alunos = [
  { nome: "Ana", nota: 9 },
  { nome: "Bia", nota: 7 },
];

console.table(alunos);
console.time("calculo");
const media = alunos.reduce((soma, aluno) => soma + aluno.nota, 0) / alunos.length;
console.timeEnd("calculo");
console.error("Isto aparece como erro");
`),
      "### Depurando de verdade",
      "Imprimir valores ajuda, mas o **depurador** é mais poderoso. No VS Code, clique ao lado do número da linha para criar um **breakpoint** e rode com F5. Você pode avançar linha a linha (F10), entrar em funções (F11) e inspecionar variáveis. A palavra-chave `debugger` pausa a execução quando o DevTools está aberto.",
      "### Lendo uma mensagem de erro",
      "Leia sempre de **cima para baixo**: o tipo do erro (`TypeError`, `ReferenceError`, `SyntaxError`), a mensagem e a linha onde ocorreu. A *stack trace* mostra o caminho das chamadas até o problema.",
      "### Ponte Python → JavaScript",
      "`print()` vira `console.log()`, e o `pdb` do Python equivale ao depurador do VS Code com breakpoints. Os tracebacks do Python e as stack traces do JavaScript têm a mesma função, só em ordem diferente: o JS mostra o ponto do erro **no topo**.",
      "### Avaliação do Módulo 1.1",
      "Hoje você também faz a **Avaliação do Módulo 1.1**. Meta: nota 85; nota mínima: 70.",
    ),
    keyTakeaways: [
      "console.table e console.time ajudam muito além do console.log.",
      "Breakpoints e o depurador mostram o estado do programa linha a linha.",
      "Leia o erro de cima para baixo: tipo, mensagem e linha.",
      "A avaliação do Módulo 1.1 pede nota mínima 70 e meta 85.",
    ],
    tasks: [
      "Usar console.table em um array de objetos",
      "Criar um breakpoint no VS Code e avançar com F10 e F11",
      "Provocar um TypeError de propósito e ler a stack trace",
      "Fazer a Avaliação do Módulo 1.1 (meta: nota 85, mínimo 70)",
    ],
    flashcards: [
      {
        question: "Para que serve console.table?",
        answer: "Mostra arrays e objetos como uma tabela organizada no console, facilitando comparar valores.",
        codeExample: js(`
console.table([{ id: 1, nome: "Ana" }]);
`),
      },
      {
        question: "O que é um breakpoint?",
        answer: "Um ponto marcado no código onde o depurador pausa a execução para você inspecionar variáveis e avançar passo a passo.",
      },
      {
        question: "Como ler uma stack trace?",
        answer: "O topo mostra o tipo e a mensagem do erro e o arquivo/linha onde ocorreu; as linhas abaixo mostram as chamadas anteriores que levaram até ele.",
      },
    ],
    challenges: [
      {
        title: "Depurar a soma",
        description:
          "A função somar(valores) deveria retornar a soma dos números do array, mas devolve NaN. Encontre e corrija o bug usando o depurador.",
        starterCode:
          "function somar(valores) {\n  let total;\n  for (const valor of valores) {\n    total += valor;\n  }\n  return total;\n}\n",
        hint: "Qual é o valor de total antes do primeiro laço? undefined + número é NaN.",
        solutionCode:
          "function somar(valores) {\n  let total = 0;\n  for (const valor of valores) {\n    total += valor;\n  }\n  return total;\n}\n",
      },
    ],
  }),
  fullDay("AULA", MODULE_1_2, {
    topicTitle: "let, const, tipos, decimais e toFixed",
    summaryContent: lines(
      "## Variáveis e tipos",
      "Use **`const`** por padrão e **`let`** quando precisar reatribuir. Evite `var`. Os tipos primitivos são `string`, `number`, `bigint`, `boolean`, `undefined`, `null` e `symbol`; todo o resto é objeto. Descubra o tipo com `typeof`.",
      js(`
const nome = "Ana";
let idade = 29;
idade = 30;

console.log(typeof nome);
console.log(typeof idade);
console.log(typeof null);
console.log(typeof undefined);
`),
      "### Números e decimais",
      "Só existe um tipo numérico para inteiros e decimais: `number` (ponto flutuante de 64 bits). Por isso `0.1 + 0.2` não dá exatamente `0.3`. Para exibir valores, use `toFixed(casas)`, que **retorna uma string**.",
      js(`
console.log(0.1 + 0.2);
console.log((0.1 + 0.2).toFixed(2));
console.log(typeof (12.5).toFixed(2));
console.log(Number("12.50") + 1);
console.log(Math.round(12.567 * 100) / 100);
`),
      "### Ponte Python → JavaScript",
      "Python separa `int` e `float` e tem `Decimal` para dinheiro. Em JavaScript tudo é `number`. Para valores monetários, trabalhe em **centavos** (inteiros) ou formate só na exibição.",
      py(`
preco = 12.5
print(f"{preco:.2f}")
`),
      js(`
const preco = 12.5;
console.log(preco.toFixed(2));
`),
      "### Armadilhas comuns",
      "- `toFixed` devolve texto: converta com `Number()` se for calcular depois.\n- `const` impede reatribuir, mas não impede alterar o conteúdo de um objeto.\n- `typeof null` é `\"object\"` (bug histórico).\n- Divisão por zero não lança erro: dá `Infinity`.",
    ),
    keyTakeaways: [
      "Prefira const; use let só quando precisar reatribuir.",
      "Existe um único tipo numérico (number) para inteiros e decimais.",
      "toFixed retorna uma string, não um número.",
      "Para dinheiro, trabalhe em centavos ou formate só na exibição.",
    ],
    tasks: [
      "Declarar variáveis dos 7 tipos primitivos e conferir cada typeof",
      "Reproduzir 0.1 + 0.2 e formatar o resultado com toFixed(2)",
      "Calcular o total de uma compra em centavos e exibir em reais",
    ],
    flashcards: [
      {
        question: "Quando usar const e quando usar let?",
        answer: "const por padrão, para valores que não serão reatribuídos; let apenas quando a variável precisa receber um novo valor.",
      },
      {
        question: "Por que 0.1 + 0.2 não é igual a 0.3 em JavaScript?",
        answer: "Porque o tipo number usa ponto flutuante binário (IEEE 754), que não representa todos os decimais com exatidão. Trabalhe em centavos ou compare com tolerância.",
        codeExample: js(`
console.log(0.1 + 0.2 === 0.3);
`),
      },
      {
        question: "O que toFixed(2) retorna?",
        answer: "Uma string com o número arredondado em 2 casas decimais. Converta com Number() se precisar calcular depois.",
        codeExample: js(`
console.log(typeof (3.14159).toFixed(2));
`),
      },
    ],
    challenges: [
      {
        title: "Missão da Aula 4: calculadora com let, const e toFixed",
        description:
          "Monte a calculadora da aula. Guarde os dois números em const, use let para o resultado de cada operação e mostre no console soma, subtração, multiplicação e divisão, sempre com 2 casas decimais (toFixed). Com 10 e 3, a divisão deve aparecer como 3.33.",
        starterCode: `const numero1 = 10;
const numero2 = 3;
let resultado;

`,
        hint: "Reaproveite a mesma variável let: atribua resultado = numero1 + numero2, mostre com resultado.toFixed(2) e repita para as outras operações.",
        solutionCode: `const numero1 = 10;
const numero2 = 3;
let resultado;

resultado = numero1 + numero2;
console.log("Soma:", resultado.toFixed(2));

resultado = numero1 - numero2;
console.log("Subtração:", resultado.toFixed(2));

resultado = numero1 * numero2;
console.log("Multiplicação:", resultado.toFixed(2));

resultado = numero1 / numero2;
console.log("Divisão:", resultado.toFixed(2));
`,
      },
    ],
  }),
  fullDay("AULA", MODULE_1_2, {
    topicTitle: "Funções, parâmetros, return e escopo",
    summaryContent: lines(
      "## Funções",
      "Funções agrupam código reutilizável. Podem ser declaradas com `function` ou guardadas em variáveis, e recebem **parâmetros** e devolvem valores com `return`. Sem `return`, o resultado é `undefined`.",
      js(`
function somar(a, b) {
  return a + b;
}

function saudar(nome = "visitante") {
  return "Olá, " + nome;
}

function somarTodos(...numeros) {
  return numeros.reduce((total, n) => total + n, 0);
}

console.log(somar(2, 3));
console.log(saudar());
console.log(somarTodos(1, 2, 3, 4));
`),
      "### Escopo",
      "Variáveis declaradas com `let` e `const` vivem no **bloco** `{ }` onde foram criadas. Uma função enxerga as variáveis do escopo onde foi **definida** (escopo léxico), mas não as de dentro de outras funções.",
      js(`
const taxa = 0.1;

function aplicarTaxa(valor) {
  const resultado = valor * (1 + taxa);
  return resultado;
}

console.log(aplicarTaxa(100));
console.log(typeof resultado);
`),
      "### Ponte Python → JavaScript",
      "`def` vira `function`, e o `return` funciona igual. Parâmetros nomeados do Python (`**kwargs`) viram, em JavaScript, **um objeto** recebido por desestruturação. `*args` vira o parâmetro *rest* (`...args`).",
      py(`
def somar_todos(*numeros):
    return sum(numeros)
`),
      "### Armadilhas comuns",
      "- Esquecer o `return` e receber `undefined`.\n- Chamar `somar(1)`: o segundo parâmetro é `undefined` e o resultado é `NaN`.\n- JavaScript aceita **qualquer** quantidade de argumentos, sem erro.\n- Declarações `function` são içadas (*hoisting*); `const f = () => {}` não.",
    ),
    keyTakeaways: [
      "Funções recebem parâmetros e devolvem valores com return.",
      "Parâmetros padrão e rest (...args) substituem muitos casos de *args e **kwargs.",
      "let e const têm escopo de bloco; funções enxergam o escopo onde foram definidas.",
      "Sem return, a função devolve undefined.",
    ],
    tasks: [
      "Escrever uma função com parâmetro padrão e outra com rest",
      "Provar que uma variável de bloco não existe fora dele",
      "Reescrever uma função em Python como função JavaScript",
    ],
    flashcards: [
      {
        question: "O que uma função sem return devolve?",
        answer: "undefined.",
      },
      {
        question: "Como receber um número variável de argumentos?",
        answer: "Com o parâmetro rest (...nome), que reúne os argumentos restantes em um array.",
        codeExample: js(`
function contar(...itens) {
  return itens.length;
}
`),
      },
      {
        question: "Qual o escopo de uma variável declarada com let ou const?",
        answer: "O bloco { } em que foi declarada. Fora dele ela não existe.",
      },
    ],
    challenges: [
      {
        title: "Missão da Aula 5: calculadora com funções",
        description:
          "Refaça a calculadora da Aula 4 usando funções. Crie somar, subtrair, multiplicar e dividir (cada uma recebe a e b e usa return) e uma função calcular(a, b, operacao) que escolhe a função certa para '+', '-', '*' ou '/' e devolve o resultado com 2 casas decimais. Divisão por zero e operação desconhecida devem retornar uma mensagem de erro.",
        starterCode: `function somar(a, b) {

}

function calcular(a, b, operacao) {

}

console.log(calcular(10, 3, "/"));
`,
        hint: "Cada função pequena faz uma conta só. Em calcular, use if/else para a operação e chame toFixed(2) apenas no final. Teste dividir por zero antes de dividir.",
        solutionCode: `function somar(a, b) {
  return a + b;
}

function subtrair(a, b) {
  return a - b;
}

function multiplicar(a, b) {
  return a * b;
}

function dividir(a, b) {
  return a / b;
}

function calcular(a, b, operacao) {
  if (operacao === "+") return somar(a, b).toFixed(2);
  if (operacao === "-") return subtrair(a, b).toFixed(2);
  if (operacao === "*") return multiplicar(a, b).toFixed(2);
  if (operacao === "/") {
    if (b === 0) return "Erro: divisão por zero";
    return dividir(a, b).toFixed(2);
  }
  return "Erro: operação inválida";
}

console.log(calcular(10, 3, "/"));
console.log(calcular(10, 0, "/"));
console.log(calcular(10, 3, "%"));
`,
      },
    ],
  }),
  fullDay("AULA", MODULE_1_2, {
    topicTitle: "if, switch e for",
    summaryContent: lines(
      "## Decisões e repetições",
      "Use `if / else if / else` para decidir, `switch` para muitas comparações de igualdade e laços `for` para repetir. Condições usam operadores de comparação (`===`, `!==`, `>`, `<=`) e lógicos (`&&`, `||`, `!`).",
      js(`
const nota = 82;

if (nota >= 85) {
  console.log("Meta atingida");
} else if (nota >= 70) {
  console.log("Aprovado");
} else {
  console.log("Revisar o módulo");
}

const dia = 3;
switch (dia) {
  case 1:
    console.log("Segunda");
    break;
  case 3:
    console.log("Quarta");
    break;
  default:
    console.log("Outro dia");
}
`),
      "### Os laços",
      js(`
for (let i = 1; i <= 3; i++) {
  console.log("Passo", i);
}

const tarefas = ["estudar", "praticar"];
for (const tarefa of tarefas) {
  console.log(tarefa);
}

let tentativas = 0;
while (tentativas < 3) {
  tentativas++;
}
`),
      "### Valores truthy e falsy",
      "Em condições, estes valores contam como **falso**: `false`, `0`, `\"\"`, `null`, `undefined` e `NaN`. Todo o resto é verdadeiro, inclusive `[]` e `{}` (diferente do Python, onde lista vazia é falsa).",
      "### Ponte Python → JavaScript",
      "`elif` vira `else if`; `for x in lista` vira `for (const x of lista)`; `for i in range(3)` vira o `for` clássico com contador. O `switch` lembra o `match` do Python, mas precisa de `break`.",
      py(`
for i in range(1, 4):
    print("Passo", i)
`),
      "### Armadilhas comuns",
      "- Esquecer o `break` no `switch` faz o código \"cair\" no case seguinte.\n- Usar `for...in` em arrays: ele percorre índices como texto. Prefira `for...of`.\n- Um array vazio é **truthy**: teste `lista.length === 0`.",
    ),
    keyTakeaways: [
      "if/else if/else decidem; switch compara igualdades; for e while repetem.",
      "Use for...of para percorrer arrays, não for...in.",
      "Array e objeto vazios são truthy em JavaScript.",
      "Todo case do switch precisa de break (ou return).",
    ],
    tasks: [
      "Escrever uma classificação de notas com if / else if / else",
      "Reescrever o mesmo exemplo usando switch",
      "Percorrer um array com for...of e com o for clássico",
    ],
    flashcards: [
      {
        question: "Como testar se um array está vazio em JavaScript?",
        answer: "Com lista.length === 0, porque um array vazio é truthy.",
        codeExample: js(`
if (lista.length === 0) {
  console.log("vazia");
}
`),
      },
      {
        question: "Qual a diferença entre for...of e for...in?",
        answer: "for...of percorre os valores de um iterável (arrays, strings); for...in percorre as chaves enumeráveis de um objeto (como texto).",
      },
      {
        question: "O que acontece se faltar o break em um case do switch?",
        answer: "A execução continua nos cases seguintes até encontrar um break ou o fim do switch (fall-through).",
      },
    ],
    challenges: [
      {
        title: "Missão da Aula 6: planejador de estudos da semana",
        description:
          "Crie planejarSemana(horasPorDia), que recebe 7 números (horas de estudo de domingo a sábado). Use for para percorrer os dias, switch para converter o número do dia no nome (0 = Domingo ... 6 = Sábado) e if para classificar: 0 hora = 'descanso', até 1 hora = 'revisão leve', mais de 1 hora = 'foco total'. Mostre uma linha por dia e, no fim, o total de horas da semana.",
        starterCode: `function nomeDoDia(numero) {

}

function planejarSemana(horasPorDia) {

}

planejarSemana([0, 2, 1, 2, 1, 3, 0.5]);
`,
        hint: "Em nomeDoDia, faça um case para cada número com return (assim não precisa de break). Em planejarSemana, some as horas numa variável let total dentro do for.",
        solutionCode: `function nomeDoDia(numero) {
  switch (numero) {
    case 0: return "Domingo";
    case 1: return "Segunda";
    case 2: return "Terça";
    case 3: return "Quarta";
    case 4: return "Quinta";
    case 5: return "Sexta";
    case 6: return "Sábado";
    default: return "Dia inválido";
  }
}

function classificar(horas) {
  if (horas === 0) return "descanso";
  if (horas <= 1) return "revisão leve";
  return "foco total";
}

function planejarSemana(horasPorDia) {
  let total = 0;
  for (let dia = 0; dia < 7; dia++) {
    const horas = horasPorDia[dia];
    total += horas;
    console.log(nomeDoDia(dia) + ": " + horas + "h (" + classificar(horas) + ")");
  }
  console.log("Total da semana: " + total + "h");
}

planejarSemana([0, 2, 1, 2, 1, 3, 0.5]);
`,
      },
    ],
  }),
  fullDay("AULA", MODULE_1_2, {
    topicTitle: "Arrow functions e closures",
    summaryContent: lines(
      "## Arrow functions",
      "Arrow functions têm sintaxe curta e são ideais para callbacks. Com uma expressão e sem chaves, o retorno é implícito. Elas **não têm `this` próprio**: herdam o do escopo onde foram criadas.",
      js(`
const dobro = (n) => n * 2;
const somar = (a, b) => a + b;
const criarUsuario = (nome) => ({ nome, ativo: true });

console.log([1, 2, 3].map((n) => n * 2));
`),
      "### Closures",
      "Uma **closure** é uma função que lembra as variáveis do escopo onde nasceu, mesmo depois que esse escopo terminou. É assim que se cria **estado privado** sem classes.",
      js(`
const criarContador = () => {
  let valor = 0;
  return () => {
    valor += 1;
    return valor;
  };
};

const contarCliques = criarContador();
console.log(contarCliques());
console.log(contarCliques());
`),
      "### Ponte Python → JavaScript",
      "`lambda x: x * 2` vira `(x) => x * 2`, com a vantagem de poder ter várias linhas. As closures do Python também existem, mas lá é preciso `nonlocal` para **alterar** a variável capturada; em JavaScript basta reatribuir.",
      py(`
def criar_contador():
    valor = 0
    def incrementar():
        nonlocal valor
        valor += 1
        return valor
    return incrementar
`),
      "### Armadilhas comuns",
      "- Retorno implícito de objeto exige parênteses: `() => ({ a: 1 })`.\n- Arrow functions não servem como métodos que dependem de `this` nem como construtores.\n- Closures mantêm referências vivas: caches que nunca são limpos causam vazamento de memória.",
    ),
    keyTakeaways: [
      "Arrow functions têm sintaxe curta e retorno implícito com expressão.",
      "Elas herdam o this do escopo onde foram criadas.",
      "Closure é uma função que lembra as variáveis do escopo onde nasceu.",
      "Closures permitem estado privado sem classes.",
    ],
    tasks: [
      "Converter 3 funções tradicionais em arrow functions",
      "Criar um contador com closure e confirmar que dois contadores não compartilham estado",
      "Explicar em voz alta o que fica preso na closure do contador",
    ],
    flashcards: [
      {
        question: "O que é uma closure?",
        answer: "Uma função que mantém acesso às variáveis do escopo onde foi criada, mesmo depois que esse escopo terminou.",
      },
      {
        question: "Como retornar um objeto literal de uma arrow function com retorno implícito?",
        answer: "Envolva o objeto entre parênteses, senão as chaves viram o corpo da função.",
        codeExample: js(`
const criar = (nome) => ({ nome });
`),
      },
      {
        question: "Arrow functions têm this próprio?",
        answer: "Não. Elas usam o this do escopo externo, por isso não servem como métodos nem construtores.",
      },
    ],
    challenges: [
      {
        title: "Missão da Aula 7: gerador de IDs e sessões de estudo",
        description:
          "Crie criarGeradorDeId(prefixo), que guarda um contador privado (closure) e devolve uma arrow function que gera 'sessao-1', 'sessao-2'... a cada chamada. Depois crie criarSessao(tema, gerarId), que devolve um objeto com arrow functions: adicionarMinutos(minutos) soma ao tempo da sessão e resumo() devolve algo como 'sessao-1: Closures (45 min)'. Os minutos não podem ser acessados diretamente de fora.",
        starterCode: `const criarGeradorDeId = (prefixo) => {

};

const criarSessao = (tema, gerarId) => {

};

const gerarId = criarGeradorDeId("sessao");
const sessao = criarSessao("Closures", gerarId);
sessao.adicionarMinutos(30);
sessao.adicionarMinutos(15);
console.log(sessao.resumo());
`,
        hint: "Em criarGeradorDeId, declare let contador = 0 fora da arrow function retornada. Em criarSessao, gere o id uma vez só e guarde os minutos em um let dentro da própria criarSessao.",
        solutionCode: `const criarGeradorDeId = (prefixo) => {
  let contador = 0;
  return () => {
    contador += 1;
    return prefixo + "-" + contador;
  };
};

const criarSessao = (tema, gerarId) => {
  const id = gerarId();
  let minutos = 0;
  return {
    adicionarMinutos: (quantidade) => {
      minutos += quantidade;
    },
    resumo: () => id + ": " + tema + " (" + minutos + " min)",
  };
};

const gerarId = criarGeradorDeId("sessao");
const sessao = criarSessao("Closures", gerarId);
sessao.adicionarMinutos(30);
sessao.adicionarMinutos(15);
console.log(sessao.resumo());
console.log(criarSessao("Arrow functions", gerarId).resumo());
`,
      },
    ],
  }),
  fullDay("AVALIACAO", MODULE_1_2, {
    topicTitle: "Avaliação do Módulo 1.2",
    summaryContent: lines(
      "## Avaliação do Módulo 1.2",
      "Hoje é dia de avaliação. Ela cobre as Aulas 4 a 7: **variáveis e tipos**, **funções e escopo**, **if/switch/for**, **arrow functions e closures**.",
      "### Como se preparar",
      "- Revise os flashcards vencidos dos dias 4 a 7.\n- Refaça, sem olhar, os desafios desses dias.\n- Releia os erros que você anotou na Aula 3.",
      "### Regras da meta",
      "Meta: **nota 85**. Mínimo para seguir: **nota 70**. Se ficar abaixo de 70, refaça os tópicos fracos e repita a avaliação antes de avançar.",
      "### Ponte Python → JavaScript",
      "Aproveite para revisar as comparações: `let/const` x variáveis do Python, `function` x `def`, `else if` x `elif` e arrow function x `lambda`.",
    ),
    keyTakeaways: [
      "A avaliação cobre as Aulas 4 a 7.",
      "Meta de nota 85; mínimo 70 para avançar.",
      "Abaixo de 70, refaça os tópicos fracos antes de seguir.",
    ],
    tasks: [
      "Fazer a avaliação do módulo",
      "Meta: nota 85, mínimo 70",
      "Revisar os erros e refazer os tópicos com nota baixa",
      "Registrar a nota obtida nas notas do dia",
    ],
    flashcards: [
      {
        question: "Qual a diferença entre let e const?",
        answer: "let permite reatribuir a variável; const não permite reatribuição (mas o conteúdo de um objeto pode mudar).",
      },
      {
        question: "O que é escopo léxico?",
        answer: "A regra pela qual uma função enxerga as variáveis do escopo onde foi definida, não de onde foi chamada.",
      },
      {
        question: "Para que serve uma closure?",
        answer: "Para manter estado privado e reaproveitar variáveis do escopo externo em funções internas.",
      },
    ],
    challenges: [],
  }),
  fullDay("AULA", MODULE_1_3, {
    topicTitle: "Arrays e objetos: map, filter e reduce",
    summaryContent: lines(
      "## Arrays e objetos",
      "**Arrays** guardam listas ordenadas e **objetos** guardam pares chave-valor. Os métodos `map`, `filter` e `reduce` transformam arrays **sem alterar o original**: `map` transforma cada item, `filter` seleciona itens e `reduce` acumula tudo em um valor.",
      js(`
const pedidos = [
  { id: 1, valor: 120, pago: true },
  { id: 2, valor: 80, pago: false },
  { id: 3, valor: 200, pago: true },
];

const valores = pedidos.map((pedido) => pedido.valor);
const pagos = pedidos.filter((pedido) => pedido.pago);
const totalPago = pagos.reduce((soma, pedido) => soma + pedido.valor, 0);

console.log(valores, pagos.length, totalPago);
`),
      "### Outros métodos importantes",
      "`find` (primeiro que atende), `some` e `every` (testes booleanos), `includes`, `push`/`pop`, `slice` (copia um trecho) e `sort` (**muta** o array e, sem comparador, ordena como texto).",
      js(`
console.log([10, 2, 1].sort());
console.log([10, 2, 1].sort((a, b) => a - b));
`),
      "### Ponte Python → JavaScript",
      "`list` vira array e `dict` vira objeto. As *list comprehensions* viram `map` e `filter`. O `sum(...)` vira `reduce`.",
      py(`
dobros = [n * 2 for n in [1, 2, 3] if n > 1]
`),
      js(`
const dobros = [1, 2, 3].filter((n) => n > 1).map((n) => n * 2);
`),
      "### Armadilhas comuns",
      "- `reduce` sem valor inicial falha em array vazio.\n- `sort` e `reverse` alteram o array original; copie antes com `[...lista]`.\n- `forEach` não devolve nada e não aceita `break`.\n- Objetos e arrays são comparados por referência: `[] === []` é `false`.",
    ),
    keyTakeaways: [
      "map transforma, filter seleciona e reduce acumula.",
      "Esses métodos não alteram o array original.",
      "sort sem comparador ordena como texto e muta o array.",
      "Sempre passe o valor inicial ao reduce.",
    ],
    tasks: [
      "Resolver 5 exercícios usando apenas map, filter e reduce",
      "Ordenar um array de objetos por duas chaves diferentes",
      "Reescrever uma list comprehension de Python com map e filter",
    ],
    flashcards: [
      {
        question: "Qual a diferença entre map e forEach?",
        answer: "map devolve um novo array com o resultado de cada callback; forEach só executa efeitos e devolve undefined.",
      },
      {
        question: "Como somar os valores de um array com reduce?",
        answer: "Passando uma função acumuladora e o valor inicial 0.",
        codeExample: js(`
const total = [1, 2, 3].reduce((soma, n) => soma + n, 0);
`),
      },
      {
        question: "Por que [10, 2, 1].sort() resulta em [1, 10, 2]?",
        answer: "Sem comparador, sort converte os itens em texto e ordena lexicograficamente. Use (a, b) => a - b para números.",
      },
    ],
    challenges: [
      {
        title: "Total do carrinho",
        description:
          "Escreva totalDoCarrinho(itens) que recebe objetos { preco, quantidade } e retorna a soma de preco * quantidade. Para carrinho vazio, retorne 0.",
        starterCode: "function totalDoCarrinho(itens) {\n  \n}\n",
        hint: "reduce com valor inicial 0 resolve inclusive o carrinho vazio.",
        solutionCode:
          "function totalDoCarrinho(itens) {\n  return itens.reduce((total, item) => total + item.preco * item.quantidade, 0);\n}\n",
      },
    ],
  }),
  fullDay("AULA", MODULE_1_3, {
    topicTitle: "Desestruturação, spread e JSON",
    summaryContent: lines(
      "## Desestruturação",
      "Extrai valores de objetos e arrays para variáveis em uma linha, com renomeação e valores padrão.",
      js(`
const usuario = { nome: "Ana", idade: 30, endereco: { cidade: "Curitiba" } };

const { nome, idade: anos, papel = "aluna" } = usuario;
const { endereco: { cidade } } = usuario;
const [primeiro, , terceiro = 0, ...resto] = [1, 2, undefined, 4, 5];

console.log(nome, anos, papel, cidade, primeiro, terceiro, resto);
`),
      "### Spread e rest",
      "A sintaxe `...` espalha (*spread*) elementos à direita e agrupa (*rest*) o que sobrou à esquerda. Com ela você copia e atualiza objetos **sem alterar o original**.",
      js(`
const base = { tema: "escuro", fonte: 14 };
const preferencias = { ...base, fonte: 16 };
const numeros = [1, 2, 3];
const maisUm = [...numeros, 4];
const { fonte, ...semFonte } = preferencias;
`),
      "### JSON",
      "`JSON.stringify` transforma um valor em texto e `JSON.parse` faz o caminho inverso. JSON aceita string, number, boolean, null, array e objeto: `Date` vira texto e `undefined`, funções e `Symbol` são descartados.",
      js(`
const texto = JSON.stringify({ nome: "Ana", ativo: true }, null, 2);
const objeto = JSON.parse(texto);
console.log(objeto.nome);
`),
      "### Ponte Python → JavaScript",
      "`json.dumps` e `json.loads` viram `JSON.stringify` e `JSON.parse`. O desempacotamento `a, b = lista` e o `**dict` do Python correspondem à desestruturação e ao spread de objetos.",
      py(`
import json
texto = json.dumps({"nome": "Ana"})
`),
      "### Armadilhas comuns",
      "- A ordem do spread importa: o último valor vence.\n- Spread faz cópia **rasa**: objetos aninhados continuam compartilhados (use `structuredClone` para cópia profunda).\n- Desestruturar `null` ou `undefined` lança `TypeError`.\n- `JSON.parse` lança erro em texto inválido: use `try/catch`.",
    ),
    keyTakeaways: [
      "Desestruturação extrai campos de objetos e arrays em uma linha.",
      "Spread copia e atualiza sem mutar; é uma cópia rasa.",
      "JSON.stringify e JSON.parse convertem de e para texto.",
      "Date, undefined e funções não sobrevivem ao JSON.",
    ],
    tasks: [
      "Extrair campos aninhados de uma resposta de API com desestruturação",
      "Atualizar um objeto e um array de forma imutável com spread",
      "Fazer ida e volta com JSON.stringify e JSON.parse e comparar o resultado",
    ],
    flashcards: [
      {
        question: "Como atualizar um campo de um objeto sem mutá-lo?",
        answer: "Criando um novo objeto com spread e sobrescrevendo o campo depois.",
        codeExample: js(`
const novo = { ...antigo, ativo: true };
`),
      },
      {
        question: "O que acontece com Date e undefined no JSON.stringify?",
        answer: "Date vira uma string ISO; propriedades com undefined, funções e symbols são omitidas.",
      },
      {
        question: "O spread faz cópia rasa ou profunda?",
        answer: "Rasa: só o primeiro nível é duplicado. Para cópia profunda use structuredClone.",
      },
    ],
    challenges: [
      {
        title: "Resumo do usuário",
        description:
          "Escreva resumirUsuario(texto) que recebe um JSON com { nome, idade, endereco: { cidade } } e retorna 'Nome (idade anos) - Cidade'. Use JSON.parse e desestruturação.",
        starterCode: "function resumirUsuario(texto) {\n  \n}\n",
        hint: "const { nome, idade, endereco: { cidade } } = JSON.parse(texto).",
        solutionCode:
          'function resumirUsuario(texto) {\n  const { nome, idade, endereco: { cidade } } = JSON.parse(texto);\n  return nome + " (" + idade + " anos) - " + cidade;\n}\n',
      },
    ],
  }),
  fullDay("AULA", MODULE_1_3, {
    topicTitle: "Coerção, == versus === e try/catch",
    summaryContent: lines(
      "## Coerção de tipos",
      "JavaScript converte tipos automaticamente em algumas operações. `\"5\" * 2` vira `10`, mas `\"5\" + 2` vira `\"52\"` porque o `+` concatena se houver texto. O `==` aplica essa coerção antes de comparar; o `===` compara **tipo e valor**. Use sempre `===`.",
      js(`
console.log("5" * 2);
console.log("5" + 2);
console.log(0 == "");
console.log(null == undefined);
console.log(null === undefined);
console.log(Number(""), Number("abc"), parseInt("42px"));
`),
      "### Valores falsy",
      "Apenas `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined` e `NaN` são falsy. Para valores padrão, prefira `??` (só trata `null`/`undefined`) a `||` (que descarta o `0`).",
      js(`
const quantidade = 0;
console.log(quantidade || 10);
console.log(quantidade ?? 10);
`),
      "### try / catch / finally",
      "Erros em tempo de execução interrompem o programa. Capture-os com `try/catch` e use `finally` para limpeza. Lance erros com `throw new Error(\"mensagem\")`.",
      js(`
function lerConfiguracao(texto) {
  try {
    return JSON.parse(texto);
  } catch (erro) {
    console.error("Configuração inválida:", erro.message);
    return {};
  } finally {
    console.log("leitura finalizada");
  }
}
`),
      "### Ponte Python → JavaScript",
      "O Python quase nunca converte tipos sozinho (`\"5\" + 2` dá erro). O JavaScript converte, e por isso precisa de `===`. `try/except/finally` vira `try/catch/finally`, e `raise` vira `throw`.",
      py(`
try:
    valor = int("abc")
except ValueError as erro:
    print(erro)
`),
      "### Armadilhas comuns",
      "- `catch` vazio engole erros e esconde bugs.\n- Lance sempre `Error` (ou subclasses), nunca strings.\n- `typeof NaN` é `\"number\"`; use `Number.isNaN`.",
    ),
    keyTakeaways: [
      "O + concatena se houver string; os outros operadores convertem para número.",
      "Use sempre === e prefira ?? a || para valores padrão.",
      "try/catch/finally tratam erros; lance sempre objetos Error.",
      "Nunca deixe um catch vazio.",
    ],
    tasks: [
      "Prever e testar o resultado de 8 comparações com == no console",
      "Reescrever 3 usos de || por ?? e explicar a diferença",
      "Tratar o erro de JSON.parse com try/catch em uma função",
    ],
    flashcards: [
      {
        question: "Qual a diferença entre == e ===?",
        answer: "== converte os tipos antes de comparar (coerção); === compara tipo e valor sem converter. Use sempre ===.",
      },
      {
        question: "Quando ?? é melhor que ||?",
        answer: "Quando 0, '' ou false são valores válidos: ?? só usa o padrão para null e undefined, enquanto || usa para qualquer falsy.",
        codeExample: js(`
const porta = 0;
console.log(porta ?? 3000);
`),
      },
      {
        question: "Para que serve o bloco finally?",
        answer: "Executa sempre, com ou sem erro, ideal para liberar recursos ou registrar o fim de uma operação.",
      },
    ],
    challenges: [
      {
        title: "Converter com segurança",
        description:
          "Escreva paraNumeroSeguro(texto) que remove espaços das pontas e retorna o número, ou null se a string estiver vazia ou não for um número válido.",
        starterCode: "function paraNumeroSeguro(texto) {\n  \n}\n",
        hint: "Number('') retorna 0: trate o texto vazio antes e valide o resultado com Number.isNaN.",
        solutionCode:
          'function paraNumeroSeguro(texto) {\n  const limpo = texto.trim();\n  if (limpo === "") return null;\n  const numero = Number(limpo);\n  return Number.isNaN(numero) ? null : numero;\n}\n',
      },
    ],
  }),
  fullDay("AULA", MODULE_1_3, {
    topicTitle: "Módulos (import/export) e métodos de string",
    summaryContent: lines(
      "## Módulos ES",
      "Módulos dividem o código em arquivos com escopo próprio. Exporte com `export` e importe com `import`. Há vários exports **nomeados** e no máximo um **default** por arquivo. No Node, use `\"type\": \"module\"` no package.json.",
      js(`
export const PI = 3.14159;

export function areaCirculo(raio) {
  return PI * raio * raio;
}

export default function descrever(forma) {
  return "Forma: " + forma;
}
`),
      js(`
import descrever, { PI, areaCirculo as area } from "./geometria.js";

console.log(descrever("círculo"), PI, area(2));
`),
      "### Métodos de string",
      "Strings são imutáveis: todo método devolve uma **nova** string. Os mais usados: `trim`, `toUpperCase`, `toLowerCase`, `includes`, `startsWith`, `endsWith`, `split`, `replace`/`replaceAll`, `slice`, `padStart` e `repeat`.",
      js(`
const titulo = "  Aprendendo JavaScript  ";
console.log(titulo.trim().toUpperCase());
console.log(titulo.includes("Java"));
console.log("a-b-c".split("-"));
console.log("7".padStart(3, "0"));
`),
      "### Template literals",
      "Crases permitem interpolar expressões com ${ } e escrever textos em várias linhas.",
      js(`
const nome = "Ana";
const aula = 11;
console.log(¬Olá, $¦{nome}! Hoje é a aula $¦{aula}.¬);
`),
      "### Ponte Python → JavaScript",
      "`import modulo` e `from modulo import nome` viram `import` e `import { nome }`. As f-strings (`f\"Olá, {nome}\"`) viram template literals (crase com `${nome}`). `.strip()` vira `.trim()` e `.upper()` vira `.toUpperCase()`.",
      py(`
nome = "Ana"
print(f"Olá, {nome}!")
`),
      "### Armadilhas comuns",
      "- No Node nativo, imports relativos precisam da extensão `.js`.\n- Chamar `texto.toUpperCase()` não altera `texto`: guarde o resultado.\n- Misturar `require` e `import` no mesmo arquivo gera erros confusos.",
    ),
    keyTakeaways: [
      "export nomeado pode ter vários por arquivo; default só um.",
      "Strings são imutáveis: métodos devolvem uma nova string.",
      "Template literals com crase e ${ } substituem as f-strings.",
      "No Node, use type module e extensão .js nos imports relativos.",
    ],
    tasks: [
      "Separar um script em dois módulos usando export nomeado e default",
      "Usar 6 métodos de string diferentes em exemplos próprios",
      "Reescrever 3 concatenações usando template literals",
    ],
    flashcards: [
      {
        question: "Qual a diferença entre export nomeado e export default?",
        answer: "Um arquivo pode ter vários exports nomeados (importados com chaves) e apenas um default (importado com qualquer nome, sem chaves).",
      },
      {
        question: "Strings em JavaScript são mutáveis?",
        answer: "Não. Métodos como toUpperCase e replace devolvem uma nova string e não alteram a original.",
      },
      {
        question: "Qual o equivalente das f-strings do Python?",
        answer: "Template literals: texto entre crases com interpolação usando ${expressao}.",
      },
    ],
    challenges: [
      {
        title: "Gerar slug de título",
        description:
          "Escreva gerarSlug(titulo) que retorna o título em minúsculas, sem espaços nas pontas, com sequências de espaços trocadas por um hífen. gerarSlug('  Aula Onze  JS ') retorna 'aula-onze-js'.",
        starterCode: "function gerarSlug(titulo) {\n  \n}\n",
        hint: "trim, toLowerCase e replace com a regex /\\s+/g.",
        solutionCode:
          'function gerarSlug(titulo) {\n  return titulo.trim().toLowerCase().replace(/\\s+/g, "-");\n}\n',
      },
    ],
  }),
  fullDay("AULA", MODULE_1_3, {
    topicTitle: "Classes e this",
    summaryContent: lines(
      "## Classes",
      "Classes são uma sintaxe clara para criar objetos com dados e comportamento. Possuem `constructor`, métodos, `get`/`set`, membros `static`, campos privados com `#` e herança com `extends`/`super`.",
      js(`
class Conta {
  #saldo = 0;

  constructor(titular, saldoInicial = 0) {
    this.titular = titular;
    this.#saldo = saldoInicial;
  }

  depositar(valor) {
    if (valor <= 0) throw new Error("Valor inválido");
    this.#saldo += valor;
    return this;
  }

  get saldo() {
    return this.#saldo;
  }
}

class ContaPoupanca extends Conta {
  constructor(titular, saldoInicial, taxa) {
    super(titular, saldoInicial);
    this.taxa = taxa;
  }

  rendimento() {
    return this.saldo * this.taxa;
  }
}

const conta = new ContaPoupanca("Ana", 100, 0.1);
console.log(conta.depositar(50).saldo, conta.rendimento());
`),
      "### O valor de this",
      "O `this` depende de **como** a função é chamada: como método (`obj.metodo()`), ele é o objeto; solta, é `undefined` em modo estrito. `bind`, `call` e `apply` definem o `this` manualmente, e arrow functions herdam o do escopo externo.",
      js(`
const pessoa = {
  nome: "Ana",
  falar() {
    return this.nome;
  },
};

const solta = pessoa.falar;
const presa = pessoa.falar.bind(pessoa);
console.log(pessoa.falar(), presa());
`),
      "### Ponte Python → JavaScript",
      "O `self` do Python é explícito em todo método; em JavaScript o `this` é **implícito** e muda conforme a chamada. `__init__` vira `constructor` e `class B(A)` vira `class B extends A`.",
      py(`
class Conta:
    def __init__(self, titular):
        self.titular = titular
`),
      "### Armadilhas comuns",
      "- Passar um método como callback (`botao.onclick = obj.metodo`) perde o `this`.\n- Esquecer `super()` antes de usar `this` em subclasses.\n- Chamar a classe sem `new` lança erro.\n- Herança profunda gera acoplamento: prefira composição.",
    ),
    keyTakeaways: [
      "Classes agrupam dados e comportamento; # cria campos privados.",
      "super() deve ser chamado antes de usar this em subclasses.",
      "O valor de this depende de como a função é chamada.",
      "bind, call e apply fixam o this; arrow functions herdam o do escopo.",
    ],
    tasks: [
      "Criar uma classe com campo privado, getter e método estático",
      "Criar uma subclasse e sobrescrever um método chamando super",
      "Demonstrar a perda de this ao extrair um método e corrigir com bind",
    ],
    flashcards: [
      {
        question: "O que é o this em JavaScript?",
        answer: "Uma referência definida na chamada da função: o objeto que chamou o método, o objeto criado por new, ou o valor fixado por bind/call/apply.",
      },
      {
        question: "Como criar um campo realmente privado em uma classe?",
        answer: "Prefixando o nome com #. Acessar o campo fora da classe causa erro de sintaxe.",
        codeExample: js(`
class Caixa {
  #segredo = 42;
}
`),
      },
      {
        question: "Qual o equivalente do self do Python?",
        answer: "O this, com a diferença de ser implícito e depender de como o método é chamado.",
      },
    ],
    challenges: [
      {
        title: "Lista de tarefas com classe",
        description:
          "Crie a classe ListaDeTarefas com adicionar(titulo), concluir(titulo) e o getter pendentes que retorna os títulos não concluídos. Guarde as tarefas em um campo privado.",
        starterCode: "class ListaDeTarefas {\n  \n}\n",
        hint: "Use um array #tarefas de objetos { titulo, concluida } e filter no getter.",
        solutionCode:
          "class ListaDeTarefas {\n  #tarefas = [];\n\n  adicionar(titulo) {\n    this.#tarefas.push({ titulo, concluida: false });\n  }\n\n  concluir(titulo) {\n    const tarefa = this.#tarefas.find((item) => item.titulo === titulo);\n    if (tarefa) tarefa.concluida = true;\n  }\n\n  get pendentes() {\n    return this.#tarefas.filter((item) => !item.concluida).map((item) => item.titulo);\n  }\n}\n",
      },
    ],
  }),
  fullDay("AVALIACAO", MODULE_1_3, {
    topicTitle: "Avaliação do Módulo 1.3",
    summaryContent: lines(
      "## Avaliação do Módulo 1.3",
      "A avaliação cobre as Aulas 8 a 12: **arrays e objetos com map/filter/reduce**, **desestruturação, spread e JSON**, **coerção, comparações e try/catch**, **módulos e strings** e **classes e this**.",
      "### Como se preparar",
      "- Revise os flashcards vencidos dos dias 9 a 13.\n- Refaça, sem olhar, os desafios do Two Sum e de reduce.\n- Releia seus erros do módulo anterior.",
      "### Regras da meta",
      "Meta: **nota 85**. Mínimo para seguir: **nota 70**.",
      "### Ponte Python → JavaScript",
      "Revise as equivalências: list comprehension x map/filter, `json.dumps` x `JSON.stringify`, `try/except` x `try/catch`, f-string x template literal e `self` x `this`.",
    ),
    keyTakeaways: [
      "A avaliação cobre as Aulas 8 a 12.",
      "Meta de nota 85; mínimo 70 para avançar.",
      "Refaça os tópicos com nota baixa antes de seguir.",
    ],
    tasks: [
      "Fazer a avaliação do módulo",
      "Meta: nota 85, mínimo 70",
      "Revisar os erros e refazer os tópicos com nota baixa",
      "Registrar a nota obtida nas notas do dia",
    ],
    flashcards: [
      {
        question: "Para que serve o reduce?",
        answer: "Para acumular todos os itens de um array em um único valor, como uma soma, um objeto agrupado ou um texto.",
      },
      {
        question: "O que o spread faz com objetos?",
        answer: "Copia as propriedades para um novo objeto (cópia rasa), permitindo atualizar sem mutar o original.",
      },
      {
        question: "Por que usar === em vez de ==?",
        answer: "Porque === não converte tipos, evitando resultados surpreendentes da coerção.",
      },
    ],
    challenges: [],
  }),
  fullDay("AULA", MODULE_1_4, {
    topicTitle: "Event loop e promises",
    summaryContent: lines(
      "## Por que existe código assíncrono",
      "JavaScript executa em **uma única thread**. Operações lentas (rede, disco, timers) não podem bloquear tudo, então são iniciadas e **continuam em segundo plano**; quando terminam, uma função de retorno (*callback*) é enfileirada.",
      js(`
console.log("1. início");

setTimeout(() => {
  console.log("3. depois de 1 segundo");
}, 1000);

console.log("2. fim do script");
`),
      "### Event loop: duas filas",
      "- **Microtasks:** callbacks de `Promise` (`then`, `catch`, `finally`) e `await`. Rodam **todas** logo que a pilha esvazia.\n- **Macrotasks:** `setTimeout`, eventos e I/O. Uma por volta do loop.",
      js(`
console.log("A");
setTimeout(() => console.log("B macrotask"), 0);
Promise.resolve().then(() => console.log("C microtask"));
console.log("D");
`),
      "A saída é **A, D, C, B**: primeiro o código síncrono, depois as microtasks e por fim as macrotasks.",
      "### Promises",
      "Uma Promise representa um valor futuro, com estados `pending`, `fulfilled` e `rejected`. Encadeie com `then`, trate erros com `catch` e finalize com `finally`.",
      js(`
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

esperar(500)
  .then(() => "pronto")
  .then((mensagem) => console.log(mensagem))
  .catch((erro) => console.error(erro))
  .finally(() => console.log("fim"));

Promise.all([esperar(100), esperar(200)]).then(() => console.log("todas terminaram"));
`),
      "### Ponte Python → JavaScript",
      "O `asyncio` do Python tem ideias parecidas (event loop, `Future`), mas no JavaScript **tudo** é assíncrono por padrão em I/O: não existe `time.sleep` bloqueante. `Promise.all` equivale ao `asyncio.gather`.",
      "### Armadilhas comuns",
      "- Esquecer o `return` dentro do `then` quebra a cadeia.\n- Toda cadeia deve terminar com `catch`.\n- `setTimeout(fn, 0)` não roda agora: espera a pilha esvaziar.\n- Código síncrono pesado congela a página inteira.",
    ),
    keyTakeaways: [
      "JavaScript tem uma thread; tarefas lentas são assíncronas.",
      "Microtasks (Promises) têm prioridade sobre macrotasks (timers).",
      "Promise tem estados pending, fulfilled e rejected.",
      "Promise.all roda em paralelo e falha rápido.",
    ],
    tasks: [
      "Prever a ordem dos logs de 3 scripts e conferir no Node",
      "Criar uma função esperar(ms) que retorna uma Promise",
      "Comparar o tempo de duas esperas em sequência e com Promise.all",
    ],
    flashcards: [
      {
        question: "Qual a diferença entre microtask e macrotask?",
        answer: "Microtasks (Promises) rodam todas assim que a pilha esvazia, antes da próxima macrotask. Macrotasks (setTimeout, eventos) rodam uma por volta do event loop.",
      },
      {
        question: "Qual a ordem de saída: console.log(1); setTimeout(() => console.log(2)); Promise.resolve().then(() => console.log(3)); console.log(4);",
        answer: "1, 4, 3, 2: síncrono primeiro (1 e 4), depois a microtask (3) e por último a macrotask (2).",
      },
      {
        question: "O que faz Promise.all?",
        answer: "Executa várias promises em paralelo e resolve com um array de resultados; rejeita assim que uma delas falhar.",
      },
    ],
    challenges: [
      {
        title: "Esperar e retornar",
        description:
          "Escreva esperarEDevolver(valor, ms) que retorna uma Promise que resolve com 'valor' depois de ms milissegundos.",
        starterCode: "function esperarEDevolver(valor, ms) {\n  \n}\n",
        hint: "Envolva um setTimeout em new Promise e chame resolve(valor) dentro dele.",
        solutionCode:
          "function esperarEDevolver(valor, ms) {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve(valor), ms);\n  });\n}\n",
      },
    ],
  }),
  fullDay("AULA", MODULE_1_4, {
    topicTitle: "async/await e fetch com a API do GitHub",
    summaryContent: lines(
      "## async/await",
      "`async/await` faz código assíncrono parecer síncrono. Uma função `async` **sempre retorna uma Promise** e `await` pausa a função (não a thread) até a Promise resolver. Trate erros com `try/catch`.",
      js(`
async function buscarUsuario(login) {
  const resposta = await fetch("https://api.github.com/users/" + login);

  if (!resposta.ok) {
    throw new Error("GitHub respondeu " + resposta.status);
  }

  const usuario = await resposta.json();
  return { nome: usuario.name, repositorios: usuario.public_repos };
}

buscarUsuario("octocat")
  .then((dados) => console.log(dados))
  .catch((erro) => console.error(erro.message));
`),
      "### Sequencial x paralelo",
      js(`
const a = await buscarUsuario("octocat");
const b = await buscarUsuario("torvalds");

const [x, y] = await Promise.all([buscarUsuario("octocat"), buscarUsuario("torvalds")]);
`),
      "O primeiro bloco soma os tempos; o segundo leva apenas o tempo da requisição mais lenta.",
      "### Ponte Python → JavaScript",
      "`requests.get(url).json()` vira `await fetch(url)` seguido de `await resposta.json()`. Em Python você escreve `async def` e `await` dentro do `asyncio`; em JavaScript o runtime já cuida do event loop.",
      py(`
import requests
dados = requests.get("https://api.github.com/users/octocat").json()
`),
      "### Armadilhas comuns",
      "- `fetch` **não** rejeita em 404 ou 500: confira `resposta.ok`.\n- `await` dentro de `forEach` não espera: use `for...of` ou `Promise.all(lista.map(...))`.\n- Esquecer o `await` devolve uma Promise pendente em vez do valor.\n- A API do GitHub tem limite de requisições sem autenticação (60 por hora).",
    ),
    keyTakeaways: [
      "Funções async sempre retornam Promise; await pausa a função.",
      "fetch só rejeita em erro de rede: confira resposta.ok.",
      "Use Promise.all para requisições independentes.",
      "await dentro de forEach não espera; use for...of.",
    ],
    tasks: [
      "Buscar seu usuário na API do GitHub e imprimir nome e repositórios",
      "Tratar um 404 buscando um usuário que não existe",
      "Buscar dois usuários em paralelo com Promise.all e medir o tempo",
      "Listar os nomes dos repositórios públicos de um usuário",
    ],
    flashcards: [
      {
        question: "fetch rejeita a Promise quando o servidor responde 404?",
        answer: "Não. Só rejeita em falhas de rede. Verifique resposta.ok ou resposta.status.",
        codeExample: js(`
const resposta = await fetch("/nao-existe");
if (!resposta.ok) throw new Error(String(resposta.status));
`),
      },
      {
        question: "Por que await dentro de forEach não funciona?",
        answer: "forEach ignora o retorno do callback e não espera as Promises. Use for...of (sequencial) ou Promise.all com map (paralelo).",
      },
      {
        question: "O que uma função async retorna?",
        answer: "Sempre uma Promise: o return vira o valor resolvido e um throw vira uma rejeição.",
      },
    ],
    challenges: [
      {
        title: "Listar repositórios do GitHub",
        description:
          "Escreva a função async nomesDosRepositorios(login) que busca https://api.github.com/users/<login>/repos, lança Error('HTTP <status>') se a resposta não for ok e retorna um array com os nomes dos repositórios.",
        starterCode: "async function nomesDosRepositorios(login) {\n  \n}\n",
        hint: "Verifique resposta.ok, chame resposta.json() e use map(repo => repo.name).",
        solutionCode:
          'async function nomesDosRepositorios(login) {\n  const resposta = await fetch("https://api.github.com/users/" + login + "/repos");\n  if (!resposta.ok) throw new Error("HTTP " + resposta.status);\n  const repositorios = await resposta.json();\n  return repositorios.map((repositorio) => repositorio.name);\n}\n',
      },
    ],
  }),
  fullDay("AVALIACAO", MODULE_1_4, {
    topicTitle: "Avaliação do Módulo 1.4",
    summaryContent: lines(
      "## Avaliação do Módulo 1.4",
      "A avaliação cobre as Aulas 13 e 14: **event loop, microtasks e macrotasks**, **Promises** (then, catch, all) e **async/await com fetch**.",
      "### Como se preparar",
      "- Refaça os 3 exercícios de ordem de execução do event loop.\n- Reescreva uma cadeia de then/catch usando async/await.\n- Revise os flashcards vencidos dos dias 15 e 16.",
      "### Regras da meta",
      "Meta: **nota 85**. Mínimo para seguir: **nota 70**.",
      "### Ponte Python → JavaScript",
      "Compare: `asyncio.gather` x `Promise.all`, `requests` x `fetch` e `try/except` x `try/catch` em código assíncrono.",
    ),
    keyTakeaways: [
      "A avaliação cobre event loop, Promises e async/await.",
      "Meta de nota 85; mínimo 70 para avançar.",
      "Refaça os tópicos fracos antes de ir para a Seção 2.",
    ],
    tasks: [
      "Fazer a avaliação do módulo",
      "Meta: nota 85, mínimo 70",
      "Revisar os erros e refazer os tópicos com nota baixa",
      "Registrar a nota obtida nas notas do dia",
    ],
    flashcards: [
      {
        question: "Quando o código dentro de um then é executado?",
        answer: "Como microtask, depois que o código síncrono atual termina e a pilha esvazia, antes das macrotasks como setTimeout.",
      },
      {
        question: "Como tratar erros em código com await?",
        answer: "Envolvendo o await em try/catch, ou encadeando .catch na Promise retornada pela função async.",
      },
      {
        question: "Quando usar Promise.all?",
        answer: "Quando as operações são independentes e podem rodar em paralelo, reduzindo o tempo total.",
      },
    ],
    challenges: [],
  }),
  fullDay("REVISAO", REVIEW_1, {
    topicTitle: "Revisão da Seção 1: JavaScript",
    summaryContent: lines(
      "## Revisão da Seção 1",
      "Hoje você consolida tudo o que aprendeu em JavaScript antes de ir para o navegador. A ideia é **recuperar da memória**, não reler: faça os flashcards, refaça os desafios e explique conceitos em voz alta.",
      "### Mapa da seção",
      "- **1.1:** ambiente, console e depuração.\n- **1.2:** variáveis, tipos, funções, controle de fluxo, closures.\n- **1.3:** arrays, objetos, JSON, coerção, erros, módulos, classes.\n- **1.4:** event loop, Promises, async/await e fetch.",
      "### Checklist de domínio",
      "Você deve conseguir, sem consultar: explicar closure, escolher entre `map`/`filter`/`reduce`, prever a ordem de execução do event loop, tratar erros de `fetch` e escrever uma classe com campo privado.",
      js(`
const resumo = ["variáveis", "funções", "arrays", "classes", "async"];
resumo.forEach((tema, indice) => console.log(indice + 1, tema));
`),
      "### Ponte Python → JavaScript",
      "Monte uma tabela pessoal de equivalências Python x JavaScript com o que você aprendeu: tipos, funções, comprehensions, classes, JSON, async. Ela será seu guia rápido daqui para frente.",
    ),
    keyTakeaways: [
      "Recuperar da memória vale mais do que reler.",
      "Seção 1 cobre fundamentos, dados, classes e assíncrono.",
      "Uma tabela Python x JavaScript acelera a consulta.",
      "Registre as lacunas para revisar na Revisão geral.",
    ],
    tasks: [
      "Fazer todos os flashcards vencidos da Seção 1",
      "Refazer 5 desafios sem olhar a solução",
      "Montar a tabela de equivalências Python x JavaScript",
      "Anotar as 3 maiores dúvidas para estudar de novo",
    ],
    flashcards: [
      {
        question: "Quais métodos de array transformam sem mutar o original?",
        answer: "map, filter, reduce, slice, concat e os métodos find/some/every (que só leem). Já sort, reverse, push, pop e splice mutam.",
      },
      {
        question: "Como a ordem de execução funciona entre síncrono, microtask e macrotask?",
        answer: "O código síncrono termina primeiro; depois rodam todas as microtasks (Promises); só então a próxima macrotask (timers, eventos).",
      },
      {
        question: "Quando usar const, let ou var?",
        answer: "const por padrão, let quando precisar reatribuir e var nunca (escopo de função e hoisting confusos).",
      },
    ],
    challenges: [
      {
        title: "Contar palavras",
        description:
          "Escreva contarPalavras(texto) que retorna um objeto com a quantidade de cada palavra do texto, ignorando maiúsculas e minúsculas e espaços extras.",
        starterCode: "function contarPalavras(texto) {\n  \n}\n",
        hint: "toLowerCase, split por espaços, filter(Boolean) e reduce para acumular as contagens.",
        solutionCode:
          'function contarPalavras(texto) {\n  return texto\n    .toLowerCase()\n    .split(" ")\n    .filter(Boolean)\n    .reduce((contagem, palavra) => {\n      contagem[palavra] = (contagem[palavra] ?? 0) + 1;\n      return contagem;\n    }, {});\n}\n',
      },
    ],
  }),
];
