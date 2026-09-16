/* Copyright: (c) 2026 - Guillermo Roger Hernandez Chandia. 
   Status: All Rights Reserved (Todos os Direitos Reservados). 
   Contexto: Projeto acadêmico de Análise e Desenvolvimento de Sistemas (ADS). */

import { useState, useEffect, useRef } from 'react';

// Acervo massivo de pictogramas reais da aplicação
const CARTAS_DISPONIVEIS = [
  // Necessidades e Rotina
  { id: 'c1', texto: 'Água', audio: 'water.m4a', padrao: 'agua.png' },
  { id: 'c2', texto: 'Comer', audio: 'eat.m4a', padrao: 'comer.png' },
  { id: 'c3', texto: 'Banheiro', audio: 'banheiro.m4a', padrao: 'banheiro.png' },
  { id: 'c4', texto: 'Dormir', audio: 'dormir_novo.m4a', padrao: 'dormir.png' },
  { id: 'c5', texto: 'Tomar Banho', audio: 'tomar_banho.m4a', padrao: 'tomar-banho.png' },
  { id: 'c6', texto: 'Escovar Dentes', audio: 'escovar_os_dentes.m4a', padrao: 'escovar-dentes.png' },
  { id: 'c7', texto: 'Remédio', audio: 'remedio.m4a', padrao: 'remedio.png' },
  { id: 'c8', texto: 'Ajuda', audio: 'help.m4a', padrao: 'ajuda.png' },

  // Ações e Social
  { id: 'c9', texto: 'Brincar', audio: 'brincar_novo.m4a', padrao: 'brincar.png' },
  { id: 'c10', texto: 'Passear', audio: 'quero_passear.m4a', padrao: 'passear.png' },
  { id: 'c11', texto: 'Desenhar', audio: 'desenhar.m4a', padrao: 'desenhar.png' },
  { id: 'c12', texto: 'Ver Livro', audio: 'ver_livro.m4a', padrao: 'livro.png' },
  { id: 'c13', texto: 'Colega', audio: 'Colega.m4a', padrao: 'colega.png' },
  { id: 'c14', texto: 'Professora', audio: 'Professora.m4a', padrao: 'professora.png' },
  { id: 'c15', texto: 'Mamãe', audio: 'Mamãe.m4a', padrao: 'mamae.png' },
  { id: 'c16', texto: 'Papai', audio: 'Papai.m4a', padrao: 'papai.png' },

  // Emoções e Sensações
  { id: 'c17', texto: 'Feliz', audio: 'feliz.m4a', padrao: 'feliz.png' },
  { id: 'c18', texto: 'Triste', audio: 'triste.m4a', padrao: 'triste.png' },
  { id: 'c19', texto: 'Bravo', audio: 'bravo.m4a', padrao: 'bravo.png' },
  { id: 'c20', texto: 'Calma', audio: 'calma_novo.m4a', padrao: 'calma.png' },
  { id: 'c21', texto: 'Medo', audio: 'estou_com_medo.m4a', padrao: 'medo.png' },
  { id: 'c22', texto: 'Cansado', audio: 'cansado.m4a', padrao: 'cansado.png' },
  { id: 'c23', texto: 'Calor', audio: 'estou_com_calor.m4a', padrao: 'calor.png' },
  { id: 'c24', texto: 'Frio', audio: 'estou_com_frio.m4a', padrao: 'frio.png' },
  { id: 'c25', texto: 'Dor', audio: 'dor.m4a', padrao: 'dor.png' },

  // Alimentos e Lanches
  { id: 'c26', texto: 'Bolo', audio: 'bolo.m4a', padrao: 'bolo.png' },
  { id: 'c27', texto: 'Maçã', audio: 'maca.m4a', padrao: 'maca.png' },
  { id: 'c28', texto: 'Pão', audio: 'pao.m4a', padrao: 'pao.png' },
  { id: 'c29', texto: 'Suco', audio: 'suco.m4a', padrao: 'suco.png' },
  { id: 'c30', texto: 'Chocolate', audio: 'chocolate.m4a', padrao: 'chocolate.png' }
];

export default function JogoMemoria({ preferenciasVisuais = {}, onClose }) {
  // Quantidade de pares: 3 (6 cartas), 6 (12 cartas) ou 8 (16 cartas)
  const [qtdPares, setQtdPares] = useState(3);
  const [cartas, setCartas] = useState([]);
  const [viradas, setViradas] = useState([]);
  const [acertos, setAcertos] = useState([]);
  const [bloquearClique, setBloquearClique] = useState(false);
  const [vitoria, setVitoria] = useState(false);

  const audioRef = useRef(null);

  const tocarAudio = (arquivo, textoFallback = '') => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (arquivo) {
      const som = new Audio(`/audios/${arquivo}`);
      audioRef.current = som;
      som.play().catch(() => {
        falarTexto(textoFallback);
      });
    } else if (textoFallback) {
      falarTexto(textoFallback);
    }
  };

  const falarTexto = (texto) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && texto) {
      window.speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = 'pt-BR';
      fala.rate = 0.95;
      window.speechSynthesis.speak(fala);
    }
  };

  const iniciarJogo = (paresEscolhidos = qtdPares) => {
    setViradas([]);
    setAcertos([]);
    setBloquearClique(false);
    setVitoria(false);

    // 1. Embaralha o acervo global e extrai a cota da partida
    const embaralhadas = [...CARTAS_DISPONIVEIS].sort(() => 0.5 - Math.random());
    const selecionadas = embaralhadas.slice(0, paresEscolhidos);

    // 2. Duplica cada carta garantindo chaves únicas para o React
    const baralho = [...selecionadas, ...selecionadas].map((item, idx) => ({
      ...item,
      chaveUnica: `${item.id}_${idx}_${Math.random().toString(36).substring(2, 7)}`
    }));

    // 3. Embaralha as cartas na mesa
    setCartas(baralho.sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    iniciarJogo(qtdPares);
    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [qtdPares]);

  const obterImagem = (item) => {
    const prefs = preferenciasVisuais || {};
    return prefs[item.texto] || item.padrao;
  };

  const clicarCarta = (carta) => {
    if (bloquearClique) return;
    if (viradas.some((c) => c.chaveUnica === carta.chaveUnica)) return;
    if (acertos.includes(carta.texto)) return;

    // Toca a pronúncia imediata da carta revelada
    tocarAudio(carta.audio, carta.texto);

    const novasViradas = [...viradas, carta];
    setViradas(novasViradas);

    if (novasViradas.length === 2) {
      setBloquearClique(true);
      const [primeira, segunda] = novasViradas;

      if (primeira.texto === segunda.texto) {
        // Formou o par
        const novosAcertos = [...acertos, segunda.texto];
        setAcertos(novosAcertos);
        setViradas([]);
        setBloquearClique(false);

        // Som suave de reforço positivo
        setTimeout(() => {
          tocarAudio('acerto_suave.m4a', 'Muito bem!');
        }, 300);

        if (novosAcertos.length === qtdPares) {
          setTimeout(() => {
            setVitoria(true);
            tocarAudio('parabens_final.m4a', 'Parabéns! Você encontrou todos os pares!');
          }, 650);
        }
      } else {
        // Erro: desvira sem som punitivo
        setTimeout(() => {
          setViradas([]);
          setBloquearClique(false);
        }, 1100);
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(5, 10, 25, 0.97)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px',
      boxSizing: 'border-box',
      userSelect: 'none'
    }}>
      {/* Botão Fechar */}
      <button
        type="button"
        onClick={() => {
          if (audioRef.current) audioRef.current.pause();
          onClose();
        }}
        style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
          background: '#ef4444',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          fontSize: '1.2rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          zIndex: 20
        }}
      >
        ✖
      </button>

      {/* Topo e Seletores de Nível */}
      <h2 style={{ color: '#38bdf8', fontSize: '1.75rem', margin: '0 0 14px 0', textAlign: 'center' }}>
        🃏 Cadê o Par?
      </h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => { setQtdPares(3); iniciarJogo(3); }}
          style={estiloSeletor(qtdPares === 3, '#22c55e')}
        >
          🟢 Fácil (3 Pares)
        </button>
        <button
          type="button"
          onClick={() => { setQtdPares(6); iniciarJogo(6); }}
          style={estiloSeletor(qtdPares === 6, '#38bdf8')}
        >
          🔵 Médio (6 Pares)
        </button>
        <button
          type="button"
          onClick={() => { setQtdPares(8); iniciarJogo(8); }}
          style={estiloSeletor(qtdPares === 8, '#a855f7')}
        >
          🟣 Desafio (8 Pares)
        </button>
      </div>

      {vitoria ? (
        /* Tela Final de Conclusão */
        <div style={{
          textAlign: 'center',
          background: '#0f172a',
          padding: '36px 30px',
          borderRadius: '24px',
          border: '2px solid #22c55e',
          maxWidth: '460px',
          width: '90%',
          boxShadow: '0 0 35px rgba(34, 197, 94, 0.35)'
        }}>
          <h2 style={{ color: '#4ade80', fontSize: '1.9rem', marginBottom: '10px' }}>
            🌟 Parabéns!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: '24px' }}>
            Você encontrou todos os {qtdPares} pares com ótima atenção!
          </p>
          <button
            type="button"
            onClick={() => iniciarJogo(qtdPares)}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: '#ffffff',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '16px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
            }}
          >
            🔄 Jogar Outra Vez
          </button>
        </div>
      ) : (
        /* Grade das Cartas */
        <div style={{
          display: 'grid',
          gridTemplateColumns:
            qtdPares === 3
              ? 'repeat(3, 1fr)'
              : qtdPares === 6
              ? 'repeat(4, 1fr)'
              : 'repeat(4, 1fr)',
          gap: '12px',
          maxWidth: qtdPares === 3 ? '440px' : qtdPares === 6 ? '560px' : '620px',
          width: '100%',
          maxHeight: '72vh',
          overflowY: 'auto',
          padding: '4px'
        }}>
          {cartas.map((carta) => {
            const estaVirada = viradas.some((c) => c.chaveUnica === carta.chaveUnica);
            const jaAcertou = acertos.includes(carta.texto);
            const aberta = estaVirada || jaAcertou;

            return (
              <div
                key={carta.chaveUnica}
                onClick={() => clicarCarta(carta)}
                style={{
                  height: qtdPares === 8 ? '108px' : '124px',
                  background: aberta ? '#0f172a' : '#1e293b',
                  border: jaAcertou
                    ? '3px solid #22c55e'
                    : aberta
                    ? '3px solid #38bdf8'
                    : '2px solid #334155',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: jaAcertou ? 'default' : 'pointer',
                  boxShadow: jaAcertou
                    ? '0 0 16px rgba(34, 197, 94, 0.4)'
                    : '0 4px 10px rgba(0, 0, 0, 0.3)',
                  transform: aberta ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.22s ease',
                  padding: '6px'
                }}
              >
                {aberta ? (
                  <>
                    <img
                      src={`/img/${obterImagem(carta)}`}
                      alt={carta.texto}
                      style={{
                        width: qtdPares === 8 ? '52px' : '64px',
                        height: qtdPares === 8 ? '52px' : '64px',
                        objectFit: 'contain',
                        marginBottom: '4px',
                        pointerEvents: 'none'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <span style={{
                      color: '#f8fafc',
                      fontWeight: 700,
                      fontSize: qtdPares === 8 ? '0.82rem' : '0.92rem',
                      textAlign: 'center',
                      pointerEvents: 'none'
                    }}>
                      {carta.texto}
                    </span>
                  </>
                ) : (
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    color: '#38bdf8'
                  }}>
                    ❓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function estiloSeletor(ativo, corDestaque) {
  return {
    background: ativo ? corDestaque : '#1e293b',
    color: ativo ? '#0f172a' : '#f8fafc',
    border: `2px solid ${corDestaque}`,
    borderRadius: '16px',
    padding: '8px 16px',
    fontWeight: 700,
    fontSize: '0.92rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };
}