// (c) 2026 Guillermo Roger Hernandez Chandia - ADS
import { useState, useEffect } from 'react';
import { emitirVoz } from './audioEngine';

const BANCO_COMPLETO_EMOCOES = [
  {
    id: 'fase_1',
    enunciado: 'Ganhei um abraço bem gostoso e meu desenho favorito na TV...',
    audioEnunciado: 'pergunta_feliz.m4a',
    dica: 'Um sorriso no rosto e o coração contente.',
    alvo: { texto: 'Feliz', padrao: 'feliz.png', audio: 'feliz.m4a' },
    distratores: [
      { texto: 'Triste', padrao: 'triste.png', audio: 'triste.m4a' },
      { texto: 'Remédio', padrao: 'remedio.png', audio: 'remedio.m4a' },
      { texto: 'Dor de Barriga', padrao: 'dor-barriga.png', audio: 'dor_de_barriga.m4a' },
      { texto: 'Água', padrao: 'agua.png', audio: 'agua.m4a' },
      { texto: 'Comer', padrao: 'comer.png', audio: 'comer.m4a' }
    ]
  },
  {
    id: 'fase_2',
    enunciado: 'Meu brinquedo quebrou e eu fiquei muito chateado...',
    audioEnunciado: 'pergunta_triste.m4a',
    dica: 'Vontade de chorar e ficar quietinho no canto.',
    alvo: { texto: 'Triste', padrao: 'triste.png', audio: 'triste.m4a' },
    distratores: [
      { texto: 'Feliz', padrao: 'feliz.png', audio: 'feliz.m4a' },
      { texto: 'Comer', padrao: 'comer.png', audio: 'comer.m4a' },
      { texto: 'Banheiro', padrao: 'banheiro.png', audio: 'banheiro.m4a' },
      { texto: 'Brincar', padrao: 'brincar.png', audio: 'brincar.m4a' },
      { texto: 'Dormir', padrao: 'dormir.png', audio: 'quero_dormir.m4a' }
    ]
  },
  {
    id: 'fase_3',
    enunciado: 'Alguém tomou meu brinquedo da mão sem pedir licença...',
    audioEnunciado: 'pergunta_bravo.m4a',
    dica: 'A carinha fica fechada e dá vontade de reclamar.',
    alvo: { texto: 'Bravo', padrao: 'bravo.png', audio: 'bravo.m4a' },
    distratores: [
      { texto: 'Calma', padrao: 'calma.png', audio: 'calma.m4a' },
      { texto: 'Água', padrao: 'agua.png', audio: 'agua.m4a' },
      { texto: 'Dormir', padrao: 'dormir.png', audio: 'quero_dormir.m4a' },
      { texto: 'Feliz', padrao: 'feliz.png', audio: 'feliz.m4a' },
      { texto: 'Triste', padrao: 'triste.png', audio: 'triste.m4a' }
    ]
  },
  {
    id: 'fase_4',
    enunciado: 'Ficou tudo escuro e deu um trovão muito forte na janela...',
    audioEnunciado: 'pergunta_trovao_medo.m4a',
    dica: 'O coração bate ligeiro e a gente quer colo.',
    alvo: { texto: 'Medo', padrao: 'medo.png', audio: 'estou_com_medo.m4a' },
    distratores: [
      { texto: 'Gostei Muito', padrao: 'gostei-muito.png', audio: 'gostei_muito.m4a' },
      { texto: 'Frio', padrao: 'frio.png', audio: 'estou_com_frio.m4a' },
      { texto: 'Brincar', padrao: 'brincar.png', audio: 'brincar.m4a' },
      { texto: 'Calma', padrao: 'calma.png', audio: 'calma.m4a' },
      { texto: 'Ajuda', padrao: 'ajuda.png', audio: 'ajuda.m4a' }
    ]
  },
  {
    id: 'fase_5',
    enunciado: 'Respirei bem fundo, bebi uma água e relaxei...',
    audioEnunciado: 'emocoes_pergunta_calma.m4a',
    dica: 'O corpinho fica leve e a mente descansa em paz.',
    alvo: { texto: 'Calma', padrao: 'calma.png', audio: 'calma.m4a' },
    distratores: [
      { texto: 'Barulho', padrao: 'barulho.png', audio: 'barulho.m4a' },
      { texto: 'Dor', padrao: 'dor.png', audio: 'dor.m4a' },
      { texto: 'Parar', padrao: 'parar.png', audio: 'parar.m4a' },
      { texto: 'Bravo', padrao: 'bravo.png', audio: 'bravo.m4a' },
      { texto: 'Medo', padrao: 'medo.png', audio: 'estou_com_medo.m4a' }
    ]
  },
  {
    id: 'fase_6',
    enunciado: 'Muitas buzinas, gritaria e som alto demais na rua...',
    audioEnunciado: 'pergunta_barulho.m4a',
    dica: 'Dá vontade de tampar os ouvidos com as mãos.',
    alvo: { texto: 'Barulho', padrao: 'barulho.png', audio: 'barulho.m4a' },
    distratores: [
      { texto: 'Feliz', padrao: 'feliz.png', audio: 'feliz.m4a' },
      { texto: 'Calor', padrao: 'calor.png', audio: 'estou_com_calor.m4a' },
      { texto: 'Água', padrao: 'agua.png', audio: 'agua.m4a' },
      { texto: 'Triste', padrao: 'triste.png', audio: 'triste.m4a' },
      { texto: 'Cansado', padrao: 'cansado.png', audio: 'cansado.m4a' }
    ]
  },
  {
    id: 'fase_7',
    enunciado: 'Brinquei a tarde inteira e meus olhinhos estão fechando...',
    audioEnunciado: 'pergunta_cansado.m4a',
    dica: 'O corpo quer deitar na cama e repousar.',
    alvo: { texto: 'Cansado', padrao: 'cansado.png', audio: 'cansado.m4a' },
    distratores: [
      { texto: 'Bravo', padrao: 'bravo.png', audio: 'bravo.m4a' },
      { texto: 'Comer', padrao: 'comer.png', audio: 'comer.m4a' },
      { texto: 'Brincar', padrao: 'brincar.png', audio: 'brincar.m4a' },
      { texto: 'Calma', padrao: 'calma.png', audio: 'calma.m4a' },
      { texto: 'Feliz', padrao: 'feliz.png', audio: 'feliz.m4a' }
    ]
  },
  {
    id: 'fase_8',
    enunciado: 'O almoço que fizeram para mim está delicioso...',
    audioEnunciado: 'pergunta_gostei_muito.m4a',
    dica: 'Coração contente e joinha positivo.',
    alvo: { texto: 'Gostei Muito', padrao: 'gostei-muito.png', audio: 'gostei_muito.m4a' },
    distratores: [
      { texto: 'Medo', padrao: 'medo.png', audio: 'estou_com_medo.m4a' },
      { texto: 'Dor', padrao: 'dor.png', audio: 'dor.m4a' },
      { texto: 'Triste', padrao: 'triste.png', audio: 'triste.m4a' },
      { texto: 'Barulho', padrao: 'barulho.png', audio: 'barulho.m4a' },
      { texto: 'Cansado', padrao: 'cansado.png', audio: 'cansado.m4a' }
    ]
  },
  {
    id: 'fase_9',
    enunciado: 'Tropecei no tapete, caí no chão e bati o joelho...',
    audioEnunciado: 'pergunta_dor.m4a',
    dica: 'Precisa de carinho, gelinho ou curativo.',
    alvo: { texto: 'Dor', padrao: 'dor.png', audio: 'dor.m4a' },
    distratores: [
      { texto: 'Feliz', padrao: 'feliz.png', audio: 'feliz.m4a' },
      { texto: 'Calma', padrao: 'calma.png', audio: 'calma.m4a' },
      { texto: 'Passear', padrao: 'passear.png', audio: 'quero_passear.m4a' },
      { texto: 'Triste', padrao: 'triste.png', audio: 'triste.m4a' },
      { texto: 'Bravo', padrao: 'bravo.png', audio: 'bravo.m4a' }
    ]
  },
  {
    id: 'fase_10',
    enunciado: 'A lição está muito difícil e não estou conseguindo sozinho...',
    audioEnunciado: 'pergunta_ajuda.m4a',
    dica: 'Chamar um adulto para ajudar com carinho.',
    alvo: { texto: 'Ajuda', padrao: 'ajuda.png', audio: 'ajuda.m4a' },
    distratores: [
      { texto: 'Dormir', padrao: 'dormir.png', audio: 'quero_dormir.m4a' },
      { texto: 'Remédio', padrao: 'remedio.png', audio: 'remedio.m4a' },
      { texto: 'Comer', padrao: 'comer.png', audio: 'comer.m4a' },
      { texto: 'Bravo', padrao: 'bravo.png', audio: 'bravo.m4a' },
      { texto: 'Triste', padrao: 'triste.png', audio: 'triste.m4a' }
    ]
  },
  {
    id: 'fase_11',
    enunciado: 'Abriram a porta com tudo, levei um baita susto e meu coração disparou...',
    audioEnunciado: 'pergunta_susto_medo.m4a',
    dica: 'O coração bate ligeiro e a gente quer colo.',
    alvo: { texto: 'Medo', padrao: 'medo.png', audio: 'estou_com_medo.m4a' },
    distratores: [
      { texto: 'Feliz', padrao: 'feliz.png', audio: 'feliz.m4a' },
      { texto: 'Calma', padrao: 'calma.png', audio: 'calma.m4a' },
      { texto: 'Barulho', padrao: 'barulho.png', audio: 'barulho.m4a' },
      { texto: 'Triste', padrao: 'triste.png', audio: 'triste.m4a' },
      { texto: 'Bravo', padrao: 'bravo.png', audio: 'bravo.m4a' }
    ]
  }
];

export default function JogoEmocoes({ preferenciasVisuais = {}, onClose }) {
  const [etapaMenu, setEtapaMenu] = useState(true);
  const [dificuldade, setDificuldade] = useState('medio');
  const [fasesPartida, setFasesPartida] = useState([]);
  const [indiceFase, setIndiceFase] = useState(0);
  const [opcoesAtuais, setOpcoesAtuais] = useState([]);
  const [estrelas, setEstrelas] = useState(0);
  const [errosPartida, setErrosPartida] = useState(0);
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
  const [bloqueado, setBloqueado] = useState(false);
  const [concluido, setConcluido] = useState(false);
  const [mensagemIncentivo, setMensagemIncentivo] = useState(null);

  const iniciarNovaPartida = (nivelEscolhido) => {
    setDificuldade(nivelEscolhido);

    const sorteadas = [...BANCO_COMPLETO_EMOCOES]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    setFasesPartida(sorteadas);
    setIndiceFase(0);
    setEstrelas(0);
    setErrosPartida(0);
    setCartaoSelecionado(null);
    setBloqueado(false);
    setConcluido(false);
    setMensagemIncentivo(null);
    setEtapaMenu(false);

    prepararFase(sorteadas[0], nivelEscolhido);
  };

  const prepararFase = (fase, nivel) => {
    if (!fase) return;
    setMensagemIncentivo(null);

    const qtdDistratores = nivel === 'dificil' ? 5 : 3;
    const distratoresEmbaralhados = [...fase.distratores]
      .sort(() => 0.5 - Math.random())
      .slice(0, qtdDistratores);

    const opcoes = [fase.alvo, ...distratoresEmbaralhados]
      .sort(() => 0.5 - Math.random());

    setOpcoesAtuais(opcoes);
  };

  const faseAtual = fasesPartida[indiceFase];

  const obterImagem = (item) => {
    if (!item) return '';
    const prefs = preferenciasVisuais || {};
    return prefs[item.texto] || item.padrao;
  };

  const tocarPergunta = () => {
    if (!faseAtual) return;
    emitirVoz(faseAtual.audioEnunciado, faseAtual.enunciado);
  };

  const lidarComSelecao = (opcao) => {
    if (bloqueado || concluido || !faseAtual) return;

    setCartaoSelecionado(opcao.texto);

    if (opcao.texto === faseAtual.alvo.texto) {
      setBloqueado(true);
      setMensagemIncentivo('Muito bem! 🌟');

      // Toca o áudio do cartão clicado
      emitirVoz(opcao.audio, opcao.texto, () => {
        // Toca o reforço positivo suave gravado
        emitirVoz('acerto_suave.m4a', 'Muito bem!', () => {
          const novasEstrelas = estrelas + 1;
          setEstrelas(novasEstrelas);

          setTimeout(() => {
            if (novasEstrelas >= fasesPartida.length) {
              setConcluido(true);
              emitirVoz('parabens_final.m4a', 'Parabéns! Você conseguiu!');
            } else {
              const proximo = indiceFase + 1;
              setCartaoSelecionado(null);
              setBloqueado(false);
              setIndiceFase(proximo);
              prepararFase(fasesPartida[proximo], dificuldade);
            }
          }, 500);
        });
      });
    } else {
      setErrosPartida(prev => prev + 1);
      emitirVoz(opcao.audio, opcao.texto);

      setTimeout(() => {
        setCartaoSelecionado(null);
      }, 700);
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
      touchAction: 'manipulation'
    }}>
      <button
        type="button"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: 44,
          height: 44,
          fontSize: '1.2rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          zIndex: 20
        }}
      >
        ✖
      </button>

      {/* MENU DE SELEÇÃO */}
      {etapaMenu ? (
        <div style={{
          textAlign: 'center',
          background: '#0f172a',
          padding: '36px 28px',
          borderRadius: 24,
          border: '2px solid #38bdf8',
          maxWidth: 480,
          width: '92%',
          boxShadow: '0 0 40px rgba(56, 189, 248, 0.25)'
        }}>
          <h2 style={{ color: '#38bdf8', fontSize: '1.75rem', marginBottom: 6 }}>
            🎭 Detetive das Emoções
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: 28 }}>
            Escolha o nível de desafio:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button
              onClick={() => iniciarNovaPartida('facil')}
              style={estiloBotaoNivel('#22c55e', '#4ade80')}
            >
              🟢 Fácil — 4 opções
            </button>
            <button
              onClick={() => iniciarNovaPartida('medio')}
              style={estiloBotaoNivel('#38bdf8', '#38bdf8')}
            >
              🔵 Médio — 4 opções (padrão)
            </button>
            <button
              onClick={() => iniciarNovaPartida('dificil')}
              style={estiloBotaoNivel('#a855f7', '#c084fc')}
            >
              🟣 Difícil — 6 opções
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Trilha de Estrelas */}
          <div style={{
            display: 'flex',
            gap: 10,
            marginBottom: 18,
            background: '#0f172a',
            padding: '8px 22px',
            borderRadius: 24,
            border: '1px solid #334155'
          }}>
            {[0, 1, 2, 3, 4].map((idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '1.75rem',
                  filter: idx < estrelas ? 'none' : 'grayscale(100%) opacity(0.3)',
                  transform: idx < estrelas ? 'scale(1.12)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
              >
                ⭐
              </span>
            ))}
          </div>

          {/* RELATÓRIO FINAL */}
          {concluido ? (
            <div style={{
              textAlign: 'center',
              background: '#0f172a',
              padding: '32px 26px',
              borderRadius: 24,
              border: '2px solid #22c55e',
              maxWidth: 480,
              width: '92%',
              boxShadow: '0 0 40px rgba(34, 197, 94, 0.25)'
            }}>
              <h2 style={{ color: '#4ade80', fontSize: '1.9rem', marginBottom: 6 }}>
                🎉 Missão Concluída!
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', marginBottom: 22 }}>
                Ótimo trabalho no reconhecimento das emoções.
              </p>

              <div style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: 16,
                padding: 18,
                marginBottom: 26,
                textAlign: 'left'
              }}>
                <h4 style={{
                  color: '#38bdf8',
                  margin: '0 0 14px 0',
                  fontSize: '0.95rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  📊 Relatório de Observação Pedagógica
                </h4>

                <Linha label="Nível" valor={dificuldade.toUpperCase()} cor="#38bdf8" />
                <Linha label="Estrelas" valor={`${estrelas} de 5`} cor="#4ade80" />
                <Linha
                  label="Erros / Tentativas Extras"
                  valor={errosPartida}
                  cor={errosPartida === 0 ? '#4ade80' : '#f59e0b'}
                />
                <Linha
                  label="Aproveitamento Geral"
                  valor={`${Math.round((5 / (5 + errosPartida)) * 100)}%`}
                  cor="#f8fafc"
                />
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => setEtapaMenu(true)}
                  style={{
                    background: '#1e293b',
                    color: '#38bdf8',
                    border: '1.5px solid #38bdf8',
                    padding: '12px 20px',
                    borderRadius: 14,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Trocar Nível
                </button>
                <button
                  onClick={() => iniciarNovaPartida(dificuldade)}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 22px',
                    borderRadius: 14,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Jogar Novamente
                </button>
              </div>
            </div>
          ) : (
            /* TELA DA ATIVIDADE */
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: 580,
              width: '100%'
            }}>
              <div style={{
                background: '#0f172a',
                border: '2px solid #38bdf8',
                borderRadius: 22,
                padding: '20px 18px',
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: 20,
                position: 'relative',
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
              }}>
                <button
                  type="button"
                  onClick={tocarPergunta}
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    background: '#1e293b',
                    color: '#38bdf8',
                    border: '1.5px solid #38bdf8',
                    borderRadius: 12,
                    padding: '6px 14px',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  🔊 Ouvir
                </button>

                <p style={{
                  color: '#f8fafc',
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  lineHeight: 1.45,
                  margin: '0 0 12px 0',
                  paddingRight: 80,
                  textAlign: 'left'
                }}>
                  "{faseAtual?.enunciado}"
                </p>

                <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  💡 {faseAtual?.dica}
                </div>

                {mensagemIncentivo && (
                  <div style={{
                    marginTop: 12,
                    color: '#4ade80',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    textAlign: 'center',
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    {mensagemIncentivo}
                  </div>
                )}
              </div>

              {/* Grade de opções neutras */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: dificuldade === 'dificil' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                gap: 14,
                width: '100%'
              }}>
                {opcoesAtuais.map((op) => {
                  const ehAlvo = op.texto === faseAtual?.alvo?.texto;
                  const selecionado = cartaoSelecionado === op.texto;

                  let borda = '2px solid #334155';
                  let sombra = 'none';

                  if (selecionado) {
                    borda = ehAlvo ? '3px solid #22c55e' : '3px solid #ef4444';
                    sombra = ehAlvo
                      ? '0 0 18px rgba(34, 197, 94, 0.4)'
                      : '0 0 12px rgba(239, 68, 68, 0.3)';
                  }

                  return (
                    <button
                      key={op.texto}
                      type="button"
                      onClick={() => lidarComSelecao(op)}
                      disabled={bloqueado}
                      style={{
                        background: '#0f172a',
                        border: borda,
                        borderRadius: 18,
                        padding: '14px 8px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: bloqueado ? 'default' : 'pointer',
                        boxShadow: sombra,
                        transform: selecionado ? 'scale(1.03)' : 'scale(1)',
                        transition: 'all 0.22s ease',
                        minHeight: 128,
                        userSelect: 'none'
                      }}
                    >
                      <img
                        src={`/img/${obterImagem(op)}`}
                        alt={op.texto}
                        style={{
                          width: 66,
                          height: 66,
                          objectFit: 'contain',
                          marginBottom: 8,
                          pointerEvents: 'none'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span style={{
                        color: '#f1f5f9',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        textAlign: 'center',
                        pointerEvents: 'none'
                      }}>
                        {op.texto}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function estiloBotaoNivel(borda, cor) {
  return {
    background: '#1e293b',
    border: `2px solid ${borda}`,
    color: cor,
    padding: '14px',
    borderRadius: 14,
    fontSize: '1.05rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };
}

function Linha({ label, valor, cor }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      color: '#f8fafc',
      fontSize: '0.95rem',
      marginBottom: 8
    }}>
      <span>{label}:</span>
      <strong style={{ color: cor }}>{valor}</strong>
    </div>
  );
}