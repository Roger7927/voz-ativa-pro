import { useState, useEffect, useRef } from 'react';

const MISSOES_FRASES = [
  {
    id: 'frase_1',
    instrucao: 'Vamos pedir comida? Monte: Eu + Comer',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Comer', padrao: 'comer.png', audio: 'comer.m4a', cor: 'border-green' },
    distratores: [
      { texto: 'Banheiro', padrao: 'banheiro.png', audio: 'banheiro.m4a' },
      { texto: 'Bravo', padrao: 'bravo.png', audio: 'bravo.m4a' }
    ]
  },
  {
    id: 'frase_2',
    instrucao: 'Sentiu sede? Monte: Eu + Água',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Água', padrao: 'agua.png', audio: 'agua.m4a', cor: 'border-orange' },
    distratores: [
      { texto: 'Dormir', padrao: 'dormir.png', audio: 'quero_dormir.m4a' },
      { texto: 'Barulho', padrao: 'barulho.png', audio: 'barulho.m4a' }
    ]
  },
  {
    id: 'frase_3',
    instrucao: 'Hora da diversão! Monte: Eu + Brincar',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Brincar', padrao: 'brincar.png', audio: 'brincar.m4a', cor: 'border-green' },
    distratores: [
      { texto: 'Dor', padrao: 'dor.png', audio: 'dor.m4a' },
      { texto: 'Passear', padrao: 'passear.png', audio: 'quero_passear.m4a' }
    ]
  },
  {
    id: 'frase_4',
    instrucao: 'O corpo quer descansar! Monte: Eu + Dormir',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Dormir', padrao: 'dormir.png', audio: 'quero_dormir.m4a', cor: 'border-green' },
    distratores: [
      { texto: 'Comer', padrao: 'comer.png', audio: 'comer.m4a' },
      { texto: 'Ajuda', padrao: 'ajuda.png', audio: 'ajuda.m4a' }
    ]
  },
  {
    id: 'frase_5',
    instrucao: 'Coração em paz! Monte: Eu + Calma',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Calma', padrao: 'calma.png', audio: 'calma.m4a', cor: 'border-blue' },
    distratores: [
      { texto: 'Bravo', padrao: 'bravo.png', audio: 'bravo.m4a' },
      { texto: 'Água', padrao: 'agua.png', audio: 'agua.m4a' }
    ]
  }
];

export default function JogoFrases({ preferenciasVisuais = {}, onClose }) {
  const [indiceMissao, setIndiceMissao] = useState(0);
  const [estrelas, setEstrelas] = useState(0);
  const [caixa1Preenchida, setCaixa1Preenchida] = useState(null);
  const [caixa2Preenchida, setCaixa2Preenchida] = useState(null);
  const [cartoesDisponiveis, setCartoesDisponiveis] = useState([]);
  const [concluido, setConcluido] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  const audioAtualRef = useRef(null);
  const travaAntiSpamRef = useRef(false);

  const missaoAtual = MISSOES_FRASES[indiceMissao];

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

  const prepararRodada = (missao) => {
    travaAntiSpamRef.current = false;
    setBloqueado(false);
    setCaixa1Preenchida(null);
    setCaixa2Preenchida(null);

    const lista = [missao.passo1, missao.passo2, ...missao.distratores].sort(() => 0.5 - Math.random());
    setCartoesDisponiveis(lista);
  };

  useEffect(() => {
    prepararRodada(missaoAtual);
    return () => {
      if (audioAtualRef.current) {
        audioAtualRef.current.pause();
        audioAtualRef.current.currentTime = 0;
      }
    };
  }, [indiceMissao]);

  const obterImagem = (item) => {
    if (!item) return '';
    const prefs = preferenciasVisuais || {};
    return prefs[item.texto] || item.padrao;
  };

  const selecionarCartao = (item) => {
    if (travaAntiSpamRef.current || bloqueado) return;

    // Etapa 1: Preencher a Caixa 1 (Sujeito: "Eu") se ela estiver vazia
    if (!caixa1Preenchida) {
      if (item.texto === missaoAtual.passo1.texto) {
        tocarAudio(item.audio);
        setCaixa1Preenchida(item);
      }
      return;
    } 
    
    // Etapa 2: Com a Caixa 1 preenchida, preencher a Caixa 2 (Ação/Objeto)
    if (!caixa2Preenchida) {
      // Trava de segurança: impede clicar no "Eu" de novo achando que é o segundo passo
      if (item.texto === missaoAtual.passo1.texto) return;

      if (item.texto === missaoAtual.passo2.texto) {
        travaAntiSpamRef.current = true;
        setBloqueado(true);
        setCaixa2Preenchida(item);

        // Toca SOMENTE o áudio do complemento correto de forma limpa e imediata
        tocarAudio(item.audio, () => {
          const novasEstrelas = estrelas + 1;
          setEstrelas(novasEstrelas);

          tocarAudio('acerto_suave.m4a', () => {
            setTimeout(() => {
              if (novasEstrelas >= MISSOES_FRASES.length) {
                setConcluido(true);
                tocarAudio('parabens_final.m4a');
              } else {
                setIndiceMissao((ant) => ant + 1);
              }
            }, 400);
          });
        });
      } else {
        // Se clicar em um distrator, toca apenas o som dele
        tocarAudio(item.audio);
      }
    }
  };

  const reiniciarJogo = () => {
    setEstrelas(0);
    setIndiceMissao(0);
    setConcluido(false);
    prepararRodada(MISSOES_FRASES[0]);
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

      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        background: '#0f172a',
        padding: '10px 24px',
        borderRadius: '30px',
        border: '1px solid #334155'
      }}>
        {MISSOES_FRASES.map((_, idx) => (
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
          border: '2px solid #8b5cf6',
          maxWidth: '520px',
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
        }}>
          <h2 style={{ color: '#a78bfa', fontSize: '2.2rem', marginBottom: '12px' }}>
            🎉 Maravilhoso!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '28px' }}>
            Você montou todas as frases completas com muita autonomia!
          </p>
          <button
            type="button"
            onClick={reiniciarJogo}
            style={{
              background: '#8b5cf6',
              color: '#ffffff',
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
          
          <h2 style={{ color: '#38bdf8', fontSize: '1.7rem', margin: '0 0 6px 0', textAlign: 'center' }}>
            💬 Fábrica de Frases
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0 0 24px 0', textAlign: 'center' }}>
            {missaoAtual.instrucao}
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '36px',
            background: '#0f172a',
            padding: '20px 32px',
            borderRadius: '24px',
            border: '2px solid #1e293b',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              width: '140px',
              height: '150px',
              borderRadius: '20px',
              border: caixa1Preenchida ? '3.5px solid #eab308' : '3px dashed #eab308',
              background: caixa1Preenchida ? '#1e293b' : 'rgba(234, 179, 8, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: caixa1Preenchida ? '0 0 18px rgba(234, 179, 8, 0.5)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {caixa1Preenchida ? (
                <>
                  <img
                    src={`/img/${obterImagem(caixa1Preenchida)}`}
                    alt={caixa1Preenchida.texto}
                    style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '8px' }}
                  />
                  <span style={{ color: '#fef08a', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {caixa1Preenchida.texto}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '2rem', marginBottom: '4px' }}>👤</span>
                  <span style={{ color: '#eab308', fontWeight: 'bold', fontSize: '0.95rem' }}>1º QUEM?</span>
                </>
              )}
            </div>

            <span style={{ color: '#38bdf8', fontSize: '2.4rem', fontWeight: 'bold', userSelect: 'none' }}>＋</span>

            <div style={{
              width: '140px',
              height: '150px',
              borderRadius: '20px',
              border: caixa2Preenchida ? '3.5px solid #22c55e' : (caixa1Preenchida ? '3px dashed #22c55e' : '3px dashed #475569'),
              background: caixa2Preenchida ? '#1e293b' : (caixa1Preenchida ? 'rgba(34, 197, 94, 0.05)' : 'transparent'),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: caixa2Preenchida ? '0 0 18px rgba(34, 197, 94, 0.5)' : 'none',
              opacity: caixa1Preenchida ? 1 : 0.45,
              transition: 'all 0.3s ease'
            }}>
              {caixa2Preenchida ? (
                <>
                  <img
                    src={`/img/${obterImagem(caixa2Preenchida)}`}
                    alt={caixa2Preenchida.texto}
                    style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '8px' }}
                  />
                  <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {caixa2Preenchida.texto}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '2rem', marginBottom: '4px' }}>🎯</span>
                  <span style={{ color: caixa1Preenchida ? '#4ade80' : '#94a3b8', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    2º O QUE QUER?
                  </span>
                </>
              )}
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '780px'
          }}>
            {cartoesDisponiveis.map((c) => {
              const ehCaixa1Usada = caixa1Preenchida && caixa1Preenchida.texto === c.texto;
              const ehCaixa2Usada = caixa2Preenchida && caixa2Preenchida.texto === c.texto;
              const desabilitar = ehCaixa1Usada || ehCaixa2Usada || bloqueado;

              return (
                <button
                  key={c.texto}
                  type="button"
                  onClick={() => selecionarCartao(c)}
                  disabled={desabilitar}
                  style={{
                    background: '#0f172a',
                    border: '2px solid #334155',
                    borderRadius: '18px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: desabilitar ? 'default' : 'pointer',
                    opacity: desabilitar ? 0.25 : 1,
                    transform: desabilitar ? 'scale(0.95)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    minWidth: '125px',
                    userSelect: 'none'
                  }}
                >
                  <img
                    src={`/img/${obterImagem(c)}`}
                    alt={c.texto}
                    style={{ width: '75px', height: '75px', objectFit: 'contain', marginBottom: '8px', pointerEvents: 'none' }}
                  />
                  <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '1.1rem', pointerEvents: 'none' }}>
                    {c.texto}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ height: '40px', marginTop: '20px' }}>
            {caixa1Preenchida && caixa2Preenchida && (
              <span style={{ color: '#4ade80', fontSize: '1.35rem', fontWeight: 'bold' }}>
                🌟 Frase montada com sucesso!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}