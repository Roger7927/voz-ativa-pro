import { useState, useEffect, useRef } from 'react';

const ROTINAS_DIDATICAS = [
  {
    id: 'rot_1',
    titulo: 'Rotina da Manhã',
    audioPergunta: 'rotina_manha.m4a',
    passo1: { texto: 'Dormir', img: 'dormir.png', desc: 'Acordar da cama' },
    passo2: { texto: 'Banheiro', img: 'banheiro.png', desc: 'Escovar os dentes' },
    passoAlvo: { texto: 'Comer', audio: 'comer.m4a', img: 'comer.png', desc: 'Tomar café da manhã' },
    distratores: [
      { texto: 'Brincar', img: 'brincar.png' },
      { texto: 'Bravo', img: 'bravo.png' }
    ]
  },
  {
    id: 'rot_2',
    titulo: 'Hora do Passeio',
    audioPergunta: 'rotina_passeio.m4a',
    passo1: { texto: 'Água', img: 'agua.png', desc: 'Beber água antes de sair' },
    passo2: { texto: 'Mamãe', img: 'mamae.png', desc: 'Dar a mão com carinho' },
    passoAlvo: { texto: 'Passear', audio: 'quero_passear.m4a', img: 'passear.png', desc: 'Sair para caminhar' },
    distratores: [
      { texto: 'Dormir', img: 'dormir.png' },
      { texto: 'Dor', img: 'dor.png' }
    ]
  },
  {
    id: 'rot_3',
    titulo: 'Sentindo Dor',
    audioPergunta: 'rotina_dor.m4a',
    passo1: { texto: 'Dor', img: 'dor.png', desc: 'Sentiu o machucado' },
    passo2: { texto: 'Ajuda', img: 'ajuda.png', desc: 'Pediu apoio a um adulto' },
    passoAlvo: { texto: 'Calma', audio: 'calma.m4a', img: 'calma.png', desc: 'Respirar fundo e se acalmar' },
    distratores: [
      { texto: 'Passear', img: 'passear.png' },
      { texto: 'Barulho', img: 'barulho.png' }
    ]
  },
  {
    id: 'rot_4',
    titulo: 'Depois de Brincar',
    audioPergunta: 'pergunta_cansado.m4a',
    passo1: { texto: 'Brincar', img: 'brincar.png', desc: 'Correu e brincou bastante' },
    passo2: { texto: 'Cansado', img: 'cansado.png', desc: 'Sentiu cansaço e sede' },
    passoAlvo: { texto: 'Água', audio: 'agua.m4a', img: 'agua.png', desc: 'Beber água fresquinha' },
    distratores: [
      { texto: 'Bravo', img: 'bravo.png' },
      { texto: 'Barulho', img: 'barulho.png' }
    ]
  }
];

export default function JogoRotina({ preferenciasVisuais, onClose }) {
  const [indiceRotina, setIndiceRotina] = useState(0);
  const [estrelas, setEstrelas] = useState(0);
  const [opcoes, setOpcoes] = useState([]);
  const [desativadas, setDesativadas] = useState([]);
  const [acertou, setAcertou] = useState(false);
  const [concluido, setConcluido] = useState(false);

  const audioAtualRef = useRef(null);
  const travaAntiSpamRef = useRef(false);

  const rotinaAtual = ROTINAS_DIDATICAS[indiceRotina];

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

  const prepararFase = (rotina) => {
    travaAntiSpamRef.current = false;
    setAcertou(false);
    setDesativadas([]);
    const embaralhadas = [rotina.passoAlvo, ...rotina.distratores].sort(() => 0.5 - Math.random());
    setOpcoes(embaralhadas);

    setTimeout(() => {
      tocarAudio(rotina.audioPergunta);
    }, 450);
  };

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    prepararFase(rotinaAtual);
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioAtualRef.current) {
        audioAtualRef.current.pause();
        audioAtualRef.current.currentTime = 0;
      }
    };
  }, [indiceRotina]);

  const obterImagem = (texto, padrao) => {
    return preferenciasVisuais[texto] || padrao;
  };

  const escolherPasso = (opcao) => {
    if (travaAntiSpamRef.current || acertou || desativadas.includes(opcao.texto)) {
      return;
    }

    if (opcao.texto === rotinaAtual.passoAlvo.texto) {
      travaAntiSpamRef.current = true;
      setAcertou(true);
      const novasEstrelas = estrelas + 1;
      setEstrelas(novasEstrelas);

      tocarAudio('acerto_suave.m4a', () => {
        setTimeout(() => {
          if (novasEstrelas >= ROTINAS_DIDATICAS.length) {
            setConcluido(true);
            tocarAudio('parabens_final.m4a');
          } else {
            setIndiceRotina((ant) => ant + 1);
          }
        }, 600);
      });
    } else {
      setDesativadas((prev) => [...prev, opcao.texto]);
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
      padding: '20px',
      boxSizing: 'border-box',
      touchAction: 'manipulation'
    }}>
      <button
        type="button"
        onClick={() => {
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
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

      {/* Estrelas de Conquista */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        background: '#0f172a',
        padding: '10px 24px',
        borderRadius: '30px',
        border: '1px solid #334155'
      }}>
        {ROTINAS_DIDATICAS.map((_, idx) => (
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
          border: '2px solid #22c55e',
          maxWidth: '500px',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)'
        }}>
          <h2 style={{ color: '#4ade80', fontSize: '2.2rem', marginBottom: '12px' }}>
            🎉 Parabéns!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '28px' }}>
            Você organizou todas as sequências com muita atenção e calma!
          </p>
          <button
            type="button"
            onClick={() => {
              setEstrelas(0);
              setIndiceRotina(0);
              setConcluido(false);
              prepararFase(ROTINAS_DIDATICAS[0]);
            }}
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
            🔄 Jogar Novamente
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', width: '100%' }}>
          
          <div style={{
            position: 'relative',
            width: '100%',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => tocarAudio(rotinaAtual.audioPergunta)}
              style={{
                position: 'absolute',
                top: '0',
                right: '10px',
                background: '#0f172a',
                border: '1px solid #38bdf8',
                borderRadius: '12px',
                padding: '8px 14px',
                color: '#38bdf8',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Ouvir novamente"
            >
              🔊 Ouvir
            </button>
            <h2 style={{ color: '#38bdf8', fontSize: '1.8rem', margin: '0 0 6px 0' }}>
              📋 {rotinaAtual.titulo}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}>
              O que fazemos depois?
            </p>
          </div>

          {/* Passos da Rotina */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            {/* Passo 1 */}
            <div style={{
              background: '#0f172a',
              border: '2px solid #334155',
              borderRadius: '18px',
              padding: '12px',
              textAlign: 'center',
              width: '130px'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 'bold' }}>1º PASSO</span>
              <img
                src={`/img/${obterImagem(rotinaAtual.passo1.texto, rotinaAtual.passo1.img)}`}
                alt={rotinaAtual.passo1.texto}
                style={{ width: '70px', height: '70px', objectFit: 'contain', margin: '6px 0', pointerEvents: 'none' }}
              />
              <span style={{ color: '#f8fafc', fontWeight: 'bold', display: 'block', fontSize: '1rem' }}>
                {rotinaAtual.passo1.texto}
              </span>
            </div>

            <span style={{ color: '#38bdf8', fontSize: '1.8rem', userSelect: 'none' }}>➔</span>

            {/* Passo 2 */}
            <div style={{
              background: '#0f172a',
              border: '2px solid #334155',
              borderRadius: '18px',
              padding: '12px',
              textAlign: 'center',
              width: '130px'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 'bold' }}>2º PASSO</span>
              <img
                src={`/img/${obterImagem(rotinaAtual.passo2.texto, rotinaAtual.passo2.img)}`}
                alt={rotinaAtual.passo2.texto}
                style={{ width: '70px', height: '70px', objectFit: 'contain', margin: '6px 0', pointerEvents: 'none' }}
              />
              <span style={{ color: '#f8fafc', fontWeight: 'bold', display: 'block', fontSize: '1rem' }}>
                {rotinaAtual.passo2.texto}
              </span>
            </div>

            <span style={{ color: '#38bdf8', fontSize: '1.8rem', userSelect: 'none' }}>➔</span>

            {/* Passo 3 (Caixa Alvo) */}
            <div style={{
              background: acertou ? '#0f172a' : '#1e293b',
              border: acertou ? '3px solid #22c55e' : '3px dashed #38bdf8',
              borderRadius: '18px',
              padding: '12px',
              textAlign: 'center',
              width: '130px',
              boxShadow: acertou ? '0 0 20px rgba(34, 197, 94, 0.7)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              <span style={{ fontSize: '0.8rem', color: acertou ? '#4ade80' : '#38bdf8', fontWeight: 'bold' }}>
                {acertou ? 'COMPLETO!' : 'E DEPOIS?'}
              </span>
              {acertou ? (
                <>
                  <img
                    src={`/img/${obterImagem(rotinaAtual.passoAlvo.texto, rotinaAtual.passoAlvo.img)}`}
                    alt={rotinaAtual.passoAlvo.texto}
                    style={{ width: '70px', height: '70px', objectFit: 'contain', margin: '6px 0', pointerEvents: 'none' }}
                  />
                  <span style={{ color: '#4ade80', fontWeight: 'bold', display: 'block', fontSize: '1rem' }}>
                    {rotinaAtual.passoAlvo.texto}
                  </span>
                </>
              ) : (
                <div style={{
                  height: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  color: '#38bdf8',
                  margin: '6px 0',
                  userSelect: 'none'
                }}>
                  ❓
                </div>
              )}
            </div>
          </div>

          {/* Opções de Cartas */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {opcoes.map((op) => {
              const desativada = desativadas.includes(op.texto);
              const foiAcerto = acertou && op.texto === rotinaAtual.passoAlvo.texto;

              return (
                <button
                  key={op.texto}
                  type="button"
                  onClick={() => escolherPasso(op)}
                  disabled={desativada || acertou}
                  style={{
                    background: '#0f172a',
                    border: foiAcerto ? '3px solid #22c55e' : '2px solid #475569',
                    borderRadius: '16px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: desativada || acertou ? 'default' : 'pointer',
                    opacity: desativada ? 0.15 : 1,
                    transform: foiAcerto ? 'scale(1.08)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    minWidth: '120px',
                    userSelect: 'none'
                  }}
                >
                  <img
                    src={`/img/${obterImagem(op.texto, op.img)}`}
                    alt={op.texto}
                    style={{ width: '75px', height: '75px', objectFit: 'contain', marginBottom: '8px', pointerEvents: 'none' }}
                  />
                  <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '1.1rem', pointerEvents: 'none' }}>
                    {op.texto}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ height: '40px', marginTop: '20px' }}>
            {acertou && (
              <span style={{ color: '#4ade80', fontSize: '1.4rem', fontWeight: 'bold' }}>
                ⭐ Muito bem!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}