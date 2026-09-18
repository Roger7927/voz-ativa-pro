// (c) 2026 Guillermo Roger Hernandez Chandia - ADS
import React, { useState, useEffect, useRef } from 'react';
import { BANCO_VOGAIS, BANCO_NUMERAIS, GERAR_CONTAS } from './data/bancoAlfabetizacao';

export default function JogoAlfabetizacao({ preferenciasVisuais = {}, onClose }) {
  const [modo, setModo] = useState('vogais'); // 'vogais', 'numerais' ou 'contas'
  const [faseAtual, setFaseAtual] = useState(0);
  const [opcoes, setOpcoes] = useState([]);
  const [acertou, setAcertou] = useState(false);
  const [desativada, setDesativada] = useState(false);
  const [fimDeJogo, setFimDeJogo] = useState(false);
  const [metricas, setMetricas] = useState([]);
  const [tentativasFase, setTentativasFase] = useState(1);
  const [bateria, setBateria] = useState([]);

  const timestampInicio = useRef(null);
  const audioRef = useRef(null);

  const tocarAudio = (caminho) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (caminho) {
      const audio = new Audio(`/audios/${caminho}`);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
  };

  const iniciarNovaBateria = (tipoModo) => {
    let base = [];
    if (tipoModo === 'vogais') base = [...BANCO_VOGAIS];
    else if (tipoModo === 'numerais') base = [...BANCO_NUMERAIS];
    else base = GERAR_CONTAS();

    const embaralhada = base.sort(() => 0.5 - Math.random()).slice(0, 5);
    setBateria(embaralhada);
    setFaseAtual(0);
    setMetricas([]);
    setFimDeJogo(false);
    carregarFase(embaralhada, 0, tipoModo);
  };

  const carregarFase = (listaBateria, indice, tipoModo) => {
    const itemAlvo = listaBateria[indice];
    const baseGeral = tipoModo === 'vogais' ? BANCO_VOGAIS : BANCO_NUMERAIS;

    // Sorteia 2 opções erradas de números para acompanhar o alvo
    const distratores = baseGeral
      .filter((i) => i.simbolo !== itemAlvo.simbolo)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const opcoesEmbaralhadas = [
      { id: itemAlvo.id, simbolo: itemAlvo.simbolo, audio: itemAlvo.audio },
      ...distratores
    ].sort(() => 0.5 - Math.random());

    setOpcoes(opcoesEmbaralhadas);
    setAcertou(false);
    setDesativada(false);
    setTentativasFase(1);
    timestampInicio.current = Date.now();

    tocarAudio(itemAlvo.audioPergunta);
  };

  useEffect(() => {
    iniciarNovaBateria(modo);
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [modo]);

  const lidarComSelecao = (opcao) => {
    if (desativada || fimDeJogo) return;

    const itemAlvo = bateria[faseAtual];

    if (opcao.simbolo === itemAlvo.simbolo) {
      const latencia = Date.now() - timestampInicio.current;
      tocarAudio(opcao.audio);
      setAcertou(true);
      setDesativada(true);

      const novaMetrica = {
        fase: faseAtual + 1,
        simbolo: modo === 'contas' ? `${itemAlvo.expressao} = ${itemAlvo.simbolo}` : itemAlvo.simbolo,
        tentativas: tentativasFase,
        latenciaMs: latencia,
        acertoDireto: tentativasFase === 1
      };

      const metricasAtualizadas = [...metricas, novaMetrica];
      setMetricas(metricasAtualizadas);

      setTimeout(() => {
        if (faseAtual + 1 < bateria.length) {
          const prox = faseAtual + 1;
          setFaseAtual(prox);
          carregarFase(bateria, prox, modo);
        } else {
          setFimDeJogo(true);
          tocarAudio('parabens_final.m4a');
        }
      }, 1500);
    } else {
      setTentativasFase((prev) => prev + 1);
      tocarAudio(opcao.audio);
    }
  };

  const copiarMetricas = () => {
    const texto = metricas
      .map(
        (m) =>
          `Item: ${m.simbolo} | Tentativas: ${m.tentativas} | Tempo: ${(m.latenciaMs / 1000).toFixed(1)}s | Direto: ${m.acertoDireto ? 'Sim' : 'Não'}`
      )
      .join('\n');
    navigator.clipboard.writeText(texto);
    alert('Relatório copiado com sucesso!');
  };

  const itemAtual = bateria[faseAtual];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        color: '#f8fafc',
        fontFamily: 'sans-serif'
      }}
    >
      {/* Botões de Modo */}
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setModo('vogais')}
            style={{
              backgroundColor: modo === 'vogais' ? '#3b82f6' : '#334155',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔤 Vogais
          </button>
          <button
            onClick={() => setModo('numerais')}
            style={{
              backgroundColor: modo === 'numerais' ? '#3b82f6' : '#334155',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🔢 Numerais
          </button>
          <button
            onClick={() => setModo('contas')}
            style={{
              backgroundColor: modo === 'contas' ? '#10b981' : '#334155',
              color: '#fff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ➕ Continhas
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            padding: '8px 14px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ✕ Fechar
        </button>
      </div>

      {!fimDeJogo ? (
        <div style={{ textAlign: 'center', maxWidth: '600px', width: '100%' }}>
          <div style={{ marginBottom: '16px', fontSize: '1.1rem', color: '#94a3b8' }}>
            Fase {faseAtual + 1} de 5
          </div>

          <div
            style={{
              backgroundColor: '#1e293b',
              padding: '24px',
              borderRadius: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}
          >
            <span style={{ fontSize: modo === 'contas' ? '2.2rem' : '1.5rem', fontWeight: 'bold' }}>
              {modo === 'contas' && itemAtual ? `${itemAtual.expressao} = ?` : 'Encontre o símbolo'}
            </span>
            {itemAtual && (
              <button
                onClick={() => tocarAudio(itemAtual.audioPergunta)}
                style={{
                  backgroundColor: '#0284c7',
                  border: 'none',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                🔊 Ouvir
              </button>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            {opcoes.map((opcao) => {
              const ehAlvo = opcao.simbolo === itemAtual?.simbolo;
              const mostrarSucesso = acertou && ehAlvo;

              return (
                <button
                  key={opcao.id}
                  onClick={() => lidarComSelecao(opcao)}
                  disabled={desativada && !mostrarSucesso}
                  style={{
                    flex: 1,
                    maxWidth: '160px',
                    height: '180px',
                    backgroundColor: '#1e293b',
                    border: mostrarSucesso ? '4px solid #22c55e' : '2px solid #475569',
                    borderRadius: '20px',
                    fontSize: '4.5rem',
                    fontWeight: '900',
                    color: mostrarSucesso ? '#4ade80' : '#f8fafc',
                    cursor: 'pointer',
                    boxShadow: mostrarSucesso ? '0 0 20px rgba(34, 197, 94, 0.4)' : 'none',
                    transform: mostrarSucesso ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {opcao.simbolo}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '20px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <h2 style={{ color: '#4ade80', marginBottom: '10px' }}>🎉 Desafio Concluído!</h2>
          <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Resultados do Reconhecimento</p>

          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', textAlign: 'left' }}>
            {metricas.map((m, idx) => (
              <div key={idx} style={{ padding: '8px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between' }}>
                <span>Item: <b>{m.simbolo}</b></span>
                <span>{(m.latenciaMs / 1000).toFixed(1)}s</span>
                <span style={{ color: m.acertoDireto ? '#4ade80' : '#f87171' }}>
                  {m.acertoDireto ? 'Direto' : `${m.tentativas} tent.`}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={copiarMetricas}
              style={{
                backgroundColor: '#0284c7',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              📋 Copiar Métricas
            </button>
            <button
              onClick={() => iniciarNovaBateria(modo)}
              style={{
                backgroundColor: '#22c55e',
                color: '#fff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔄 Repetir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}