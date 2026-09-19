// (c) 2026 Guillermo Roger Hernandez Chandia - ADS

export const ALFABETO_COMPLETO = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

export const BANCO_PALAVRAS = [
  { id: 'pal_bola', palavra: 'BOLA', emoji: '⚽', dica: 'Brinquedo redondo', audioDica: 'dica_bola.m4a' },
  { id: 'pal_casa', palavra: 'CASA', emoji: '🏠', dica: 'Onde a gente mora', audioDica: 'dica_casa.m4a' },
  { id: 'pal_gato', palavra: 'GATO', emoji: '🐱', dica: 'Animal que faz miau', audioDica: 'dica_gato.m4a' },
  { id: 'pal_sol', palavra: 'SOL', emoji: '☀️', dica: 'Brilha no céu de dia', audioDica: 'dica_sol.m4a' },
  { id: 'pal_agua', palavra: 'AGUA', emoji: '💧', dica: 'Boa para matar a sede', audioDica: 'dica_agua.m4a' },
  { id: 'pal_pao', palavra: 'PAO', emoji: '🍞', dica: 'Gostoso no café', audioDica: 'dica_pao.m4a' },
  { id: 'pal_uva', palavra: 'UVA', emoji: '🍇', dica: 'Fruta roxinha', audioDica: 'dica_uva.m4a' },
  { id: 'pal_lua', palavra: 'LUA', emoji: '🌙', dica: 'Ilumina toda a noite', audioDica: 'dica_lua.m4a' },
  { id: 'pal_peixe', palavra: 'PEIXE', emoji: '🐟', dica: 'Nada no fundo do mar', audioDica: 'dica_peixe.m4a' },
  { id: 'pal_trem', palavra: 'TREM', emoji: '🚂', dica: 'Anda no trilho', audioDica: 'dica_trem.m4a' },
  { id: 'pal_sapo', palavra: 'SAPO', emoji: '🐸', dica: 'Pula na beira do rio', audioDica: 'dica_sapo.m4a' },
  { id: 'pal_dado', palavra: 'DADO', emoji: '🎲', dica: 'Cubo com pontinhos', audioDica: 'dica_dado.m4a' },
  { id: 'pal_pipa', palavra: 'PIPA', emoji: '🪁', dica: 'Voa alto no vento', audioDica: 'dica_pipa.m4a' },
  { id: 'pal_carro', palavra: 'CARRO', emoji: '🚗', dica: 'Anda na rua', audioDica: 'dica_carro.m4a' },
  { id: 'pal_pato', palavra: 'PATO', emoji: '🦆', dica: 'Nada na lagoa', audioDica: 'dica_pato.m4a' },
  { id: 'pal_vaca', palavra: 'VACA', emoji: '🐮', dica: 'Animal que dá leite', audioDica: 'dica_vaca.m4a' },
  { id: 'pal_leao', palavra: 'LEAO', emoji: '🦁', dica: 'O rei da selva', audioDica: 'dica_leao.m4a' },
  { id: 'pal_urso', palavra: 'URSO', emoji: '🐻', dica: 'Fofinho e peludo', audioDica: 'dica_urso.m4a' },
  { id: 'pal_bolo', palavra: 'BOLO', emoji: '🎂', dica: 'Festa de aniversário', audioDica: 'dica_bolo.m4a' },
  { id: 'pal_robo', palavra: 'ROBO', emoji: '🤖', dica: 'Amigo de lata', audioDica: 'dica_robo.m4a' }
];

export const BANCO_VOGAIS = [
  { id: 'vog_a', simbolo: 'A', dica: '✈️ Avião', audioPergunta: 'alfa_a.m4a', audio: 'letra_a.m4a' },
  { id: 'vog_e', simbolo: 'E', dica: '🐘 Elefante', audioPergunta: 'alfa_e.m4a', audio: 'letra_e.m4a' },
  { id: 'vog_i', simbolo: 'I', dica: '🍦 Iogurte', audioPergunta: 'alfa_i.m4a', audio: 'letra_i.m4a' },
  { id: 'vog_o', simbolo: 'O', dica: '🥚 Ovo', audioPergunta: 'alfa_o.m4a', audio: 'letra_o.m4a' },
  { id: 'vog_u', simbolo: 'U', dica: '🍇 Uva', audioPergunta: 'alfa_u.m4a', audio: 'letra_u.m4a' }
];

export const BANCO_NUMERAIS = [
  { id: 'num_0', simbolo: '0', dica: 'Vazio', audioPergunta: 'alfa_perg_0.m4a', audio: 'num_0.m4a' },
  { id: 'num_1', simbolo: '1', dica: '⭐', audioPergunta: 'alfa_perg_1.m4a', audio: 'num_1.m4a' },
  { id: 'num_2', simbolo: '2', dica: '⭐⭐', audioPergunta: 'alfa_perg_2.m4a', audio: 'num_2.m4a' },
  { id: 'num_3', simbolo: '3', dica: '⭐⭐⭐', audioPergunta: 'alfa_perg_3.m4a', audio: 'num_3.m4a' },
  { id: 'num_4', simbolo: '4', dica: '⭐⭐⭐⭐', audioPergunta: 'alfa_perg_4.m4a', audio: 'num_4.m4a' },
  { id: 'num_5', simbolo: '5', dica: '⭐⭐⭐⭐⭐', audioPergunta: 'alfa_perg_5.m4a', audio: 'num_5.m4a' },
  { id: 'num_6', simbolo: '6', dica: '6 pontos', audioPergunta: 'alfa_perg_6.m4a', audio: 'num_6.m4a' },
  { id: 'num_7', simbolo: '7', dica: '7 pontos', audioPergunta: 'alfa_perg_7.m4a', audio: 'num_7.m4a' },
  { id: 'num_8', simbolo: '8', dica: '8 pontos', audioPergunta: 'alfa_perg_8.m4a', audio: 'num_8.m4a' },
  { id: 'num_9', simbolo: '9', dica: '9 pontos', audioPergunta: 'alfa_perg_9.m4a', audio: 'num_9.m4a' }
];

export const GERAR_CONTAS = () => {
  const contas = [];
  for (let n1 = 1; n1 <= 5; n1++) {
    for (let n2 = 1; n2 <= 4; n2++) {
      const soma = n1 + n2;
      if (soma <= 9) {
        contas.push({
          id: `conta_${n1}_${n2}`,
          n1,
          n2,
          simbolo: `${soma}`,
          expressao: `${n1} + ${n2}`,
          audioPergunta: `alfa_perg_${soma}.m4a`,
          audio: `num_${soma}.m4a`
        });
      }
    }
  }
  return contas;
};