import type { SeedChallenge } from "./types";

export const leetcodeExtrasByDay: Record<number, SeedChallenge> = {
  10: {
    title: "LeetCode: Two Sum",
    description:
      "Dado um array de inteiros nums e um inteiro alvo, retorne os índices de dois números que somam o alvo. Cada entrada tem exatamente uma solução e o mesmo elemento não pode ser usado duas vezes. twoSum([2,7,11,15], 9) retorna [0, 1].",
    starterCode: "function twoSum(nums, alvo) {\n  \n}\n",
    hint: "Guarde em um Map cada número visto e seu índice; para cada item procure alvo - item no Map (O(n)).",
    solutionCode:
      "function twoSum(nums, alvo) {\n  const vistos = new Map();\n  for (let indice = 0; indice < nums.length; indice++) {\n    const complemento = alvo - nums[indice];\n    if (vistos.has(complemento)) return [vistos.get(complemento), indice];\n    vistos.set(nums[indice], indice);\n  }\n  return [];\n}\n",
  },
  16: {
    title: "LeetCode: Valid Palindrome",
    description:
      "Uma frase é palíndromo se, depois de converter para minúsculas e remover tudo que não for letra ou número, lê-se igual de trás para frente. ehPalindromo('A man, a plan, a canal: Panama') retorna true.",
    starterCode: "function ehPalindromo(texto) {\n  \n}\n",
    hint: "Limpe a string com a regex /[^a-z0-9]/g e compare as pontas com dois ponteiros.",
    solutionCode:
      'function ehPalindromo(texto) {\n  const limpo = texto.toLowerCase().replace(/[^a-z0-9]/g, "");\n  let esquerda = 0;\n  let direita = limpo.length - 1;\n  while (esquerda < direita) {\n    if (limpo[esquerda] !== limpo[direita]) return false;\n    esquerda++;\n    direita--;\n  }\n  return true;\n}\n',
  },
  23: {
    title: "LeetCode: FizzBuzz",
    description:
      "Dado um inteiro n, retorne um array de strings de 1 até n: múltiplos de 3 viram 'Fizz', de 5 viram 'Buzz', de ambos 'FizzBuzz' e os demais ficam como o número em texto.",
    starterCode: "function fizzBuzz(n) {\n  \n}\n",
    hint: "Concatene Fizz e Buzz em uma string e use o número quando ela ficar vazia.",
    solutionCode:
      'function fizzBuzz(n) {\n  const resultado = [];\n  for (let numero = 1; numero <= n; numero++) {\n    let texto = "";\n    if (numero % 3 === 0) texto += "Fizz";\n    if (numero % 5 === 0) texto += "Buzz";\n    resultado.push(texto || String(numero));\n  }\n  return resultado;\n}\n',
  },
  30: {
    title: "LeetCode: Contagem de frequência de caracteres",
    description:
      "Dada uma string, retorne um objeto com a quantidade de cada caractere. contarFrequencia('banana') retorna { b: 1, a: 3, n: 2 }. Esse padrão é a base de problemas como First Unique Character.",
    starterCode: "function contarFrequencia(texto) {\n  \n}\n",
    hint: "Percorra com for...of e use frequencia[letra] = (frequencia[letra] ?? 0) + 1.",
    solutionCode:
      "function contarFrequencia(texto) {\n  const frequencia = {};\n  for (const caractere of texto) {\n    frequencia[caractere] = (frequencia[caractere] ?? 0) + 1;\n  }\n  return frequencia;\n}\n",
  },
  37: {
    title: "LeetCode: Reverse String",
    description:
      "Escreva inverterTexto(texto) que retorna a string invertida. inverterTexto('abc') retorna 'cba'.",
    starterCode: "function inverterTexto(texto) {\n  \n}\n",
    hint: "Percorra de trás para frente concatenando, ou use split, reverse e join.",
    solutionCode:
      'function inverterTexto(texto) {\n  let invertido = "";\n  for (let indice = texto.length - 1; indice >= 0; indice--) {\n    invertido += texto[indice];\n  }\n  return invertido;\n}\n',
  },
  44: {
    title: "LeetCode: Valid Anagram",
    description:
      "Dadas duas strings a e b, retorne true se b é um anagrama de a (mesmas letras nas mesmas quantidades, em qualquer ordem). ehAnagrama('listen', 'silent') retorna true.",
    starterCode: "function ehAnagrama(a, b) {\n  \n}\n",
    hint: "Se os tamanhos diferem, retorne false. Conte as letras de a e decremente com as de b.",
    solutionCode:
      "function ehAnagrama(a, b) {\n  if (a.length !== b.length) return false;\n  const contagem = {};\n  for (const letra of a) {\n    contagem[letra] = (contagem[letra] ?? 0) + 1;\n  }\n  for (const letra of b) {\n    if (!contagem[letra]) return false;\n    contagem[letra]--;\n  }\n  return true;\n}\n",
  },
  53: {
    title: "LeetCode: Contains Duplicate",
    description:
      "Dado um array de inteiros, retorne true se algum valor aparece mais de uma vez e false se todos são distintos. temDuplicados([1, 2, 3, 1]) retorna true.",
    starterCode: "function temDuplicados(nums) {\n  \n}\n",
    hint: "Um Set remove duplicatas: compare o tamanho do Set com o do array.",
    solutionCode:
      "function temDuplicados(nums) {\n  return new Set(nums).size !== nums.length;\n}\n",
  },
  60: {
    title: "LeetCode: Best Time to Buy and Sell Stock",
    description:
      "Dado um array precos em que precos[i] é o preço no dia i, retorne o maior lucro de uma compra seguida de uma venda posterior, ou 0 se não houver lucro. lucroMaximo([7,1,5,3,6,4]) retorna 5.",
    starterCode: "function lucroMaximo(precos) {\n  \n}\n",
    hint: "Percorra uma vez guardando o menor preço visto e o melhor lucro até o momento.",
    solutionCode:
      "function lucroMaximo(precos) {\n  let menorPreco = Infinity;\n  let melhorLucro = 0;\n  for (const preco of precos) {\n    menorPreco = Math.min(menorPreco, preco);\n    melhorLucro = Math.max(melhorLucro, preco - menorPreco);\n  }\n  return melhorLucro;\n}\n",
  },
  67: {
    title: "LeetCode: Move Zeroes",
    description:
      "Dado um array de números, mova todos os zeros para o final mantendo a ordem relativa dos demais. Retorne um novo array. moverZeros([0,1,0,3,12]) retorna [1,3,12,0,0].",
    starterCode: "function moverZeros(nums) {\n  \n}\n",
    hint: "Filtre os diferentes de zero e complete com zeros até o tamanho original.",
    solutionCode:
      "function moverZeros(nums) {\n  const diferentes = nums.filter((n) => n !== 0);\n  const zeros = new Array(nums.length - diferentes.length).fill(0);\n  return [...diferentes, ...zeros];\n}\n",
  },
  74: {
    title: "LeetCode: Missing Number",
    description:
      "Dado um array com n números distintos no intervalo de 0 a n, retorne o único número do intervalo que está faltando. numeroFaltante([3,0,1]) retorna 2.",
    starterCode: "function numeroFaltante(nums) {\n  \n}\n",
    hint: "A soma esperada de 0 a n é n*(n+1)/2; subtraia a soma real.",
    solutionCode:
      "function numeroFaltante(nums) {\n  const n = nums.length;\n  const esperado = (n * (n + 1)) / 2;\n  const real = nums.reduce((soma, valor) => soma + valor, 0);\n  return esperado - real;\n}\n",
  },
  81: {
    title: "LeetCode: Single Number",
    description:
      "Dado um array em que todo número aparece duas vezes, exceto um que aparece uma vez, retorne o número único. numeroUnico([4,1,2,1,2]) retorna 4.",
    starterCode: "function numeroUnico(nums) {\n  \n}\n",
    hint: "O operador XOR (^) cancela números iguais: a ^ a = 0 e a ^ 0 = a.",
    solutionCode:
      "function numeroUnico(nums) {\n  return nums.reduce((resultado, valor) => resultado ^ valor, 0);\n}\n",
  },
  88: {
    title: "LeetCode: Valid Parentheses",
    description:
      "Dada uma string com os caracteres ()[]{}, determine se os parênteses estão balanceados e na ordem correta. parentesesValidos('()[]{}') retorna true e parentesesValidos('(]') retorna false.",
    starterCode: "function parentesesValidos(texto) {\n  \n}\n",
    hint: "Use uma pilha: empilhe aberturas e, ao ver um fechamento, confira o topo.",
    solutionCode:
      "function parentesesValidos(texto) {\n  const pares = { ')': '(', ']': '[', '}': '{' };\n  const pilha = [];\n  for (const caractere of texto) {\n    if (pares[caractere]) {\n      if (pilha.pop() !== pares[caractere]) return false;\n    } else {\n      pilha.push(caractere);\n    }\n  }\n  return pilha.length === 0;\n}\n",
  },
  95: {
    title: "LeetCode: Majority Element",
    description:
      "Dado um array de tamanho n, retorne o elemento que aparece mais de n/2 vezes (sempre existe). elementoMajoritario([2,2,1,1,1,2,2]) retorna 2.",
    starterCode: "function elementoMajoritario(nums) {\n  \n}\n",
    hint: "Boyer-Moore: mantenha um candidato e um contador, trocando de candidato quando o contador zera.",
    solutionCode:
      "function elementoMajoritario(nums) {\n  let candidato = null;\n  let contador = 0;\n  for (const numero of nums) {\n    if (contador === 0) candidato = numero;\n    contador += numero === candidato ? 1 : -1;\n  }\n  return candidato;\n}\n",
  },
};
