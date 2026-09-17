export const BANCO_FUNCOES = [
  {
    id: 'fnc_cama',
    titulo: 'Cama',
    situacao: 'Para que serve a cama?',
    audioPergunta: 'pergunta_funcao_cama.m4a',
    iconeSituacao: '🛏️',
    alvo: { texto: 'Dormir', img: 'dormir.png', audio: 'palavra_dormir.m4a' },
    distratores: [
      { texto: 'Brincar', img: 'brincar.png', audio: 'palavra_brincar.m4a' },
      { texto: 'Água', img: 'agua.png', audio: 'water.m4a' }
    ]
  },
  {
    id: 'fnc_copo',
    titulo: 'Copo',
    situacao: 'Para que serve o copo?',
    audioPergunta: 'pergunta_funcao_copo.m4a',
    iconeSituacao: '🥤',
    alvo: { texto: 'Água', img: 'agua.png', audio: 'water.m4a' },
    distratores: [
      { texto: 'Dormir', img: 'dormir.png', audio: 'palavra_dormir.m4a' },
      { texto: 'Bravo', img: 'bravo.png', audio: 'bravo.m4a' }
    ]
  },
  {
    id: 'fnc_prato',
    titulo: 'Prato',
    situacao: 'Para que serve o prato?',
    audioPergunta: 'pergunta_funcao_prato.m4a',
    iconeSituacao: '🍽️',
    alvo: { texto: 'Comer', img: 'comer.png', audio: 'eat.m4a' },
    distratores: [
      { texto: 'Banheiro', img: 'banheiro.png', audio: 'banheiro.m4a' },
      { texto: 'Triste', img: 'triste.png', audio: 'triste.m4a' }
    ]
  },
  {
    id: 'fnc_chuveiro',
    titulo: 'Chuveiro',
    situacao: 'Para que serve o chuveiro?',
    audioPergunta: 'pergunta_funcao_chuveiro.m4a',
    iconeSituacao: '🚿',
    alvo: { texto: 'Banho', img: 'tomar-banho.png', audio: 'palavra_banho.m4a' },
    distratores: [
      { texto: 'Comer', img: 'comer.png', audio: 'eat.m4a' },
      { texto: 'Passear', img: 'passear.png', audio: 'quero_passear.m4a' }
    ]
  },
  {
    id: 'fnc_brinquedo',
    titulo: 'Brinquedo',
    situacao: 'Para que serve o brinquedo?',
    audioPergunta: 'pergunta_funcao_brinquedo.m4a',
    iconeSituacao: '🧸',
    alvo: { texto: 'Brincar', img: 'brincar.png', audio: 'palavra_brincar.m4a' },
    distratores: [
      { texto: 'Dormir', img: 'dormir.png', audio: 'palavra_dormir.m4a' },
      { texto: 'Dor', img: 'dor.png', audio: 'dor.m4a' }
    ]
  },
  {
    id: 'fnc_remedio',
    titulo: 'Remédio',
    situacao: 'Para que serve o remédio?',
    audioPergunta: 'pergunta_funcao_remedio.m4a',
    iconeSituacao: '💊',
    alvo: { texto: 'Ajuda', img: 'ajuda.png', audio: 'palavra_ajuda.m4a' },
    distratores: [
      { texto: 'Brincar', img: 'brincar.png', audio: 'palavra_brincar.m4a' },
      { texto: 'Barulho', img: 'barulho.png', audio: 'barulho.m4a' }
    ]
  }
];