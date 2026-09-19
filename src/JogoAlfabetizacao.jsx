// (c) 2026 Guillermo Roger Hernandez Chandia - ADS
import React, { useState, useEffect, useRef } from 'react';
import { ALFABETO_COMPLETO, BANCO_PALAVRAS, BANCO_VOGAIS, BANCO_NUMERAIS, GERAR_CONTAS } from './data/bancoAlfabetizacao';
import { salvarPalavraComAudio, listarPalavrasComAudio } from './utils/bancoPersistencia';

export default function JogoAlfabetizacao({ preferenciasVisuais = {}, onClose }) {
  const [modo, setModo] = useState('escrever');
  const [faseAtual, setFaseAtual] = useState(0);
  const [tamanhoRodada, setTamanhoRodada] = useState(10);
  const [opcoes, setOpcoes] = useState([]);
  const [acertou, setAcertou] = useState(false);
  const [desativadas, setDesativadas] = useState([]);
  const [fimDeJogo, setFimDeJogo] = useState(false);
  const [metricas, setMetricas] = useState([]);
  const [tentativasFase, setTentativasFase] = useState(1);
  const [bateria, setBateria] = useState([]);

  // Montagem da palavra letra por letra
  const [letrasPreenchidas, setLetrasPreenchidas] = useState([]);

  // Estados do Modal de Criação Personalizada
  const [mostrandoModalCriar, setMostrandoModalCriar] = useState(false);
  const [novaPalavra, setNovaPalavra] = useState('');
  const [novoEmoji, setNovoEmoji] = useState('🐶');
  const [novaDica, setNovaDica] = useState('');

  // Estados do Microfone e Foto Pessoal (IndexedDB)
  const [gravando, setGravando] = useState(false);
  const [audioGravadoBlob, setAudioGravadoBlob] = useState(null);
  const [audioUrlPreview, setAudioUrlPreview] = useState(null);
  const [fotoBlob, setFotoBlob] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const mediaRecorderRef = useRef(null);
  const pedacosAudioRef = useRef([]);

  const timestampInicio = useRef(null);
  const audioRef = useRef(null);

  const tocarAudio = (caminhoOuBlob) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (caminhoOuBlob) {
      let src = '';
      if (typeof caminhoOuBlob === 'string') {
        src = caminhoOuBlob.startsWith('blob:') ? caminhoOuBlob : `/audios/${caminhoOuBlob}`;
      } else if (caminhoOuBlob instanceof Blob) {
        src = URL.createObjectURL(caminhoOuBlob);
      }

      if (src) {
        const audio = new Audio(src);
        audioRef.current = audio;
        audio.play().catch(() => {});
      }
    }
  };

  const iniciarNovaBateria = async (tipoModo, qtd = tamanhoRodada) => {
    let base = [];
    if (tipoModo === 'escrever') {
      const salvas = await listarPalavrasComAudio();
      // Puxa as 20 oficiais e as personalizadas que tenham áudio gravado
      base = [...BANCO_PALAVRAS, ...salvas].filter((item) => item.audioDica || item.audioBlob);
    } else if (tipoModo === 'vogais') {
      base = [...BANCO_VOGAIS];
    } else if (tipoModo === 'numerais') {
      base = [...BANCO_NUMERAIS];
    } else {
      base = GERAR_CONTAS();
    }

    const limite = tipoModo === 'escrever' ? Math.min(qtd, base.length) : 5;
    const embaralhada = [...base].sort(() => 0.5 - Math.random()).slice(0, limite);

    setBateria(embaralhada);
    setFaseAtual(0);
    setMetricas([]);
    setFimDeJogo(false);
    setLetrasPreenchidas([]);
    carregarFase(embaralhada, 0, tipoModo);
  };

  const carregarFase = (listaBateria, indice, tipoModo) => {
    const itemAlvo = listaBateria[indice];
    setLetrasPreenchidas([]);
    setAcertou(false);
    setDesativadas([]);
    setTentativasFase(1);
    timestampInicio.current = Date.now();

    if (tipoModo === 'escrever') {
      setOpcoes(ALFABETO_COMPLETO);
      // Toca a gravação automaticamente (.m4a oficial ou Blob do microfone)
      if (itemAlvo && (itemAlvo.audioBlob || itemAlvo.audioDica)) {
        tocarAudio(itemAlvo.audioBlob || itemAlvo.audioDica);
      }
    } else {
      const baseGeral = tipoModo === 'vogais' ? BANCO_VOGAIS : BANCO_NUMERAIS;
      const distratores = baseGeral
        .filter((i) => i.simbolo !== itemAlvo.simbolo)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      const opcoesEmbaralhadas = [
        { id: itemAlvo.id, simbolo: itemAlvo.simbolo, dica: itemAlvo.dica, audio: itemAlvo.audio },
        ...distratores
      ].sort(() => 0.5 - Math.random());

      setOpcoes(opcoesEmbaralhadas);
      tocarAudio(itemAlvo.audioPergunta);
    }
  };

  useEffect(() => {
    iniciarNovaBateria(modo, tamanhoRodada);
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [modo, tamanhoRodada]);

  // Gravação de Áudio com o Microfone Nativo
  const iniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      pedacosAudioRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) pedacosAudioRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blobGravado = new Blob(pedacosAudioRef.current, { type: 'audio/webm' });
        setAudioGravadoBlob(blobGravado);
        setAudioUrlPreview(URL.createObjectURL(blobGravado));
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setGravando(true);
    } catch (err) {
      alert('Acesso ao microfone negado ou indisponível.');
    }
  };

  const pararGravacao = () => {
    if (mediaRecorderRef.current && gravando) {
      mediaRecorderRef.current.stop();
      setGravando(false);
    }
  };

  const lidarComFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoBlob(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  // Teclado Assistivo A-Z
  const lidarComLetraAbecedario = (letra) => {
    if (acertou || fimDeJogo) return;

    tocarAudio(`letra_${letra.toLowerCase()}.m4a`);

    const itemAlvo = bateria[faseAtual];
    const palavraAlvo = itemAlvo.palavra.toUpperCase();
    const proximaPosicao = letrasPreenchidas.length;
    const letraEsperada = palavraAlvo[proximaPosicao];

    if (letra === letraEsperada) {
      const novoPreenchimento = [...letrasPreenchidas, letra];
      setLetrasPreenchidas(novoPreenchimento);
      setDesativadas([]);

      if (novoPreenchimento.length === palavraAlvo.length) {
        concluirFase(`${palavraAlvo} (${itemAlvo.emoji || '✨'})`);
      }
    } else {
      setTentativasFase((prev) => prev + 1);
      setDesativadas((prev) => [...prev, letra]);
    }
  };

  const lidarComSelecaoCartas = (opcao) => {
    if (desativadas.includes(opcao.id) || acertou || fimDeJogo) return;

    const itemAlvo = bateria[faseAtual];

    if (opcao.simbolo === itemAlvo.simbolo) {
      tocarAudio(opcao.audio);
      concluirFase(modo === 'contas' ? `${itemAlvo.expressao} = ${itemAlvo.simbolo}` : itemAlvo.simbolo);
    } else {
      setDesativadas((prev) => [...prev, opcao.id]);
      setTentativasFase((prev) => prev + 1);
      tocarAudio(opcao.audio);
    }
  };

  const concluirFase = (rotulo) => {
    const latencia = Date.now() - timestampInicio.current;
    setAcertou(true);

    const novaMetrica = {
      fase: faseAtual + 1,
      simbolo: rotulo,
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
  };

  const salvarNovaPalavra = async (e) => {
    e.preventDefault();
    if (!novaPalavra.trim()) return;

    const palavraFormatada = novaPalavra.trim().toUpperCase().replace(/[^A-Z]/g, '');
    if (!palavraFormatada) {
      alert('Utilize apenas letras de A a Z.');
      return;
    }

    const itemNovo = {
      id: `custom_${Date.now()}`,
      palavra: palavraFormatada,
      emoji: novoEmoji.trim() || '✨',
      dica: novaDica.trim() || 'Palavra personalizada',
      audioBlob: audioGravadoBlob || null,
      fotoBlob: fotoBlob || null
    };

    try {
      await salvarPalavraComAudio(itemNovo);
      setMostrandoModalCriar(false);
      setNovaPalavra('');
      setNovaDica('');
      setNovoEmoji('🐶');
      setAudioGravadoBlob(null);
      setAudioUrlPreview(null);
      setFotoBlob(null);
      setFotoPreview(null);
      iniciarNovaBateria(modo, tamanhoRodada);
    } catch {
      alert('Erro ao guardar no cofre permanente do navegador.');
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
        backgroundColor: 'rgba(10, 15, 29, 0.94)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Barra de Menus */}
      <div
        style={{
          width: '100%',
          maxWidth: '880px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          background: 'rgba(30, 41, 59, 0.8)',
          padding: '10px 16px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={() => setModo('escrever')}
            style={{
              backgroundColor: modo === 'escrever' ? '#38bdf8' : '#1e293b',
              color: modo === 'escrever' ? '#0f172a' : '#fff',
              border: modo === 'escrever' ? '2px solid #7dd3fc' : '1px solid #475569',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: '800',
              cursor: 'pointer'
            }}
          >
            ✍️ Escrever
          </button>
          <button
            onClick={() => setModo('vogais')}
            style={{
              backgroundColor: modo === 'vogais' ? '#3b82f6' : '#1e293b',
              color: '#fff',
              border: modo === 'vogais' ? '2px solid #60a5fa' : '1px solid #475569',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🔤 Vogais
          </button>
          <button
            onClick={() => setModo('numerais')}
            style={{
              backgroundColor: modo === 'numerais' ? '#06b6d4' : '#1e293b',
              color: '#fff',
              border: modo === 'numerais' ? '2px solid #67e8f9' : '1px solid #475569',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            🔢 Números
          </button>
          <button
            onClick={() => setModo('contas')}
            style={{
              backgroundColor: modo === 'contas' ? '#10b981' : '#1e293b',
              color: '#fff',
              border: modo === 'contas' ? '2px solid #34d399' : '1px solid #475569',
              padding: '8px 14px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            ➕ Contas
          </button>

          {modo === 'escrever' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Palavras:</span>
              {[5, 10, 15, 20].map((qtd) => (
                <button
                  key={qtd}
                  onClick={() => setTamanhoRodada(qtd)}
                  style={{
                    backgroundColor: tamanhoRodada === qtd ? '#f59e0b' : '#334155',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 9px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  {qtd}
                </button>
              ))}
              <button
                onClick={() => setMostrandoModalCriar(true)}
                style={{
                  backgroundColor: '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  marginLeft: '4px'
                }}
              >
                ➕ Criar
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '10px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ✕ Fechar
        </button>
      </div>

      {!fimDeJogo ? (
        <div style={{ textAlign: 'center', maxWidth: '880px', width: '100%' }}>
          {/* Indicador de Fases */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {bateria.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: idx === faseAtual ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '10px',
                  backgroundColor: idx <= faseAtual ? '#38bdf8' : '#334155',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* MODO ESCREVER */}
          {modo === 'escrever' && itemAtual && (
            <div>
              <div
                style={{
                  background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                  padding: '16px 20px',
                  borderRadius: '20px',
                  marginBottom: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {itemAtual.fotoBlob ? (
                    <img
                      src={URL.createObjectURL(itemAtual.fotoBlob)}
                      alt="Foto"
                      style={{ width: '64px', height: '64px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #38bdf8' }}
                    />
                  ) : (
                    <span style={{ fontSize: '3.8rem' }}>{itemAtual.emoji || '✨'}</span>
                  )}
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'block' }}>
                      Palavra {faseAtual + 1} de {bateria.length}:
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#38bdf8' }}>
                        {itemAtual.dica}
                      </span>
                      {(itemAtual.audioBlob || itemAtual.audioDica) && (
                        <button
                          type="button"
                          onClick={() => tocarAudio(itemAtual.audioBlob || itemAtual.audioDica)}
                          style={{
                            background: 'rgba(56, 189, 248, 0.2)',
                            border: '1px solid #38bdf8',
                            color: '#fff',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Repetir dica"
                        >
                          🔊 Repetir
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Caixas de Letras */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {itemAtual.palavra.split('').map((letra, idx) => {
                    const preenchida = letrasPreenchidas[idx];
                    const ehProxima = idx === letrasPreenchidas.length;

                    return (
                      <div
                        key={idx}
                        style={{
                          width: '52px',
                          height: '60px',
                          borderRadius: '12px',
                          border: preenchida
                            ? '3px solid #4ade80'
                            : ehProxima
                            ? '3px dashed #38bdf8'
                            : '2px dashed #475569',
                          backgroundColor: preenchida
                            ? 'rgba(34, 197, 94, 0.2)'
                            : ehProxima
                            ? 'rgba(56, 189, 248, 0.1)'
                            : 'rgba(15, 23, 42, 0.5)',
                          fontSize: '2.2rem',
                          fontWeight: '900',
                          color: '#4ade80',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: preenchida ? 'scale(1.05)' : 'scale(1)',
                          transition: 'all 0.2s'
                        }}
                      >
                        {preenchida || ''}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Teclado Completo A a Z */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '7px',
                  justifyContent: 'center',
                  maxWidth: '840px',
                  margin: '0 auto',
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '14px',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                {ALFABETO_COMPLETO.map((letra) => {
                  const estaDesativada = desativadas.includes(letra);

                  return (
                    <button
                      key={letra}
                      onClick={() => lidarComLetraAbecedario(letra)}
                      disabled={estaDesativada || acertou}
                      style={{
                        width: '52px',
                        height: '54px',
                        borderRadius: '12px',
                        border: estaDesativada ? '1px dashed #475569' : '1px solid rgba(255, 255, 255, 0.15)',
                        backgroundColor: '#1e293b',
                        color: estaDesativada ? '#475569' : '#f8fafc',
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        cursor: estaDesativada ? 'not-allowed' : 'pointer',
                        transform: estaDesativada ? 'scale(0.9)' : 'scale(1)',
                        opacity: estaDesativada ? 0.3 : 1,
                        transition: 'all 0.15s'
                      }}
                    >
                      {letra}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DEMAIS MODOS */}
          {modo !== 'escrever' && (
            <div>
              <div
                style={{
                  background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                  padding: '24px',
                  borderRadius: '24px',
                  marginBottom: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <span style={{ fontSize: modo === 'contas' ? '2.6rem' : '1.8rem', fontWeight: '800' }}>
                    {modo === 'contas' && itemAtual ? `${itemAtual.expressao} = ?` : 'Encontre o símbolo'}
                  </span>
                  {itemAtual && (
                    <button
                      onClick={() => tocarAudio(itemAtual.audioPergunta)}
                      style={{
                        backgroundColor: '#0284c7',
                        border: 'none',
                        color: '#fff',
                        padding: '10px 18px',
                        borderRadius: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      🔊 Ouvir
                    </button>
                  )}
                </div>

                {modo === 'contas' && itemAtual && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', background: 'rgba(56, 189, 248, 0.15)', padding: '6px 12px', borderRadius: '12px' }}>
                      {Array.from({ length: itemAtual.n1 }).map((_, i) => (
                        <span key={`b1_${i}`} style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#38bdf8' }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '1.4rem', color: '#cbd5e1', fontWeight: '900' }}>+</span>
                    <div style={{ display: 'flex', gap: '8px', background: 'rgba(74, 222, 128, 0.15)', padding: '6px 12px', borderRadius: '12px' }}>
                      {Array.from({ length: itemAtual.n2 }).map((_, i) => (
                        <span key={`b2_${i}`} style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '22px' }}>
                {opcoes.map((opcao) => {
                  const ehAlvo = opcao.simbolo === itemAtual?.simbolo;
                  const mostrarSucesso = acertou && ehAlvo;
                  const estaDesativada = desativadas.includes(opcao.id);

                  return (
                    <button
                      key={opcao.id}
                      onClick={() => lidarComSelecaoCartas(opcao)}
                      disabled={estaDesativada || acertou}
                      style={{
                        flex: 1,
                        maxWidth: '180px',
                        height: '210px',
                        background: mostrarSucesso
                          ? 'linear-gradient(135deg, #15803d, #22c55e)'
                          : estaDesativada
                          ? '#1e293b'
                          : 'linear-gradient(145deg, #1e293b, #334155)',
                        border: mostrarSucesso
                          ? '4px solid #4ade80'
                          : estaDesativada
                          ? '2px dashed #475569'
                          : '2px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '24px',
                        color: estaDesativada ? '#64748b' : '#f8fafc',
                        cursor: estaDesativada ? 'not-allowed' : 'pointer',
                        transform: mostrarSucesso ? 'scale(1.08)' : estaDesativada ? 'scale(0.92)' : 'scale(1)',
                        opacity: estaDesativada ? 0.35 : 1,
                        transition: 'all 0.25s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <span style={{ fontSize: '4.8rem', fontWeight: '900', lineHeight: 1 }}>{opcao.simbolo}</span>
                      {opcao.dica && !estaDesativada && modo !== 'contas' && (
                        <span style={{ fontSize: '0.95rem', color: '#94a3b8', fontWeight: '600' }}>{opcao.dica}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Ecrã de Fim de Jogo */
        <div
          style={{
            background: 'linear-gradient(145deg, #1e293b, #0f172a)',
            padding: '32px',
            borderRadius: '28px',
            maxWidth: '540px',
            width: '100%',
            textAlign: 'center',
            border: '2px solid #22c55e'
          }}
        >
          <h2 style={{ color: '#4ade80', fontSize: '2rem', marginBottom: '8px' }}>🎉 Desafio Concluído!</h2>
          <p style={{ color: '#94a3b8', marginBottom: '18px' }}>
            Rodada de {metricas.length} palavras concluída com sucesso.
          </p>

          <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', background: '#0f172a', padding: '12px', borderRadius: '14px', textAlign: 'left' }}>
            {metricas.map((m, idx) => (
              <div key={idx} style={{ padding: '8px 10px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Palavra: <b style={{ color: '#38bdf8' }}>{m.simbolo}</b></span>
                <span style={{ color: '#94a3b8' }}>{(m.latenciaMs / 1000).toFixed(1)}s</span>
                <span
                  style={{
                    backgroundColor: m.acertoDireto ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: m.acertoDireto ? '#4ade80' : '#f87171',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}
                >
                  {m.acertoDireto ? 'Direto' : `${m.tentativas} tent.`}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <button onClick={copiarMetricas} style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              📋 Copiar Métricas
            </button>
            <button onClick={() => iniciarNovaBateria(modo, tamanhoRodada)} style={{ backgroundColor: '#22c55e', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
              🔄 Jogar de Novo
            </button>
          </div>
        </div>
      )}

      {/* MODAL COM MICROFONE E FOTO PRÓPRIA */}
      {mostrandoModalCriar && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '16px'
          }}
        >
          <form
            onSubmit={salvarNovaPalavra}
            style={{
              background: '#1e293b',
              padding: '24px',
              borderRadius: '26px',
              maxWidth: '540px',
              width: '100%',
              border: '2px solid #8b5cf6',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              position: 'relative'
            }}
          >
            {/* BOTÃO FECHAR NO CANTO SUPERIOR DIREITO */}
            <button
              type="button"
              onClick={() => setMostrandoModalCriar(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94a3b8',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.color = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#94a3b8';
              }}
              title="Fechar"
            >
              ✕
            </button>

            <h3 style={{ color: '#c084fc', margin: 0, fontSize: '1.4rem', paddingRight: '36px' }}>
              ➕ Adicionar Palavra com Voz Própria
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
              Grave a sua própria voz ao vivo para ensinar a criança com afeto.
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#cbd5e1', fontWeight: 'bold' }}>
                Palavra (sem acentos):
              </label>
              <input
                type="text"
                placeholder="Ex: NINA"
                value={novaPalavra}
                onChange={(e) => setNovaPalavra(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #475569',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {/* SEÇÃO DO MICROFONE */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '12px 16px',
                borderRadius: '14px',
                border: gravando ? '2px solid #ef4444' : '1px solid #334155',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 'bold' }}>
                Gravação da Sua Voz (Microfone):
              </label>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                {!gravando ? (
                  <button
                    type="button"
                    onClick={iniciarGravacao}
                    style={{
                      backgroundColor: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    🎙️ Gravar Voz
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={pararGravacao}
                    style={{
                      backgroundColor: '#f59e0b',
                      color: '#000',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    ⏹️ Parar Gravação
                  </button>
                )}

                {audioUrlPreview && !gravando && (
                  <button
                    type="button"
                    onClick={() => tocarAudio(audioUrlPreview)}
                    style={{
                      backgroundColor: '#10b981',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    ▶️ Ouvir Gravação
                  </button>
                )}

                <span style={{ fontSize: '0.85rem', color: audioGravadoBlob ? '#4ade80' : '#94a3b8' }}>
                  {gravando ? '🔴 Gravando...' : audioGravadoBlob ? '✓ Áudio gravado com sucesso!' : '(Opcional: use a sua voz)'}
                </span>
              </div>
            </div>

            {/* SEÇÃO DA FOTO PRÓPRIA */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid #334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 'bold', marginBottom: '4px' }}>
                  Foto Própria (Opcional):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={lidarComFoto}
                  style={{ fontSize: '0.8rem', color: '#94a3b8' }}
                />
              </div>

              {fotoPreview && (
                <img
                  src={fotoPreview}
                  alt="Prévia"
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #a855f7' }}
                />
              )}
            </div>

            {/* Vitrina de Símbolos / Emojis */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 'bold' }}>
                  Ou escolha um Símbolo:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Ativo:</span>
                  <span style={{ fontSize: '2.2rem', background: '#0f172a', padding: '2px 12px', borderRadius: '12px', border: '2px solid #a855f7' }}>
                    {novoEmoji}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                  gap: '8px',
                  background: '#0f172a',
                  padding: '12px',
                  borderRadius: '16px',
                  maxHeight: '140px',
                  overflowY: 'auto',
                  border: '1px solid #334155'
                }}
              >
                {[
                  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
                  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦆', '🦅', '🦉',
                  '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐢', '🐙', '🐟',
                  '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈',
                  '🍕', '🌭', '🥪', '🍿', '🧁', '🍰', '🎂', '🍦', '🍩', '🍪',
                  '⚽', '🏀', '🏈', '⚾', '🎾', '🪀', '🎮', '🧸', '🚗', '🚕',
                  '🚌', '🏎️', '🚓', '🚑', '🚒', '🛵', '🏍️', '🚲', '🛴', '🛹',
                  '☀️', '🌙', '⭐', '☁️', '🌧️', '⚡', '🔥', '🌈', '✨', '❤️',
                  '👨‍👩‍👧', '👶', '👦', '👧', '👨', '👩', '👴', '👵', '🎒', '📚'
                ].map((item, idx) => (
                  <button
                    key={`${item}_${idx}`}
                    type="button"
                    onClick={() => setNovoEmoji(item)}
                    style={{
                      height: '50px',
                      fontSize: '1.9rem',
                      background: novoEmoji === item ? 'rgba(139, 92, 246, 0.45)' : '#1e293b',
                      border: novoEmoji === item ? '2px solid #c084fc' : '1px solid #334155',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: novoEmoji === item ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '4px', color: '#cbd5e1', fontWeight: 'bold' }}>
                Dica em Texto:
              </label>
              <input
                type="text"
                placeholder="Ex: Nossa cachorrinha querida"
                value={novaDica}
                onChange={(e) => setNovaDica(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1px solid #475569',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setMostrandoModalCriar(false)}
                style={{
                  backgroundColor: '#475569',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  backgroundColor: '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
                }}
              >
                Salvar Palavra
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}