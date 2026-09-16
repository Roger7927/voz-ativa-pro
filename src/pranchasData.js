// Estrutura de Navegação AAC - Padrão Proloquo / Livox
// Suporta navegação hierárquica (Pastas) e emissão direta (Palavras)

export const PRANCHAS_INICIAIS = {
  raiz: {
    id: 'raiz',
    nome: 'Prancha Principal',
    itens: [
      // 1. Ações e Respostas Rápidas (Core Words)
      { id: 'c1', tipo: 'palavra', texto: 'Eu', chaveSvg: 'user', cor: 'c-people', audio: 'Eu.m4a' },
      { id: 'c2', tipo: 'palavra', texto: 'Sim', chaveSvg: 'check', cor: 'c-social', audio: 'sim.m4a' },
      { id: 'c3', tipo: 'palavra', texto: 'Não', chaveSvg: 'cross', cor: 'c-social', audio: 'nao.m4a' },
      { id: 'c4', tipo: 'palavra', texto: 'Ajuda', chaveSvg: 'ajuda', cor: 'c-social', audio: 'ajuda.m4a' },
      { id: 'c5', tipo: 'palavra', texto: 'Parar', chaveSvg: 'stop', cor: 'c-action', audio: 'parar.m4a' },
      { id: 'c6', tipo: 'palavra', texto: 'Mais', chaveSvg: 'check', cor: 'c-social', audio: null },

      // 2. Pastas Temáticas (Folders)
      { 
        id: 'f_comer', 
        tipo: 'pasta', 
        texto: 'Alimentação 📁', 
        chaveSvg: 'comer', 
        cor: 'c-action',
        destino: 'pasta_comer' 
      },
      { 
        id: 'f_necessidades', 
        tipo: 'pasta', 
        texto: 'Necessidades 📁', 
        chaveSvg: 'banheiro', 
        cor: 'c-object',
        destino: 'pasta_necessidades' 
      },
      { 
        id: 'f_sentimentos', 
        tipo: 'pasta', 
        texto: 'Sentimentos 📁', 
        chaveSvg: 'happy', 
        cor: 'c-feeling',
        destino: 'pasta_sentimentos' 
      },
      { 
        id: 'f_pessoas', 
        tipo: 'pasta', 
        texto: 'Pessoas 📁', 
        chaveSvg: 'teacher', 
        cor: 'c-people',
        destino: 'pasta_pessoas' 
      }
    ]
  },

  // Subpasta: Alimentação expandida
  pasta_comer: {
    id: 'pasta_comer',
    nome: 'Comer & Beber',
    pai: 'raiz',
    itens: [
      { id: 'b1', tipo: 'palavra', texto: 'Água', chaveSvg: 'agua', cor: 'c-object', audio: 'agua.m4a' },
      { id: 'b2', tipo: 'palavra', texto: 'Comer', chaveSvg: 'comer', cor: 'c-action', audio: 'comer.m4a' },
      { id: 'cm1', tipo: 'palavra', texto: 'Suco', chaveSvg: 'agua', cor: 'c-object', audio: null },
      { id: 'cm2', tipo: 'palavra', texto: 'Fruta', chaveSvg: 'comer', cor: 'c-object', audio: null },
      { id: 'cm3', tipo: 'palavra', texto: 'Pão', chaveSvg: 'comer', cor: 'c-object', audio: null },
      { id: 'cm4', tipo: 'palavra', texto: 'Bolacha', chaveSvg: 'comer', cor: 'c-object', audio: null }
    ]
  },

  // Subpasta: Necessidades Fisiológicas e Cuidados
  pasta_necessidades: {
    id: 'pasta_necessidades',
    nome: 'Necessidades & Cuidados',
    pai: 'raiz',
    itens: [
      { id: 'b3', tipo: 'palavra', texto: 'Banheiro', chaveSvg: 'banheiro', cor: 'c-object', audio: 'banheiro.m4a' },
      { id: 'b4', tipo: 'palavra', texto: 'Dor', chaveSvg: 'dor', cor: 'c-feeling', audio: 'dor.m4a' },
      { id: 'b5', tipo: 'palavra', texto: 'Remédio', chaveSvg: 'remedio', cor: 'c-object', audio: 'remedio.m4a' },
      { id: 'b12', tipo: 'palavra', texto: 'Escovar os Dentes', chaveSvg: 'agua', cor: 'c-action', audio: 'escovar_os_dentes.m4a' },
      { id: 'b13', tipo: 'palavra', texto: 'Tomar Banho', chaveSvg: 'agua', cor: 'c-action', audio: 'tomar_banho.m4a' },
      { id: 'b14', tipo: 'palavra', texto: 'Lavar as Mãos', chaveSvg: 'agua', cor: 'c-action', audio: 'lavar_as_maos.m4a' }
    ]
  },

  // Subpasta: Sentimentos e Regulação Sensorial
  pasta_sentimentos: {
    id: 'pasta_sentimentos',
    nome: 'Sentimentos & Emoções',
    pai: 'raiz',
    itens: [
      { id: 's1', tipo: 'palavra', texto: 'Feliz', chaveSvg: 'happy', cor: 'c-feeling', audio: 'feliz.m4a' },
      { id: 's2', tipo: 'palavra', texto: 'Triste', chaveSvg: 'sad', cor: 'c-feeling', audio: 'triste.m4a' },
      { id: 's3', tipo: 'palavra', texto: 'Bravo', chaveSvg: 'bravo', cor: 'c-feeling', audio: 'bravo.m4a' },
      { id: 's4', tipo: 'palavra', texto: 'Cansado', chaveSvg: 'sleep', cor: 'c-feeling', audio: 'cansado.m4a' },
      { id: 's5', tipo: 'palavra', texto: 'Barulho', chaveSvg: 'ear', cor: 'c-feeling', audio: 'barulho.m4a' },
      { id: 's6', tipo: 'palavra', texto: 'Medo', chaveSvg: 'fear', cor: 'c-feeling', audio: 'estou_com_medo.m4a' },
      { id: 's7', tipo: 'palavra', texto: 'Calma', chaveSvg: 'happy', cor: 'c-feeling', audio: 'calma.m4a' }
    ]
  },

  // Subpasta: Pessoas e Vínculos
  pasta_pessoas: {
    id: 'pasta_pessoas',
    nome: 'Pessoas & Família',
    pai: 'raiz',
    itens: [
      { id: 'p1', tipo: 'palavra', texto: 'Professora', chaveSvg: 'teacher', cor: 'c-people', audio: 'Professora.m4a' },
      { id: 'p2', tipo: 'palavra', texto: 'Colega', chaveSvg: 'friend', cor: 'c-people', audio: 'Colega.m4a' },
      { id: 'p3', tipo: 'palavra', texto: 'Mamãe', chaveSvg: 'mother', cor: 'c-people', audio: 'Mamãe.m4a' },
      { id: 'p4', tipo: 'palavra', texto: 'Papai', chaveSvg: 'father', cor: 'c-people', audio: 'Papai.m4a' },
      { id: 'p5', tipo: 'palavra', texto: 'Você', chaveSvg: 'user', cor: 'c-people', audio: 'Você.m4a' },
      { id: 'p6', tipo: 'palavra', texto: 'Vovó', chaveSvg: 'mother', cor: 'c-people', audio: 'vovo.m4a' },
      { id: 'p7', tipo: 'palavra', texto: 'Vovô', chaveSvg: 'father', cor: 'c-people', audio: 'vovo_m.m4a' }
    ]
  }
};