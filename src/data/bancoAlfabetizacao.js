// (c) 2026 Guillermo Roger Hernandez Chandia - ADS
export const BANCO_VOGAIS = [
  { id: 'vog_a', simbolo: 'A', audioPergunta: 'alfa_a.m4a', audio: 'letra_a.m4a' },
  { id: 'vog_e', simbolo: 'E', audioPergunta: 'alfa_e.m4a', audio: 'letra_e.m4a' },
  { id: 'vog_i', simbolo: 'I', audioPergunta: 'alfa_i.m4a', audio: 'letra_i.m4a' },
  { id: 'vog_o', simbolo: 'O', audioPergunta: 'alfa_o.m4a', audio: 'letra_o.m4a' },
  { id: 'vog_u', simbolo: 'U', audioPergunta: 'alfa_u.m4a', audio: 'letra_u.m4a' }
];

export const BANCO_NUMERAIS = [
  { id: 'num_0', simbolo: '0', audioPergunta: 'alfa_perg_0.m4a', audio: 'num_0.m4a' },
  { id: 'num_1', simbolo: '1', audioPergunta: 'alfa_perg_1.m4a', audio: 'num_1.m4a' },
  { id: 'num_2', simbolo: '2', audioPergunta: 'alfa_perg_2.m4a', audio: 'num_2.m4a' },
  { id: 'num_3', simbolo: '3', audioPergunta: 'alfa_perg_3.m4a', audio: 'num_3.m4a' },
  { id: 'num_4', simbolo: '4', audioPergunta: 'alfa_perg_4.m4a', audio: 'num_4.m4a' },
  { id: 'num_5', simbolo: '5', audioPergunta: 'alfa_perg_5.m4a', audio: 'num_5.m4a' },
  { id: 'num_6', simbolo: '6', audioPergunta: 'alfa_perg_6.m4a', audio: 'num_6.m4a' },
  { id: 'num_7', simbolo: '7', audioPergunta: 'alfa_perg_7.m4a', audio: 'num_7.m4a' },
  { id: 'num_8', simbolo: '8', audioPergunta: 'alfa_perg_8.m4a', audio: 'num_8.m4a' },
  { id: 'num_9', simbolo: '9', audioPergunta: 'alfa_perg_9.m4a', audio: 'num_9.m4a' }
];

// Gerador de Contas (Adição Simples com resultado <= 9)
export const GERAR_CONTAS = () => {
  const contas = [];
  for (let n1 = 1; n1 <= 5; n1++) {
    for (let n2 = 1; n2 <= 4; n2++) {
      const soma = n1 + n2;
      if (soma <= 9) {
        contas.push({
          id: `conta_${n1}_${n2}`,
          simbolo: `${soma}`,
          expressao: `${n1} + ${n2}`,
          audioPergunta: `alfa_perg_${soma}.m4a`, // "Onde está o número X?"
          audio: `num_${soma}.m4a`
        });
      }
    }
  }
  return contas;
};