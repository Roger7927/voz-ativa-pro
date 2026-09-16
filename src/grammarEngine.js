// Motor Morfossintático para CAA (AAC Natural Language Processing Engine)
// Transforma combinações de pictogramas em orações naturais estruturadas

export function processarFraseNatural(tokens) {
  if (!tokens || tokens.length === 0) return '';

  const lista = tokens.map((t) => (t.texto || '').trim().toLowerCase());
  const tamanho = lista.length;

  // 1. Caso de Cartão Único: Constrói intenção completa
  if (tamanho === 1) {
    const palavra = lista[0];
    const regrasDiretas = {
      'banheiro': 'Eu preciso ir ao banheiro.',
      'água': 'Eu quero água.',
      'agua': 'Eu quero água.',
      'comer': 'Eu quero comer.',
      'ajuda': 'Por favor, preciso de ajuda.',
      'dor': 'Estou sentindo dor.',
      'remédio': 'Preciso tomar remédio.',
      'remedio': 'Preciso tomar remédio.',
      'frio': 'Estou com frio.',
      'calor': 'Estou com calor.',
      'cansado': 'Estou muito cansado.',
      'dormir': 'Quero ir dormir.',
      'parar': 'Por favor, pare.',
      'passear': 'Quero ir passear.',
      'brincar': 'Quero brincar.',
      'esperar': 'Espere um momento.'
    };
    if (regrasDiretas[palavra]) return regrasDiretas[palavra];
    return tokens[0].texto + '.';
  }

  const p1 = lista[0];
  const p2 = lista[1];

  // 2. Construções Iniciadas com o Sujeito 'Eu'
  if (p1 === 'eu') {
    if (p2 === 'banheiro') return 'Eu quero ir ao banheiro.';
    if (p2 === 'água' || p2 === 'agua') return 'Eu quero beber água.';
    if (p2 === 'comer') {
      if (tamanho >= 3) {
        const comida = lista.slice(2).join(' ');
        return `Eu quero comer ${comida}.`;
      }
      return 'Eu quero comer.';
    }
    if (p2 === 'brincar') {
      if (tamanho >= 3) {
        const parceiro = lista.slice(2).join(' ');
        return `Eu quero brincar com ${parceiro}.`;
      }
      return 'Eu quero brincar.';
    }
    if (p2 === 'dormir') return 'Eu quero dormir.';
    if (p2 === 'passear') return 'Eu quero passear.';
    if (p2 === 'ajuda') return 'Eu preciso de ajuda.';
    if (p2 === 'remédio' || p2 === 'remedio') return 'Eu preciso tomar remédio.';
    if (p2.includes('dor')) return 'Eu estou com dor.';
    if (p2 === 'frio') return 'Eu estou com frio.';
    if (p2 === 'calor') return 'Eu estou com calor.';
    if (p2 === 'feliz') return 'Eu estou muito feliz.';
    if (p2 === 'triste') return 'Eu estou triste.';
    if (p2 === 'bravo') return 'Eu estou bravo.';
    if (p2 === 'cansado') return 'Eu estou cansado.';
  }

  // 3. Normalização de Dores e Sintomas Físicos
  const temDor = lista.some((p) => p.includes('dor'));
  if (temDor) {
    if (lista.some((p) => p.includes('cabeça') || p.includes('cabeca'))) {
      return 'Estou com dor de cabeça.';
    }
    if (lista.some((p) => p.includes('barriga'))) {
      return 'Estou com dor de barriga.';
    }
    if (lista.some((p) => p.includes('garganta'))) {
      return 'Estou com dor de garganta.';
    }
    return 'Estou sentindo dor.';
  }

  // 4. Ações Diretas sem Sujeito Explícito
  if (p1 === 'brincar') {
    const alvo = lista.slice(1).join(' ');
    return `Quero brincar com ${alvo}.`;
  }
  if (p1 === 'comer') {
    const alimento = lista.slice(1).join(' ');
    return `Quero comer ${alimento}.`;
  }

  // 5. Fallback Suave de Encadeamento Gramatical
  const fraseConcat = tokens.map((t) => t.texto).join(' ');
  return fraseConcat.charAt(0).toUpperCase() + fraseConcat.slice(1) + '.';
}
