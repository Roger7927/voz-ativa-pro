export const BANCO_ROTINAS = [
  // 1. Manhã e Despertar
  {
    id: 'rot_manha',
    categoria: 'Rotina Diária',
    nivel: 1,
    titulo: 'Hora de Acordar',
    audioPergunta: 'rotina_manha.m4a',
    descricaoClinica: 'Sequenciamento executivo de autocuidado matinal.',
    passo1: { texto: 'Dormir', img: 'dormir.png', desc: 'Acordar' },
    passo2: { texto: 'Banheiro', img: 'banheiro.png', desc: 'Lavar o rosto' },
    passoAlvo: { texto: 'Comer', audio: 'comer.m4a', img: 'comer.png', desc: 'Café da manhã' },
    distratores: [
      { texto: 'Brincar', audio: 'brincar.m4a', img: 'brincar.png', motivoErro: 'Distrator de lazer' },
      { texto: 'Bravo', audio: 'bravo.m4a', img: 'bravo.png', motivoErro: 'Distrator emocional' }
    ]
  },

  // 2. Passeio e Mobilidade
  {
    id: 'rot_passeio',
    categoria: 'Mobilidade',
    nivel: 1,
    titulo: 'Hora do Passeio',
    audioPergunta: 'rotina_passeio.m4a',
    descricaoClinica: 'Transição de ambiente e prontidão motora.',
    passo1: { texto: 'Água', img: 'agua.png', desc: 'Beber água' },
    passo2: { texto: 'Mamãe', img: 'mamae.png', desc: 'Dar a mão' },
    passoAlvo: { texto: 'Passear', audio: 'quero_passear.m4a', img: 'passear.png', desc: 'Sair para a rua' },
    distratores: [
      { texto: 'Dormir', audio: 'dormir_novo.m4a', img: 'dormir.png', motivoErro: 'Inadequação de horário' },
      { texto: 'Dor', audio: 'dor.m4a', img: 'dor.png', motivoErro: 'Distrator somático' }
    ]
  },

  // 3. Dor e Suporte
  {
    id: 'rot_dor_cuidado',
    categoria: 'Comunicação Funcional',
    nivel: 2,
    titulo: 'Sentindo Dor',
    audioPergunta: 'rotina_machucou.m4a',
    descricaoClinica: 'Reconhecimento somático e requisição direta de apoio.',
    passo1: { texto: 'Dor', img: 'dor.png', desc: 'Machucado' },
    passo2: { texto: 'Ajuda', img: 'ajuda.png', desc: 'Pedir socorro' },
    passoAlvo: { texto: 'Calma', audio: 'calma.m4a', img: 'calma.png', desc: 'Ficar calmo' },
    distratores: [
      { texto: 'Passear', audio: 'quero_passear.m4a', img: 'passear.png', motivoErro: 'Esquiva motora' },
      { texto: 'Barulho', audio: 'barulho.m4a', img: 'barulho.png', motivoErro: 'Distrator sensorial' }
    ]
  },

  // 4. Fadiga e Reposição Hídrica
  {
    id: 'rot_sede_brincar',
    categoria: 'Fisiologia Básica',
    nivel: 2,
    titulo: 'Depois de Brincar',
    audioPergunta: 'pergunta_cansado.m4a',
    descricaoClinica: 'Causalidade entre gasto energético e hidratação.',
    passo1: { texto: 'Brincar', img: 'brincar.png', desc: 'Brincou bastante' },
    passo2: { texto: 'Cansado', img: 'cansado.png', desc: 'Sentiu cansaço' },
    passoAlvo: { texto: 'Água', audio: 'agua.m4a', img: 'agua.png', desc: 'Beber água' },
    distratores: [
      { texto: 'Bravo', audio: 'bravo.m4a', img: 'bravo.png', motivoErro: 'Confusão de estado físico com afeto' },
      { texto: 'Banheiro', audio: 'banheiro.m4a', img: 'banheiro.png', motivoErro: 'Necessidade secundária' }
    ]
  },

  // 5. Higiene Pré-Refeição
  {
    id: 'rot_lanche',
    categoria: 'Higiene e Alimentação',
    nivel: 1,
    titulo: 'Hora de Comer',
    audioPergunta: 'rotina_lanche.m4a',
    descricaoClinica: 'Protocolo funcional de higiene antes da alimentação.',
    passo1: { texto: 'Banheiro', img: 'banheiro.png', desc: 'Ir até a pia' },
    passo2: { texto: 'Lavar as Mãos', img: 'lavar-maos.png', desc: 'Lavar as mãos' },
    passoAlvo: { texto: 'Comer', audio: 'comer.m4a', img: 'comer.png', desc: 'Comer o lanche' },
    distratores: [
      { texto: 'Dormir', audio: 'dormir_novo.m4a', img: 'dormir.png', motivoErro: 'Quebra de intenção' },
      { texto: 'Bravo', audio: 'bravo.m4a', img: 'bravo.png', motivoErro: 'Distrator afetivo' }
    ]
  },

  // 6. Higiene Noturna e Sono
  {
    id: 'rot_dormir_noite',
    categoria: 'Descanso e Sono',
    nivel: 2,
    titulo: 'Hora de Dormir',
    audioPergunta: 'rotina_dormir.m4a',
    descricaoClinica: 'Sequência de desaceleração motora e repouso.',
    passo1: { texto: 'Tomar Banho', img: 'tomar-banho.png', desc: 'Tomar banho' },
    passo2: { texto: 'Calma', img: 'calma.png', desc: 'Vestir a roupa de dormir' },
    passoAlvo: { texto: 'Dormir', audio: 'dormir_novo.m4a', img: 'dormir.png', desc: 'Dormir na cama' },
    distratores: [
      { texto: 'Brincar', audio: 'brincar.m4a', img: 'brincar.png', motivoErro: 'Hiperestímulo noturno' },
      { texto: 'Passear', audio: 'quero_passear.m4a', img: 'passear.png', motivoErro: 'Ação inadequada ao horário' }
    ]
  },

  // 7. Calor e Hidratação
  {
    id: 'rot_sol_calor',
    categoria: 'Fisiologia Básica',
    nivel: 2,
    titulo: 'Calor e Sede',
    audioPergunta: 'rotina_calor_agua.m4a',
    descricaoClinica: 'Percepção de calor ambiental e busca por reposição hídrica.',
    passo1: { texto: 'Passear', img: 'passear.png', desc: 'Caminhar no sol' },
    passo2: { texto: 'Calor', img: 'calor.png', desc: 'Sentir calor' },
    passoAlvo: { texto: 'Água', audio: 'agua.m4a', img: 'agua.png', desc: 'Beber água fresca' },
    distratores: [
      { texto: 'Dormir', audio: 'dormir_novo.m4a', img: 'dormir.png', motivoErro: 'Inércia motora' },
      { texto: 'Dor', audio: 'dor.m4a', img: 'dor.png', motivoErro: 'Confusão somática' }
    ]
  },

  // 8. Autocuidado Bucal
  {
    id: 'rot_escovar_dentes',
    categoria: 'Higiene e Autonomia',
    nivel: 3,
    titulo: 'Escovar os Dentes',
    audioPergunta: 'rotina_escovar_dentes.m4a',
    descricaoClinica: 'Condicionamento de assepsia bucal pós-prandial.',
    passo1: { texto: 'Comer', img: 'comer.png', desc: 'Terminar a refeição' },
    passo2: { texto: 'Banheiro', img: 'banheiro.png', desc: 'Ir até a pia' },
    passoAlvo: { texto: 'Escovar os Dentes', audio: 'escovar_dentes.m4a', img: 'escovar-dentes.png', desc: 'Escovar os dentes' },
    distratores: [
      { texto: 'Brincar', audio: 'brincar.m4a', img: 'brincar.png', motivoErro: 'Abandono de rotina básica' },
      { texto: 'Dormir', audio: 'dormir_novo.m4a', img: 'dormir.png', motivoErro: 'Salto indevido de protocolo' }
    ]
  }
];