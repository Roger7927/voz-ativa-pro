/* Copyright: (c) 2026 - Guillermo Roger Hernandez Chandia. 
   Status: All Rights Reserved (Todos os Direitos Reservados). 
   Contexto: Projeto acadêmico de Análise e Desenvolvimento de Sistemas (ADS). */

import { useState, useEffect, useRef } from 'react';

const MISSOES_FRASES = [
  {
    id: 'frase_1',
    instrucao: 'Vamos pedir comida? Monte: Eu + Quero + Comer',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Quero', padrao: 'quero.png', audio: 'quero.m4a', cor: 'border-green' },
    passo3: { texto: 'Comer', padrao: 'comer.png', audio: 'eat.m4a', cor: 'border-green' },
    distratores: [
      { texto: 'Banheiro', padrao: 'banheiro.png', audio: 'banheiro.m4a' },
      { texto: 'Bravo', padrao: 'bravo.png', audio: 'bravo.m4a' }
    ]
  },
  {
    id: 'frase_2',
    instrucao: 'Sentiu sede? Monte: Eu + Quero + Água',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Quero', padrao: 'quero.png', audio: 'quero.m4a', cor: 'border-green' },
    passo3: { texto: 'Água', padrao: 'agua.png', audio: 'water.m4a', cor: 'border-orange' },
    distratores: [
      { texto: 'Dormir', padrao: 'dormir.png', audio: 'dormir_novo.m4a' },
      { texto: 'Barulho', padrao: 'barulho.png', audio: 'barulho.m4a' }
    ]
  },
  {
    id: 'frase_3',
    instrucao: 'Hora da diversão! Monte: Eu + Quero + Brincar',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Quero', padrao: 'quero.png', audio: 'quero.m4a', cor: 'border-green' },
    passo3: { texto: 'Brincar', padrao: 'brincar.png', audio: 'brincar_novo.m4a', cor: 'border-green' },
    distratores: [
      { texto: 'Dor', padrao: 'dor.png', audio: 'dor.m4a' },
      { texto: 'Passear', padrao: 'passear.png', audio: 'passear.m4a' }
    ]
  },
  {
    id: 'frase_4',
    instrucao: 'O corpo quer descansar! Monte: Eu + Quero + Dormir',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Quero', padrao: 'quero.png', audio: 'quero.m4a', cor: 'border-green' },
    passo3: { texto: 'Dormir', padrao: 'dormir.png', audio: 'dormir_novo.m4a', cor: 'border-green' },
    distratores: [
      { texto: 'Comer', padrao: 'comer.png', audio: 'eat.m4a' },
      { texto: 'Ajuda', padrao: 'ajuda.png', audio: 'help.m4a' }
    ]
  },
  {
    id: 'frase_5',
    instrucao: 'Coração em paz! Monte: Eu + Quero + Calma',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Quero', padrao: 'quero.png', audio: 'quero.m4a', cor: 'border-green' },
    passo3: { texto: 'Calma', padrao: 'calma.png', audio: 'calma_novo.m4a', cor: 'border-blue' },
    distratores: [
      { texto: 'Bravo', padrao: 'bravo.png', audio: 'bravo.m4a' },
      { texto: 'Água', padrao: 'agua.png', audio: 'water.m4a' }
    ]
  },
  {
    id: 'frase_6',
    instrucao: 'Que tal uma fruta? Monte: Eu + Quero + Maçã',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Quero', padrao: 'quero.png', audio: 'quero.m4a', cor: 'border-green' },
    passo3: { texto: 'Maçã', padrao: 'maca.png', audio: 'maca.m4a', cor: 'border-orange' },
    distratores: [
      { texto: 'Banheiro', padrao: 'banheiro.png', audio: 'banheiro.m4a' },
      { texto: 'Dor', padrao: 'dor.png', audio: 'dor.m4a' }
    ]
  },
  {
    id: 'frase_7',
    instrucao: 'Vamos ser artistas! Monte: Eu + Quero + Desenhar',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Quero', padrao: 'quero.png', audio: 'quero.m4a', cor: 'border-green' },
    passo3: { texto: 'Desenhar', padrao: 'desenhar.png', audio: 'desenhar.m4a', cor: 'border-green' },
    distratores: [
      { texto: 'Dormir', padrao: 'dormir.png', audio: 'dormir_novo.m4a' },
      { texto: 'Bravo', padrao: 'bravo.png', audio: 'bravo.m4a' }
    ]
  },
  {
    id: 'frase_8',
    instrucao: 'Bateu uma fominha? Monte: Eu + Quero + Pão',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Quero', padrao: 'quero.png', audio: 'quero.m4a', cor: 'border-green' },
    passo3: { texto: 'Pão', padrao: 'pao.png', audio: 'pao.m4a', cor: 'border-orange' },
    distratores: [
      { texto: 'Barulho', padrao: 'barulho.png', audio: 'barulho.m4a' },
      { texto: 'Calma', padrao: 'calma.png', audio: 'calma_novo.m4a' }
    ]
  },
  {
    id: 'frase_9',
    instrucao: 'Hora de viajar na história! Monte: Eu + Quero + Livro',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Quero', padrao: 'quero.png', audio: 'quero.m4a', cor: 'border-green' },
    passo3: { texto: 'Livro', padrao: 'livro.png', audio: 'livro.m4a', cor: 'border-blue' },
    distratores: [
      { texto: 'Comer', padrao: 'comer.png', audio: 'eat.m4a' },
      { texto: 'Passear', padrao: 'passear.png', audio: 'passear.m4a' }
    ]
  },
  {
    id: 'frase_10',
    instrucao: 'Precisa de apoio? Monte: Eu + Quero + Ajuda',
    passo1: { texto: 'Eu', padrao: 'eu.png', audio: 'Eu.m4a', cor: 'border-yellow' },
    passo2: { texto: 'Quero', padrao: 'quero.png', audio: 'quero.m4a', cor: 'border-green' },
    passo3: { texto: 'Ajuda', padrao: 'ajuda.png', audio: 'help.m4a', cor: 'border-blue' },
    distratores: [
      { texto: 'Brincar', padrao: 'brincar.png', audio: 'brincar_novo.m4a' },
      { texto: 'Água', padrao: 'agua.png', audio: 'water.m4a' }
    ]
  }
];

export default function JogoFrases({ preferenciasVisuais = {}, onClose }) {
  const [indiceMissao, setIndiceMissao] = useState(0);
  const [estrelas, setEstrelas] = useState(0);
  const [caixa1Preenchida, setCaixa1Preenchida] = useState(null);
  const [caixa2Preenchida, setCaixa2Preenchida] = useState(null);
  const [caixa3Preenchida, setCaixa3Preenchida] = useState(null);
  const [cartoesDisponiveis, setCartoesDisponiveis] = useState([]);
  const [concluido, setConcluido] = useState(false);
  const [bloqueado, setBloqueado] = useState(false);

  const audioAtualRef = useRef(null);
  const travaAntiSpamRef = useRef(false);

  const missaoAtual = MISSOES_FRASES[indiceMissao];

  const falarTextoNativo = (texto, aoTerminar = null) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const fala = new SpeechSynthesisUtterance(texto);
      fala.lang = 'pt-BR';
      fala.rate = 0.95;
      fala.onend = () => { if (aoTerminar) aoTerminar(); };
      fala.onerror = () => { if (aoTerminar) aoTerminar(); };
      window.speechSynthesis.speak(fala);
    } else if (aoTerminar) {
      aoTerminar();
    }
  };

  const tocarAudio = (caminho, textoFallback = '', aoTerminar = null) => {
    if (audioAtualRef.current) {
      audioAtualRef.current.pause();
      audioAtualRef.current.currentTime = 0;
    }

    let executado = false;
    const finalizar = () => {
      if (!executado) {
        executado = true;
        if (aoTerminar) aoTerminar();
      }
    };

    if (caminho) {
      const audio = new Audio(`/audios/${caminho}`);
      audioAtualRef.current = audio;

      audio.onended = () => {
        finalizar();
      };

      audio.onerror = () => {
        if (textoFallback) {
          falarTextoNativo(textoFallback, finalizar);
        } else {
          finalizar();
        }
      };

      const promessa = audio.play();
      if (promessa !== undefined) {
        promessa.catch(() => {
          if (textoFallback) {
            falarTextoNativo(textoFallback, finalizar);
          } else {
            finalizar();
          }
        });
      }
    } else if (textoFallback) {
      falarTextoNativo(textoFallback, finalizar);
    } else {
      finalizar();
    }
  };

  const prepararRodada = (missao) => {
    travaAntiSpamRef.current = false;
    setBloqueado(false);
    setCaixa1Preenchida(null);
    setCaixa2Preenchida(null);
    setCaixa3Preenchida(null);

    const lista = [missao.passo1, missao.passo2, missao.passo3, ...missao.distratores].sort(() => 0.5 - Math.random());
    setCartoesDisponiveis(lista);
  };

  useEffect(() => {
    prepararRodada(missaoAtual);
    return () => {
      if (audioAtualRef.current) {
        audioAtualRef.current.pause();
        audioAtualRef.current.currentTime = 0;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
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

    // Etapa 1: Caixa 1 (Sujeito: "Eu")
    if (!caixa1Preenchida) {
      if (item.texto === missaoAtual.passo1.texto) {
        tocarAudio(item.audio, item.texto);
        setCaixa1Preenchida(item);
      } else {
        tocarAudio(item.audio, item.texto);
      }
      return;
    }

    // Etapa 2: Caixa 2 (Ação Núcleo: "Quero")
    if (!caixa2Preenchida) {
      if (item.texto === missaoAtual.passo2.texto) {
        tocarAudio(item.audio, item.texto);
        setCaixa2Preenchida(item);
      } else {
        tocarAudio(item.audio, item.texto);
      }
      return;
    }

    // Etapa 3: Caixa 3 (Predicado / Complemento)
    if (!caixa3Preenchida) {
      if (item.texto === missaoAtual.passo3.texto) {
        travaAntiSpamRef.current = true;
        setBloqueado(true);
        setCaixa3Preenchida(item);

        tocarAudio(item.audio, item.texto, () => {
          const novasEstrelas = estrelas + 1;
          setEstrelas(novasEstrelas);

          tocarAudio('acerto_suave.m4a', 'Muito bem!', () => {
            setTimeout(() => {
              if (novasEstrelas >= MISSOES_FRASES.length) {
                setConcluido(true);
                tocarAudio('parabens_final.m4a', 'Parabéns!');
              } else {
                setIndiceMissao((ant) => ant + 1);
              }
            }, 400);
          });
        });
      } else {
        tocarAudio(item.audio, item.texto);
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
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
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

      {/* Barra de Progresso com 10 Estrelas Compactas */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        background: '#0f172a',
        padding: '8px 20px',
        borderRadius: '30px',
        border: '1px solid #334155',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {MISSOES_FRASES.map((_, idx) => (
          <span
            key={idx}
            style={{
              fontSize: '1.6rem',
              filter: idx < estrelas ? 'none' : 'grayscale(100%) opacity(0.25)',
              transform: idx < estrelas ? 'scale(1.18)' : 'scale(1)',
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
            🎉 Campeão das Frases!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '28px' }}>
            Você completou as 10 frases com maestria e muita autonomia!
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '880px', width: '100%' }}>
          
          <h2 style={{ color: '#38bdf8', fontSize: '1.7rem', margin: '0 0 6px 0', textAlign: 'center' }}>
            💬 Fábrica de Frases ({indiceMissao + 1}/10)
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0 0 24px 0', textAlign: 'center' }}>
            {missaoAtual.instrucao}
          </p>

          {/* Esteira de Construção em 3 Caixas */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            marginBottom: '32px',
            background: '#0f172a',
            padding: '18px 24px',
            borderRadius: '24px',
            border: '2px solid #1e293b',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
            flexWrap: 'wrap'
          }}>
            {/* Caixa 1: Sujeito */}
            <div style={{
              width: '125px',
              height: '140px',
              borderRadius: '20px',
              border: caixa1Preenchida ? '3.5px solid #eab308' : '3px dashed #eab308',
              background: caixa1Preenchida ? '#1e293b' : 'rgba(234, 179, 8, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: caixa1Preenchida ? '0 0 16px rgba(234, 179, 8, 0.45)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {caixa1Preenchida ? (
                <>
                  <img
                    src={`/img/${obterImagem(caixa1Preenchida)}`}
                    alt={caixa1Preenchida.texto}
                    style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: '6px' }}
                  />
                  <span style={{ color: '#fef08a', fontWeight: 'bold', fontSize: '1.05rem' }}>
                    {caixa1Preenchida.texto}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.8rem', marginBottom: '4px' }}>👤</span>
                  <span style={{ color: '#eab308', fontWeight: 'bold', fontSize: '0.9rem' }}>1º QUEM?</span>
                </>
              )}
            </div>

            <span style={{ color: '#38bdf8', fontSize: '2rem', fontWeight: 'bold', userSelect: 'none' }}>＋</span>

            {/* Caixa 2: Quero */}
            <div style={{
              width: '125px',
              height: '140px',
              borderRadius: '20px',
              border: caixa2Preenchida ? '3.5px solid #22c55e' : (caixa1Preenchida ? '3px dashed #22c55e' : '3px dashed #475569'),
              background: caixa2Preenchida ? '#1e293b' : (caixa1Preenchida ? 'rgba(34, 197, 94, 0.05)' : 'transparent'),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: caixa2Preenchida ? '0 0 16px rgba(34, 197, 94, 0.45)' : 'none',
              opacity: caixa1Preenchida ? 1 : 0.45,
              transition: 'all 0.3s ease'
            }}>
              {caixa2Preenchida ? (
                <>
                  <img
                    src={`/img/${obterImagem(caixa2Preenchida)}`}
                    alt={caixa2Preenchida.texto}
                    style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: '6px' }}
                  />
                  <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1.05rem' }}>
                    {caixa2Preenchida.texto}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🤲</span>
                  <span style={{ color: caixa1Preenchida ? '#4ade80' : '#94a3b8', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    2º AÇÃO
                  </span>
                </>
              )}
            </div>

            <span style={{ color: '#38bdf8', fontSize: '2rem', fontWeight: 'bold', userSelect: 'none' }}>＋</span>

            {/* Caixa 3: Predicado */}
            <div style={{
              width: '125px',
              height: '140px',
              borderRadius: '20px',
              border: caixa3Preenchida ? '3.5px solid #38bdf8' : (caixa2Preenchida ? '3px dashed #38bdf8' : '3px dashed #475569'),
              background: caixa3Preenchida ? '#1e293b' : (caixa2Preenchida ? 'rgba(56, 189, 248, 0.05)' : 'transparent'),
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: caixa3Preenchida ? '0 0 16px rgba(56, 189, 248, 0.45)' : 'none',
              opacity: caixa2Preenchida ? 1 : 0.45,
              transition: 'all 0.3s ease'
            }}>
              {caixa3Preenchida ? (
                <>
                  <img
                    src={`/img/${obterImagem(caixa3Preenchida)}`}
                    alt={caixa3Preenchida.texto}
                    style={{ width: '72px', height: '72px', objectFit: 'contain', marginBottom: '6px' }}
                  />
                  <span style={{ color: '#38bdf8', fontWeight: 'bold', fontSize: '1.05rem' }}>
                    {caixa3Preenchida.texto}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.8rem', marginBottom: '4px' }}>🎯</span>
                  <span style={{ color: caixa2Preenchida ? '#38bdf8' : '#94a3b8', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    3º O QUÊ?
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Mesa de Cartões Disponíveis */}
          <div style={{
            display: 'flex',
            gap: '14px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '820px'
          }}>
            {cartoesDisponiveis.map((c) => {
              const ehCaixa1Usada = caixa1Preenchida && caixa1Preenchida.texto === c.texto;
              const ehCaixa2Usada = caixa2Preenchida && caixa2Preenchida.texto === c.texto;
              const ehCaixa3Usada = caixa3Preenchida && caixa3Preenchida.texto === c.texto;
              const desabilitar = ehCaixa1Usada || ehCaixa2Usada || ehCaixa3Usada || bloqueado;

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
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: desabilitar ? 'default' : 'pointer',
                    opacity: desabilitar ? 0.25 : 1,
                    transform: desabilitar ? 'scale(0.95)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    minWidth: '115px',
                    userSelect: 'none'
                  }}
                >
                  <img
                    src={`/img/${obterImagem(c)}`}
                    alt={c.texto}
                    style={{ width: '70px', height: '70px', objectFit: 'contain', marginBottom: '6px', pointerEvents: 'none' }}
                  />
                  <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '1.05rem', pointerEvents: 'none' }}>
                    {c.texto}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ height: '36px', marginTop: '16px' }}>
            {caixa1Preenchida && caixa2Preenchida && caixa3Preenchida && (
              <span style={{ color: '#4ade80', fontSize: '1.3rem', fontWeight: 'bold' }}>
                🌟 Frase montada com sucesso!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}