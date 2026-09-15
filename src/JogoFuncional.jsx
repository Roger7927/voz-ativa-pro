import { useState, useEffect, useRef } from 'react';

const DESAFIOS_CLINICOS = [
  {
    id: 'fnc_1',
    situacao: 'A garganta está seca e a boca com sede...',
    perguntaAudio: 'agua.m4a',
    iconeSituacao: '☀️🥤',
    alvo: { texto: 'Água', img: 'agua.png', audio: 'agua.m4a' },
    distratores: [
      { texto: 'Dormir', img: 'dormir.png', audio: 'quero_dormir.m4a' },
      { texto: 'Bravo', img: 'bravo.png', audio: 'bravo.m4a' }
    ],
    explicacaoPositiva: 'Isso mesmo! Quando sentimos sede, bebemos água fresca!'
  },
  {
    id: 'fnc_2',
    situacao: 'Depois do almoço, o dente ficou sujo...',
    perguntaAudio: 'escovar_os_dentes.m4a',
    iconeSituacao: '🦷✨',
    alvo: { texto: 'Escovar os Dentes', img: 'escovar-dentes.png', audio: 'escovar_os_dentes.m4a' },
    distratores: [
      { texto: 'Brincar', img: 'brincar.png', audio: 'brincar.m4a' },
      { texto: 'Passear', img: 'passear.png', audio: 'quero_passear.m4a' }
    ],
    explicacaoPositiva: 'Muito bem! Escovar os dentes deixa a boca limpa e saudável!'
  },
  {
    id: 'fnc_3',
    situacao: 'Caiu no parquinho e machucou o joelho...',
    perguntaAudio: 'ajuda.m4a',
    iconeSituacao: '🩹🤝',
    alvo: { texto: 'Ajuda', img: 'ajuda.png', audio: 'ajuda.m4a' },
    distratores: [
      { texto: 'Comer', img: 'comer.png', audio: 'comer.m4a' },
      { texto: 'Barulho', img: 'barulho.png', audio: 'barulho.m4a' }
    ],
    explicacaoPositiva: 'Excelente! Quando a gente se machuca, pede ajuda para um adulto!'
  },
  {
    id: 'fnc_4',
    situacao: 'A barriga está fazendo barulho e o corpo sem força...',
    perguntaAudio: 'comer.m4a',
    iconeSituacao: '🍽️🥪',
    alvo: { texto: 'Comer', img: 'comer.png', audio: 'comer.m4a' },
    distratores: [
      { texto: 'Banheiro', img: 'banheiro.png', audio: 'banheiro.m4a' },
      { texto: 'Triste', img: 'triste.png', audio: 'triste.m4a' }
    ],
    explicacaoPositiva: 'Muito bom! Hora de comer uma comida saudável e recarregar a energia!'
  },
  {
    id: 'fnc_5',
    situacao: 'Os olhos estão pesados e o corpo quer descansar...',
    perguntaAudio: 'quero_dormir.m4a',
    iconeSituacao: '🌙🛌',
    alvo: { texto: 'Dormir', img: 'dormir.png', audio: 'quero_dormir.m4a' },
    distratores: [
      { texto: 'Brincar', img: 'brincar.png', audio: 'brincar.m4a' },
      { texto: 'Água', img: 'agua.png', audio: 'agua.m4a' }
    ],
    explicacaoPositiva: 'Perfeito! Deitar na cama e dormir ajuda a recuperar todas as forças!'
  }
];

export default function JogoFuncional({ preferenciasVisuais = {}, onClose }) {
  const [indiceFase, setIndiceFase] = useState(0);
  const [estrelas, setEstrelas] = useState(0);
  const [opcoes, setOpcoes] = useState([]);
  const [desativadas, setDesativadas] = useState([]);
  const [acertou, setAcertou] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const audioAtualRef = useRef(null);
  const travaAntiSpamRef = useRef(false);

  const desafioAtual = DESAFIOS_CLINICOS[indiceFase];

  const tocarAudio = (caminho, aoTerminar = null) => {
    if (audioAtualRef.current) {
      audioAtualRef.current.pause();
      audioAtualRef.current.currentTime = 0;
    }
    const audio = new Audio(`/audios/${caminho}`);
    audioAtualRef.current = audio;

    if (aoTerminar) {
      audio.onended = aoTerminar;
    }

    audio.play().catch(() => {});
  };

  const prepararFase = (desafio) => {
    travaAntiSpamRef.current = false;
    setAcertou(false);
    setDesativadas([]);

    const misturadas = [desafio.alvo, ...desafio.distratores].sort(() => 0.5 - Math.random());
    setOpcoes(misturadas);
  };

  useEffect(() => {
    prepararFase(desafioAtual);
    return () => {
      if (audioAtualRef.current) {
        audioAtualRef.current.pause();
        audioAtualRef.current.currentTime = 0;
      }
    };
  }, [indiceFase]);

  const obterImagem = (item) => {
    if (!item) return '';
    const prefs = preferenciasVisuais || {};
    return prefs[item.texto] || item.img;
  };

  const responder = (opcao) => {
    if (travaAntiSpamRef.current || acertou || desativadas.includes(opcao.texto)) {
      return;
    }

    if (opcao.texto === desafioAtual.alvo.texto) {
      travaAntiSpamRef.current = true;
      setAcertou(true);
      const novasEstrelas = estrelas + 1;
      setEstrelas(novasEstrelas);

      tocarAudio(opcao.audio, () => {
        setTimeout(() => {
          tocarAudio('acerto_suave.m4a', () => {
            setTimeout(() => {
              if (novasEstrelas >= DESAFIOS_CLINICOS.length) {
                setConcluido(true);
                tocarAudio('parabens_final.m4a');
              } else {
                setIndiceFase((ant) => ant + 1);
              }
            }, 600);
          });
        }, 350);
      });
    } else {
      setDesativadas((ant) => [...ant, opcao.texto]);
    }
  };

  const reiniciarJogo = () => {
    setEstrelas(0);
    setIndiceFase(0);
    setConcluido(false);
    prepararFase(DESAFIOS_CLINICOS[0]);
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
      padding: '20px',
      boxSizing: 'border-box',
      touchAction: 'manipulation'
    }}>
      <button
        type="button"
        onClick={() => {
          if (audioAtualRef.current) audioAtualRef.current.pause();
          onClose();
        }}
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

      {/* Economia de Fichas (Estrelas no Topo) */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        background: '#0f172a',
        padding: '10px 24px',
        borderRadius: '30px',
        border: '1px solid #334155'
      }}>
        {DESAFIOS_CLINICOS.map((_, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '2rem',
              filter: idx < estrelas ? 'none' : 'grayscale(100%) opacity(0.25)',
              transform: idx < estrelas ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.3s ease'
            }}
          >
            ⭐
          </span>
        ))}
      </div>

      {concluido ? (
        <div style={{
          textAlign: 'center',
          background: '#0f172a',
          padding: '40px',
          borderRadius: '24px',
          border: '2px solid #06b6d4',
          maxWidth: '520px',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)'
        }}>
          <h2 style={{ color: '#22d3ee', fontSize: '2.2rem', marginBottom: '12px' }}>
            🎉 Extraordinário!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '28px' }}>
            Você descobriu a função e os cuidados de todas as situações do dia a dia!
          </p>
          <button
            type="button"
            onClick={reiniciarJogo}
            style={{
              background: '#06b6d4',
              color: '#0f172a',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '16px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔄 Jogar Novamente
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '820px', width: '100%' }}>
          
          <h2 style={{ color: '#38bdf8', fontSize: '1.8rem', margin: '0 0 8px 0', textAlign: 'center' }}>
            🎯 Para Que Serve?
          </h2>

          <div style={{
            background: '#0f172a',
            border: '2px solid #1e293b',
            borderRadius: '24px',
            padding: '24px 32px',
            marginBottom: '32px',
            textAlign: 'center',
            maxWidth: '620px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '3.2rem', marginBottom: '10px' }}>
              {desafioAtual.iconeSituacao}
            </div>
            <p style={{ color: '#f8fafc', fontSize: '1.35rem', fontWeight: 'bold', margin: '0 0 8px 0', lineHeight: 1.4 }}>
              {desafioAtual.situacao}
            </p>
            <span style={{ color: '#38bdf8', fontSize: '1.05rem', fontWeight: 'bold' }}>
              👉 Do que você precisa agora?
            </span>
          </div>

          {/* Opções Funcionais */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {opcoes.map((op) => {
              const desativada = desativadas.includes(op.texto);
              const foiAcerto = acertou && op.texto === desafioAtual.alvo.texto;

              return (
                <button
                  key={op.texto}
                  type="button"
                  onClick={() => responder(op)}
                  disabled={desativada || acertou}
                  style={{
                    background: '#0f172a',
                    border: foiAcerto ? '3.5px solid #22c55e' : '2px solid #334155',
                    borderRadius: '20px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: desativada || acertou ? 'default' : 'pointer',
                    opacity: desativada ? 0.15 : 1,
                    transform: foiAcerto ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: foiAcerto ? '0 0 20px rgba(34, 197, 94, 0.6)' : 'none',
                    transition: 'all 0.2s ease',
                    minWidth: '135px',
                    userSelect: 'none'
                  }}
                >
                  <img
                    src={`/img/${obterImagem(op)}`}
                    alt={op.texto}
                    style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '10px', pointerEvents: 'none' }}
                  />
                  <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '1.15rem', pointerEvents: 'none' }}>
                    {op.texto}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ height: '40px', marginTop: '20px' }}>
            {acertou && (
              <span style={{ color: '#4ade80', fontSize: '1.3rem', fontWeight: 'bold' }}>
                ⭐ {desafioAtual.explicacaoPositiva}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}