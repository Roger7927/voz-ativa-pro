import { useState, useEffect, useRef } from 'react';
import { BANCO_FUNCOES } from './data/bancoFuncoes';

const TOTAL_FASES_SESSAO = 5;

export default function JogoFuncional({ preferenciasVisuais = {}, onClose }) {
  const [fasesSessao, setFasesSessao] = useState([]);
  const [indiceFase, setIndiceFase] = useState(0);
  const [estrelas, setEstrelas] = useState(0);
  const [opcoes, setOpcoes] = useState([]);
  const [desativadas, setDesativadas] = useState([]);
  const [acertou, setAcertou] = useState(false);
  const [concluido, setConcluido] = useState(false);

  // Telemetria clínica (latência e erros)
  const [metricasSessao, setMetricasSessao] = useState([]);
  const [tentativasFase, setTentativasFase] = useState(0);
  const inicioFaseTimestampRef = useRef(0);

  const audioAtualRef = useRef(null);
  const travaAntiSpamRef = useRef(false);

  const cancelarSintese = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const pararAudio = () => {
    cancelarSintese();
    if (audioAtualRef.current) {
      audioAtualRef.current.pause();
      audioAtualRef.current.currentTime = 0;
    }
  };

  const tocarAudioGravado = (caminho, aoTerminar = null) => {
    pararAudio();

    const audio = new Audio(`/audios/${caminho}`);
    audioAtualRef.current = audio;

    if (aoTerminar) {
      audio.onended = () => {
        cancelarSintese();
        aoTerminar();
      };
    }

    audio.play().catch((erro) => {
      console.warn(`[Áudio Ausente] Não foi possível reproduzir /audios/${caminho}`, erro);
      if (aoTerminar) aoTerminar();
    });
  };

  const sortearFasesSessao = () => {
    const embaralhadas = [...BANCO_FUNCOES].sort(() => 0.5 - Math.random());
    return embaralhadas.slice(0, TOTAL_FASES_SESSAO);
  };

  const prepararFase = (desafio) => {
    if (!desafio) return;
    cancelarSintese();
    travaAntiSpamRef.current = false;
    setAcertou(false);
    setDesativadas([]);
    setTentativasFase(0);
    inicioFaseTimestampRef.current = performance.now();

    const misturadas = [desafio.alvo, ...desafio.distratores].sort(() => 0.5 - Math.random());
    setOpcoes(misturadas);

    setTimeout(() => {
      tocarAudioGravado(desafio.audioPergunta);
    }, 350);
  };

  const iniciarNovaPartida = () => {
    const novasFases = sortearFasesSessao();
    setFasesSessao(novasFases);
    setEstrelas(0);
    setIndiceFase(0);
    setMetricasSessao([]);
    setConcluido(false);
    prepararFase(novasFases[0]);
  };

  useEffect(() => {
    iniciarNovaPartida();
    const silenciadorLoop = setInterval(cancelarSintese, 500);

    return () => {
      clearInterval(silenciadorLoop);
      pararAudio();
    };
  }, []);

  useEffect(() => {
    if (fasesSessao.length > 0 && !concluido) {
      prepararFase(fasesSessao[indiceFase]);
    }
  }, [indiceFase]);

  const desafioAtual = fasesSessao[indiceFase];

  const obterImagem = (item) => {
    if (!item) return '';
    return preferenciasVisuais?.[item.texto] || item.img;
  };

  const responder = (opcao) => {
    cancelarSintese();
    if (travaAntiSpamRef.current || acertou || desativadas.includes(opcao.texto)) {
      return;
    }

    const agora = performance.now();
    const latenciaSegundos = ((agora - inicioFaseTimestampRef.current) / 1000).toFixed(2);
    const tentativaAtual = tentativasFase + 1;
    setTentativasFase(tentativaAtual);

    if (opcao.texto === desafioAtual.alvo.texto) {
      travaAntiSpamRef.current = true;
      setAcertou(true);
      const novasEstrelas = estrelas + 1;
      setEstrelas(novasEstrelas);

      const registroClinico = {
        id: desafioAtual.id,
        titulo: desafioAtual.titulo,
        tempoReacao: latenciaSegundos,
        errosAntesAcerto: tentativaAtual - 1,
        acertoDireto: tentativaAtual === 1
      };
      setMetricasSessao((prev) => [...prev, registroClinico]);

      tocarAudioGravado(opcao.audio, () => {
        setTimeout(() => {
          tocarAudioGravado('acerto_suave.m4a', () => {
            setTimeout(() => {
              if (novasEstrelas >= TOTAL_FASES_SESSAO) {
                setConcluido(true);
                tocarAudioGravado('parabens_final.m4a');
              } else {
                setIndiceFase((ant) => ant + 1);
              }
            }, 500);
          });
        }, 300);
      });
    } else {
      setDesativadas((ant) => [...ant, opcao.texto]);
      if (opcao.audio) {
        tocarAudioGravado(opcao.audio);
      }
    }
  };

  const copiarRelatorio = () => {
    const acertosDiretos = metricasSessao.filter((m) => m.acertoDireto).length;
    const taxaAcuracia = ((acertosDiretos / metricasSessao.length) * 100).toFixed(1);
    const mediaLatencia = (
      metricasSessao.reduce((acc, cur) => acc + parseFloat(cur.tempoReacao), 0) / metricasSessao.length
    ).toFixed(2);

    const relatorio = `RELATÓRIO CLÍNICO DE FUNÇÃO E CAUSALIDADE (VOZATIVA PRO)
Taxa de Acurácia Direta: ${taxaAcuracia}%
Latência Média: ${mediaLatencia}s
Fases Avaliadas: ${metricasSessao.length}
Detalhamento:
${metricasSessao.map((m) => `• ${m.titulo}: ${m.tempoReacao}s - Erros prévios: ${m.errosAntesAcerto}`).join('\n')}`;

    navigator.clipboard.writeText(relatorio);
    alert('Relatório copiado com sucesso!');
  };

  if (!desafioAtual && !concluido) {
    return null;
  }

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
          pararAudio();
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

      {/* Indicador de 5 Estrelas */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        background: '#0f172a',
        padding: '10px 24px',
        borderRadius: '30px',
        border: '1px solid #334155'
      }}>
        {Array.from({ length: TOTAL_FASES_SESSAO }).map((_, idx) => (
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
          padding: '36px',
          borderRadius: '24px',
          border: '2px solid #22c55e',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)'
        }}>
          <h2 style={{ color: '#4ade80', fontSize: '2rem', marginBottom: '12px' }}>
            🎉 Bateria Concluída com Sucesso!
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1rem', marginBottom: '20px' }}>
            Dados de usabilidade registrados para fins pedagógicos e de intervenção:
          </p>

          <div style={{
            background: '#020617',
            padding: '12px',
            borderRadius: '12px',
            border: '1px solid #334155',
            marginBottom: '20px',
            maxHeight: '160px',
            overflowY: 'auto'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem', color: '#f8fafc' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #475569', color: '#38bdf8' }}>
                  <th style={{ padding: '6px' }}>Item</th>
                  <th style={{ padding: '6px' }}>Tempo</th>
                  <th style={{ padding: '6px' }}>Erros</th>
                </tr>
              </thead>
              <tbody>
                {metricasSessao.map((m, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '6px' }}>{m.titulo}</td>
                    <td style={{ padding: '6px' }}>{m.tempoReacao}s</td>
                    <td style={{ padding: '6px' }}>{m.errosAntesAcerto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={copiarRelatorio}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              📋 Copiar Métricas
            </button>
            <button
              type="button"
              onClick={iniciarNovaPartida}
              style={{
                background: '#22c55e',
                color: '#0f172a',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              🔄 Reiniciar
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '820px', width: '100%' }}>
          
          <div style={{ position: 'relative', width: '100%', textAlign: 'center', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => tocarAudioGravado(desafioAtual.audioPergunta)}
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
              🎯 Para Que Serve?
            </h2>
          </div>

          <div style={{
            background: '#0f172a',
            border: '2px solid #1e293b',
            borderRadius: '24px',
            padding: '20px 32px',
            marginBottom: '28px',
            textAlign: 'center',
            maxWidth: '540px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>
              {desafioAtual.iconeSituacao}
            </div>
            <p style={{ color: '#f8fafc', fontSize: '1.4rem', fontWeight: 'bold', margin: '0', lineHeight: 1.3 }}>
              {desafioAtual.situacao}
            </p>
          </div>

          {/* Opções Funcionais */}
          <div style={{
            display: 'flex',
            gap: '16px',
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
                    transform: foiAcerto ? 'scale(1.08)' : 'scale(1)',
                    boxShadow: foiAcerto ? '0 0 20px rgba(34, 197, 94, 0.6)' : 'none',
                    transition: 'all 0.2s ease',
                    minWidth: '130px',
                    userSelect: 'none'
                  }}
                >
                  <img
                    src={`/img/${obterImagem(op)}`}
                    alt={op.texto}
                    style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '8px', pointerEvents: 'none' }}
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
                ⭐ Muito bem!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}