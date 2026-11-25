import { evaluation, lesson, review } from "./helpers";
import type { DayContext, SeedDay } from "./types";

const CONTEXT: DayContext = {
  sectionTitle: "Seção 2 — HTML, CSS e DOM",
  moduleTitle: "HTML, CSS e DOM",
};

export const secao02HtmlCssDom: SeedDay[] = [
  lesson(
    CONTEXT,
    "HTML semântico",
    "HTML semântico usa tags que descrevem o significado do conteúdo (header, nav, main, section, article, aside, footer) em vez de divs genéricas. Isso melhora acessibilidade, SEO e manutenção. Cada página deve ter um único main, títulos em ordem hierárquica (h1 a h6) e textos alternativos nas imagens.",
    [
      "Tags semânticas descrevem o significado, não a aparência.",
      "Use um único h1 e mantenha a hierarquia dos títulos.",
      "Toda imagem informativa precisa de texto alternativo (alt).",
    ],
    [
      "Estruturar uma página com header, nav, main, section e footer",
      "Trocar três divs genéricas por tags semânticas",
      "Validar o HTML no validador do W3C",
    ],
    [
      "Por que usar tags semânticas em vez de div?",
      "Elas informam o papel do conteúdo a navegadores, leitores de tela e buscadores, melhorando acessibilidade e SEO sem custo extra.",
    ],
    [
      "Montar esqueleto de página",
      "Escreva esqueletoDePagina(titulo) que retorna uma string HTML com header contendo um h1 com o título, um main vazio e um footer, nessa ordem.",
      "Concatene as três tags em uma única string.",
      'function esqueletoDePagina(titulo) {\n  return "<header><h1>" + titulo + "</h1></header><main></main><footer></footer>";\n}\n',
      "function esqueletoDePagina(titulo) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Formulários e validação nativa",
    "Formulários usam form, label, input, select e button. Atributos como required, minlength, pattern, type=email e min/max ativam a validação nativa do navegador sem JavaScript. Todo input precisa de um label associado (for/id) e a validação do cliente nunca substitui a do servidor.",
    [
      "label associado ao input melhora acessibilidade e área de clique.",
      "required, pattern e type ativam validação nativa.",
      "A validação do cliente nunca substitui a do servidor.",
    ],
    [
      "Criar um formulário de cadastro com nome, e-mail e senha",
      "Aplicar required, minlength e type=email nos campos",
      "Ler os dados enviados com FormData no evento submit",
    ],
    [
      "Por que validar também no servidor se o HTML já valida?",
      "Porque o cliente pode ser contornado (DevTools, requisições diretas). A validação do servidor é a que realmente protege o sistema.",
    ],
    [
      "Validar e-mail simples",
      "Escreva emailValido(texto) que retorna true se o texto tiver um @ com texto antes e um domínio com ponto depois, sem espaços.",
      "Use uma regex como /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.",
      'function emailValido(texto) {\n  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(texto);\n}\n',
      "function emailValido(texto) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "CSS: seletores e box model",
    "Todo elemento é uma caixa formada por content, padding, border e margin. Com box-sizing: border-box, a largura inclui padding e borda, o que simplifica o cálculo de layouts. Seletores por tag, classe, id, atributo e pseudo-classe se combinam, e a especificidade define qual regra vence um conflito.",
    [
      "A caixa tem content, padding, border e margin.",
      "box-sizing: border-box inclui padding e borda na largura.",
      "Especificidade resolve conflitos: id > classe > tag.",
    ],
    [
      "Aplicar box-sizing: border-box globalmente",
      "Estilizar um card com padding, borda e margem",
      "Testar a especificidade com três regras em conflito",
    ],
    [
      "O que faz box-sizing: border-box?",
      "Faz width e height incluírem padding e borda, em vez de somá-los ao tamanho do conteúdo.",
    ],
    [
      "Largura total da caixa",
      "Escreva larguraTotal({ content, padding, borda, margem }) para o modelo content-box: soma content + 2 * padding + 2 * borda + 2 * margem.",
      "Cada lado aparece duas vezes (esquerda e direita).",
      "function larguraTotal({ content, padding, borda, margem }) {\n  return content + 2 * padding + 2 * borda + 2 * margem;\n}\n",
      "function larguraTotal(medidas) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Flexbox",
    "Flexbox organiza elementos em uma dimensão (linha ou coluna). No container use display: flex, flex-direction, justify-content (eixo principal), align-items (eixo cruzado), gap e flex-wrap. Nos filhos, flex-grow, flex-shrink e flex-basis controlam o crescimento. É ideal para barras de navegação, cards em linha e centralização.",
    [
      "justify-content alinha no eixo principal; align-items no cruzado.",
      "gap cria espaçamento entre os filhos sem margens.",
      "flex: 1 faz o item ocupar o espaço disponível.",
    ],
    [
      "Criar uma navbar com logo à esquerda e links à direita",
      "Centralizar um elemento na tela com Flexbox",
      "Fazer uma lista de cards que quebra linha com flex-wrap",
    ],
    [
      "Como centralizar um elemento horizontal e verticalmente com Flexbox?",
      "No container: display: flex; justify-content: center; align-items: center.",
    ],
    [
      "Gerar CSS de centralização",
      "Escreva cssCentralizar() que retorna a string 'display: flex; justify-content: center; align-items: center;'.",
      "Basta retornar a string exata.",
      'function cssCentralizar() {\n  return "display: flex; justify-content: center; align-items: center;";\n}\n',
      "function cssCentralizar() {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "CSS Grid",
    "Grid organiza elementos em duas dimensões. Defina colunas com grid-template-columns (por exemplo repeat(3, 1fr)), espaçamento com gap e posicione itens com grid-column e grid-row. A função minmax e auto-fit criam grades responsivas sem media queries. Use Flexbox para alinhamentos lineares e Grid para layouts de página.",
    [
      "Grid trabalha em linhas e colunas ao mesmo tempo.",
      "repeat e fr simplificam a definição de colunas.",
      "auto-fit com minmax cria grades responsivas.",
    ],
    [
      "Criar uma grade de 3 colunas iguais com gap",
      "Montar um layout com header, sidebar, conteúdo e rodapé",
      "Criar uma grade responsiva com repeat(auto-fit, minmax(220px, 1fr))",
    ],
    [
      "Quando preferir Grid a Flexbox?",
      "Quando o layout é bidimensional (linhas e colunas ao mesmo tempo), como a estrutura de uma página ou uma galeria.",
    ],
    [
      "Gerar CSS de grade",
      "Escreva cssGrade(colunas, espaco) que retorna 'display: grid; grid-template-columns: repeat(N, 1fr); gap: Xpx;' com N igual a colunas e X igual a espaco.",
      "Interpole os dois valores na string.",
      'function cssGrade(colunas, espaco) {\n  return "display: grid; grid-template-columns: repeat(" + colunas + ", 1fr); gap: " + espaco + "px;";\n}\n',
      "function cssGrade(colunas, espaco) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Responsividade e mobile first",
    "Mobile first significa escrever o CSS base para telas pequenas e ampliar com media queries (min-width) para telas maiores. A meta tag viewport é obrigatória, e unidades relativas (rem, %, vw) e imagens com max-width: 100% ajudam a adaptar o layout. Teste sempre em 375 px, 768 px e 1280 px.",
    [
      "Escreva o CSS base para mobile e amplie com min-width.",
      "A meta viewport é obrigatória para o layout responsivo funcionar.",
      "Prefira unidades relativas a pixels fixos.",
    ],
    [
      "Adicionar a meta viewport e testar no modo dispositivo do DevTools",
      "Transformar um layout de 1 coluna em 3 colunas a partir de 768 px",
      "Tornar imagens responsivas com max-width: 100%",
    ],
    [
      "O que significa mobile first?",
      "Projetar e escrever o CSS primeiro para telas pequenas e usar media queries min-width para adicionar melhorias em telas maiores.",
    ],
    [
      "Escolher número de colunas",
      "Escreva colunasPorLargura(largura) que retorna 1 para menos de 768, 2 de 768 até 1023 e 3 a partir de 1024.",
      "Use if em ordem crescente de largura.",
      "function colunasPorLargura(largura) {\n  if (largura < 768) return 1;\n  if (largura < 1024) return 2;\n  return 3;\n}\n",
      "function colunasPorLargura(largura) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "DOM: selecionar e manipular elementos",
    "O DOM é a árvore de nós que representa a página. Selecione com querySelector e querySelectorAll, altere texto com textContent (seguro), classes com classList e crie elementos com createElement. Evite innerHTML com dados do usuário, pois abre brecha para XSS, e agrupe inserções em um DocumentFragment.",
    [
      "querySelector usa seletores CSS; querySelectorAll devolve NodeList.",
      "Prefira textContent a innerHTML com dados do usuário.",
      "classList.add/remove/toggle controla classes.",
    ],
    [
      "Criar uma lista de tarefas dinamicamente com createElement",
      "Alternar uma classe em um elemento com classList.toggle",
      "Converter uma NodeList em array e aplicar map",
    ],
    [
      "Qual a diferença entre textContent e innerHTML?",
      "textContent trata o valor como texto puro (seguro); innerHTML interpreta HTML e, com dados de usuário, permite XSS.",
    ],
    [
      "Gerar itens de lista",
      "Escreva itensDeLista(textos) que retorna uma string com um <li> para cada texto, escapando os caracteres < e > por &lt; e &gt;.",
      "Use map para montar cada li e join para juntar tudo.",
      'function itensDeLista(textos) {\n  return textos\n    .map((texto) => "<li>" + texto.replaceAll("<", "&lt;").replaceAll(">", "&gt;") + "</li>")\n    .join("");\n}\n',
      "function itensDeLista(textos) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Eventos e delegação",
    "Eventos reagem a cliques, teclas e envios de formulário via addEventListener. Eventos sobem pela árvore (bubbling), então um único listener no pai pode tratar vários filhos (delegação) usando event.target.closest. Use preventDefault para cancelar o comportamento padrão e { once: true } para listeners de uso único.",
    [
      "addEventListener é a forma recomendada de registrar eventos.",
      "Delegação usa um listener no pai e target.closest.",
      "preventDefault cancela o comportamento padrão do navegador.",
    ],
    [
      "Interceptar o submit de um formulário e ler os dados com FormData",
      "Implementar delegação de eventos em uma lista com botões de remover",
      "Demonstrar o bubbling com três elementos aninhados",
    ],
    [
      "O que é delegação de eventos?",
      "Registrar um único listener no elemento pai e identificar o filho pelo event.target, funcionando também para elementos criados depois.",
    ],
    [
      "Alternar item na lista",
      "Escreva alternarItem(lista, valor) que retorna uma nova lista sem o valor se ele existir, ou com o valor adicionado ao final se não existir.",
      "Use includes, filter e spread.",
      "function alternarItem(lista, valor) {\n  return lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor];\n}\n",
      "function alternarItem(lista, valor) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "localStorage e persistência no navegador",
    "O localStorage guarda pares chave-valor de texto no navegador, sem expiração. Como só aceita strings, serialize objetos com JSON.stringify e leia com JSON.parse dentro de try/catch. Nunca guarde dados sensíveis (tokens, senhas) nele, pois qualquer script da página consegue ler. sessionStorage dura só a aba.",
    [
      "localStorage só guarda strings; use JSON para objetos.",
      "Envolva JSON.parse em try/catch ao ler dados antigos.",
      "Nunca guarde tokens ou senhas no localStorage.",
    ],
    [
      "Salvar e recuperar uma lista de tarefas no localStorage",
      "Tratar JSON inválido ao ler os dados salvos",
      "Inspecionar o localStorage na aba Application do DevTools",
    ],
    [
      "Por que não guardar tokens de autenticação no localStorage?",
      "Qualquer script injetado por XSS consegue lê-lo. Cookies HttpOnly não são acessíveis por JavaScript.",
    ],
    [
      "Leitura segura do armazenamento",
      "Escreva lerLista(texto) que recebe o texto salvo e retorna o array parseado, ou [] se o texto for nulo, inválido ou não for um array.",
      "Use try/catch e Array.isArray.",
      "function lerLista(texto) {\n  if (!texto) return [];\n  try {\n    const valor = JSON.parse(texto);\n    return Array.isArray(valor) ? valor : [];\n  } catch {\n    return [];\n  }\n}\n",
      "function lerLista(texto) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Acessibilidade e ARIA",
    "Acessibilidade garante que todos usem a página, inclusive com leitor de tela e teclado. Priorize HTML semântico e use ARIA apenas quando necessário (aria-label, aria-expanded, role). Garanta foco visível, ordem lógica de tabulação, contraste suficiente e mensagens de erro associadas aos campos. Teste navegando só com o teclado.",
    [
      "HTML semântico resolve a maior parte da acessibilidade.",
      "ARIA complementa; não substitui elementos nativos.",
      "Teste a página navegando apenas com o teclado.",
    ],
    [
      "Navegar na sua página só com Tab e Enter e corrigir o que falhar",
      "Adicionar aria-label a botões que só têm ícone",
      "Verificar o contraste de cores com uma ferramenta",
    ],
    [
      "Quando usar ARIA?",
      "Somente quando não há elemento HTML nativo que expresse o papel ou o estado. A primeira regra do ARIA é preferir HTML semântico.",
    ],
    [
      "Rótulo acessível",
      "Escreva rotuloDoBotao(texto, icone) que retorna o texto se ele não estiver vazio; caso contrário retorna 'Botão ' mais o nome do ícone.",
      "Verifique texto.trim() antes de montar o rótulo.",
      'function rotuloDoBotao(texto, icone) {\n  return texto.trim() !== "" ? texto : "Botão " + icone;\n}\n',
      "function rotuloDoBotao(texto, icone) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Portfólio v1",
    "Construa a primeira versão do seu portfólio com HTML, CSS e um pouco de JavaScript: apresentação, projetos, habilidades e contato. Use HTML semântico, layout responsivo com Grid e Flexbox e foco em acessibilidade. Publique no GitHub Pages para ter um link real para compartilhar. Esta versão será refeita em Next.js na Seção 5.",
    [
      "Um portfólio simples e publicado vale mais que um perfeito e escondido.",
      "Combine semântica, responsividade e acessibilidade.",
      "O GitHub Pages publica sites estáticos gratuitamente.",
    ],
    [
      "Montar as seções: apresentação, projetos, habilidades e contato",
      "Tornar o layout responsivo em 375 px e 1280 px",
      "Publicar o portfólio no GitHub Pages",
    ],
    [
      "O que um portfólio inicial deve mostrar?",
      "Quem você é, projetos com descrição e link, tecnologias que domina e formas de contato, com código e deploy acessíveis.",
    ],
    [
      "Montar cartão de projeto",
      "Escreva cartaoDeProjeto({ titulo, descricao, link }) que retorna '<article><h3>titulo</h3><p>descricao</p><a href=\"link\">Ver projeto</a></article>'.",
      "Interpole os três valores na string.",
      'function cartaoDeProjeto({ titulo, descricao, link }) {\n  return "<article><h3>" + titulo + "</h3><p>" + descricao + "</p><a href=\\"" + link + "\\">Ver projeto</a></article>";\n}\n',
      "function cartaoDeProjeto(projeto) {\n  \n}\n",
    ],
  ),
  lesson(
    CONTEXT,
    "Marco: checklist e flashcards no localStorage",
    "Marco da seção: construir, só com HTML, CSS e JavaScript, uma página de estudos com checklist de tarefas e flashcards que persistem no localStorage. Separe as responsabilidades em funções puras (regras) e funções de interface (DOM), reaproveitando o que aprendeu sobre eventos, formulários e armazenamento. Esse protótipo vira o modelo do sistema que você fará em React.",
    [
      "Separe regras (funções puras) da manipulação do DOM.",
      "Persista o estado serializado no localStorage.",
      "O protótipo servirá de modelo para o sistema em React.",
    ],
    [
      "Criar o checklist com adicionar, marcar e remover tarefas",
      "Criar flashcards com virar o card e marcar como revisado",
      "Persistir tudo no localStorage e recarregar a página para testar",
    ],
    [
      "Por que separar funções puras da manipulação do DOM?",
      "Funções puras são fáceis de testar e reaproveitar; o código de DOM fica fino e só liga o resultado à interface.",
    ],
    [
      "Porcentagem do checklist",
      "Escreva porcentagemConcluida(tarefas) que recebe objetos { feita } e retorna o percentual de tarefas feitas arredondado para inteiro. Para lista vazia, retorne 0.",
      "Conte as feitas com filter e trate a lista vazia antes de dividir.",
      "function porcentagemConcluida(tarefas) {\n  if (tarefas.length === 0) return 0;\n  const feitas = tarefas.filter((tarefa) => tarefa.feita).length;\n  return Math.round((feitas / tarefas.length) * 100);\n}\n",
      "function porcentagemConcluida(tarefas) {\n  \n}\n",
    ],
  ),
  evaluation(
    CONTEXT,
    "Avaliação da Seção 2: HTML, CSS e DOM",
    "Avaliação da seção cobrindo HTML semântico, formulários, box model, Flexbox, Grid, responsividade, DOM, eventos, localStorage e acessibilidade. Meta: nota 85; mínimo 70 para avançar para TypeScript.",
    [
      "A avaliação cobre as Aulas 15 a 26.",
      "Meta de nota 85; mínimo 70.",
      "Refaça os tópicos fracos antes de avançar.",
    ],
    [
      "Qual propriedade define o espaçamento entre itens de Flexbox e Grid?",
      "A propriedade gap, que cria espaço entre os filhos sem depender de margens.",
    ],
  ),
  review(
    CONTEXT,
    "Revisão da Seção 2",
    "Revise a seção refazendo páginas do zero e explicando conceitos em voz alta: semântica, box model, Flexbox x Grid, responsividade, DOM e eventos, persistência e acessibilidade. Refaça o protótipo de checklist sem consultar o código, anote o que travou e transforme as lacunas em flashcards novos.",
    [
      "Reconstruir do zero revela as lacunas reais.",
      "Escolha Flexbox para uma dimensão e Grid para duas.",
      "Transforme cada dúvida em um flashcard.",
    ],
    [
      "Refazer um layout responsivo sem consultar a solução",
      "Revisar os flashcards vencidos da Seção 2",
      "Anotar três lacunas e criar flashcards para elas",
    ],
    [
      "Como decidir entre Flexbox e Grid?",
      "Flexbox para alinhar itens em uma direção (linha ou coluna); Grid para layouts em linhas e colunas ao mesmo tempo.",
    ],
    [
      "Alternar tema",
      "Escreva proximoTema(atual) que retorna 'escuro' se o tema atual for 'claro' e 'claro' em qualquer outro caso.",
      "Um operador ternário resolve.",
      'function proximoTema(atual) {\n  return atual === "claro" ? "escuro" : "claro";\n}\n',
      "function proximoTema(atual) {\n  \n}\n",
    ],
  ),
];
