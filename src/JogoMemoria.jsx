import { useState, useEffect } from 'react';

// Pool de cartas conhecidas da prancha para sortear pares
const CARTAS_DISPONIVEIS = [
  { id: 'b1', texto: 'Água', audio: 'agua.m4a', padrao: 'agua.png' },
  { id: 'b2', texto: 'Comer', audio: 'comer.m4a', padrao: 'comer.png' },
  { id: 'b3', texto: 'Banheiro', audio: 'banheiro.m4a', padrao: 'banheiro.png' },
  { id: 'a4', texto: 'Brincar', audio: 'brincar.m4a', padrao: 'brincar.png' },
  { id: 's1', texto: 'Feliz', audio: 'feliz.m4a', padrao: 'feliz.png' },
  { id: 's7', texto: 'Calma', audio: 'calma.m4a', padrao: 'calma.png' },
  { id: 'p2', texto: 'Colega', audio: 'Colega.m4a', padrao: 'colega.png' },
  { id: 'a7', texto: 'Passear', audio: 'quero_passear.m4a', padrao: 'passear.png' }
];

export default function JogoMemoria({ preferenciasVisuais, onClose }) {
  const [dificuldade, setDificuldade] = useState(2); // 2 pares (4 cartas) ou 3 pares (6 cartas)
  const [cartas, setCartas] = useState([]);
  const [viradas, setViradas] = useState([]);
  const [acertos, setAcertos] = useState([]);
  const [bloquearClique, setBloquearClique] = useState(false);
  const [vitoria, setVitoria] = useState(false);

  // Inicializa e embaralha o tabuleiro
  const iniciarJogo = (qtdPares = dificuldade) => {
    setViradas([]);
    setAcertos([]);
    setBloquearClique(false);
    setVitoria(false);

    // 1. Sorteia cartas aleatórias da lista
    const cartasEmbaralhadas = [...CARTAS_DISPONIVEIS].sort(() => 0.5 - Math.random());
    const selecionadas = cartasEmbaralhadas.slice(0, qtdPares);

    // 2. Duplica cada carta para formar o par
    const baralho = [...selecionadas, ...selecionadas].map((item, index) => ({
      ...item,
      chaveUnica: `${item.id}_${index}`
    }));

    // 3. Embaralha as cartas na mesa
    setCartas(baralho.sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    iniciarJogo(dificuldade);
  }, [dificuldade]);

  const obterImagem = (item) => {
    return preferenciasVisuais[item.texto] || item.padrao;
  };

  const clicarCarta = (carta) => {
    if (bloquearClique) return;
    if (viradas.some((c) => c.chaveUnica === carta.chaveUnica)) return;
    if (acertos.includes(carta.texto)) return;

    const novasViradas = [...viradas, carta];
    setViradas(novasViradas);

    // Tocou na segunda carta do par
    if (novasViradas.length === 2) {
      setBloquearClique(true);
      const [primeira, segunda] = novasViradas;

      if (primeira.texto === segunda.texto) {
        // Acertou o par! Toca o áudio da prancha
        new Audio(`/audios/${segunda.audio}`).play().catch(() => {});
        const novosAcertos = [...acertos, segunda.texto];
        setAcertos(novosAcertos);
        setViradas([]);
        setBloquearClique(false);

        // Checa se completou todos os pares
        if (novosAcertos.length === dificuldade) {
          setTimeout(() => setVitoria(true), 600);
        }
      } else {
        // Não foi par: desvira suavemente após 1 segundo sem som punitivo
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
      boxSizing: 'border-box'
    }}>
      {/* Botão Fechar */}
      <button
        type="button"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#ef4444',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50%',
          width: '46px',
          height: '46px',
          fontSize: '1.2rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
        }}
      >
        ✖
      </button>

      {/* Topo: Título e Seletor de Nível */}
      <h2 style={{ color: '#38bdf8', fontSize: '1.8rem', margin: '0 0 12px 0', textAlign: 'center' }}>
        🃏 Cadê o Par?
      </h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => { setDificuldade(2); iniciarJogo(2); }}
          style={{
            background: dificuldade === 2 ? '#38bdf8' : '#1e293b',
            color: dificuldade === 2 ? '#0f172a' : '#f8fafc',
            border: '2px solid #38bdf8',
            borderRadius: '20px',
            padding: '8px 18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          2 Pares (Calmo)
        </button>
        <button
          type="button"
          onClick={() => { setDificuldade(3); iniciarJogo(3); }}
          style={{
            background: dificuldade === 3 ? '#38bdf8' : '#1e293b',
            color: dificuldade === 3 ? '#0f172a' : '#f8fafc',
            border: '2px solid #38bdf8',
            borderRadius: '20px',
            padding: '8px 18px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          3 Pares (Foco)
        </button>
      </div>

      {vitoria ? (
        /* Tela de Celebração Calma */
        <div style={{
          textAlign: 'center',
          background: '#0f172a',
          padding: '36px',
          borderRadius: '24px',
          border: '2px solid #22c55e',
          maxWidth: '480px',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)'
        }}>
          <h2 style={{ color: '#4ade80', fontSize: '2rem', marginBottom: '12px' }}>
            🌟 Você encontrou todos os pares!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.15rem', marginBottom: '24px' }}>
            Excelente memória e concentração!
          </p>
          <button
            type="button"
            onClick={() => iniciarJogo(dificuldade)}
            style={{
              background: '#22c55e',
              color: '#0f172a',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '16px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔄 Jogar Outra Vez
          </button>
        </div>
      ) : (
        /* Grade de Cartas da Memória */
        <div style={{
          display: 'grid',
          gridTemplateColumns: dificuldade === 2 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: '16px',
          maxWidth: dificuldade === 2 ? '360px' : '520px',
          width: '100%'
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
                  height: '140px',
                  background: aberta ? '#0f172a' : '#1e293b',
                  border: jaAcertou ? '3px solid #22c55e' : aberta ? '3px solid #38bdf8' : '2px solid #475569',
                  borderRadius: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: jaAcertou ? 'default' : 'pointer',
                  boxShadow: jaAcertou ? '0 0 15px rgba(34, 197, 94, 0.5)' : '0 4px 10px rgba(0, 0, 0, 0.3)',
                  transform: aberta ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.25s ease',
                  userSelect: 'none'
                }}
              >
                {aberta ? (
                  <>
                    <img
                      src={`/img/${obterImagem(carta)}`}
                      alt={carta.texto}
                      style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '6px' }}
                    />
                    <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '1rem' }}>
                      {carta.texto}
                    </span>
                  </>
                ) : (
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
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