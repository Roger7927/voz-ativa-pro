/*
Copyright: (c) 2026 - Guillermo Roger Hernandez Chandia.
Status: All Rights Reserved (Todos os Direitos Reservados).
Contexto: Projeto acadêmico de Análise e Desenvolvimento de Sistemas (ADS).
*/

import React, { useState, useEffect } from 'react';
import { emitirVoz } from './audioEngine';

const MAPA_AUDIO_TOKENS = {
  'eu': 'Eu.m4a',
  'quero': 'quero.m4a',
  'água': 'quiz_agua.m4a',
  'agua': 'quiz_agua.m4a',
  'comer': 'quiz_comer.m4a',
  'beber': 'beber.m4a',
  'preciso': 'preciso.m4a',
  'ir': 'ir.m4a',
  'ao': 'ao.m4a',
  'banheiro': 'quiz_banheiro.m4a',
  'não': 'nao.m4a',
  'ajuda': 'quiz_ajuda.m4a',
  'feliz': 'feliz.m4a',
  'triste': 'triste.m4a',
  'bravo': 'bravo.m4a',
  'cansado': 'cansado.m4a',
  'medo': 'estou_com_medo.m4a',
  'brincar': 'brincar.m4a',
  'dormir': 'quero_dormir.m4a',
  'tomar-banho': 'tomar_banho.m4a',
  'escovar-os-dentes': 'escovar_os_dentes.m4a',
  'escovar': 'escovar.m4a',
  'lavar': 'lavar.m4a',
  'as': 'as.m4a',
  'mãos': 'maos.m4a',
  'primeiro': 'primeiro.m4a',
  'depois': 'depois.m4a',
  'para': 'para.m4a',
  'os': 'os.m4a',
  'dentes': 'dentes.m4a',
  'está': 'esta.m4a',
  'com': 'com.m4a',
  'muito': 'muito.m4a',
  'barulho': 'barulho.m4a',
  'calma': 'calma.m4a',
  'frio': 'frio.m4a',
  'calor': 'calor.m4a',
  'a': 'a.m4a',
  'luz': 'luz.m4a',
  'forte': 'forte.m4a',
  'professora': 'Professora.m4a',
  'de': 'de.m4a',
  'colega': 'Colega.m4a',
  'contigo': 'contigo.m4a',
  'obrigado': 'obrigado.m4a',
  'pela': 'pela.m4a',
  'estou': 'estou.m4a',
  'pode': 'pode.m4a',
  'abrir': 'abrir.m4a',
  'janela': 'janela.m4a',
  'fechar': 'fechar.m4a',
  'porta': 'porta.m4a',
  'um': 'um.m4a',
  'livro': 'livro.m4a',
  'remédio': 'remedio.m4a',
  'vestir': 'vestir.m4a',
  'roupa': 'roupa.m4a',
  'banho': 'banho.m4a',
  'comida': 'comida.m4a'
};

const BASE_CONHECIMENTO_EDUCACIONAL = [
  {
    modulo: "Necessidades Básicas",
    pergunta: "Como expressar o desejo de beber água?",
    alvo: ['eu', 'quero', 'água'],
    bancoOpcoes: ['eu', 'quero', 'água', 'não', 'ajuda', 'feliz']
  },
  {
    modulo: "Necessidades Básicas",
    pergunta: "Como pedir comida quando estiver com fome?",
    alvo: ['eu', 'quero', 'comer'],
    bancoOpcoes: ['eu', 'quero', 'comer', 'beber', 'não', 'brincar']
  },
  {
    modulo: "Necessidades Básicas",
    pergunta: "Como pedir para ir ao banheiro?",
    alvo: ['eu', 'preciso', 'ir', 'ao', 'banheiro'],
    bancoOpcoes: ['eu', 'preciso', 'ir', 'ao', 'banheiro', 'água', 'dormir', 'ajuda']
  },
  {
    modulo: "Autonomia e Higiene",
    pergunta: "Qual a sequência lógica para a higiene pessoal?",
    alvo: ['primeiro', 'tomar-banho', 'depois', 'escovar-os-dentes'],
    bancoOpcoes: ['primeiro', 'tomar-banho', 'depois', 'escovar-os-dentes', 'brincar', 'dormir']
  },
  {
    modulo: "Autonomia e Higiene",
    pergunta: "O que fazer depois de ir ao banheiro?",
    alvo: ['lavar', 'as', 'mãos'],
    bancoOpcoes: ['lavar', 'as', 'mãos', 'comer', 'brincar', 'dormir']
  },
  {
    modulo: "Autonomia e Higiene",
    pergunta: "Como pedir ajuda para escovar os dentes?",
    alvo: ['preciso', 'de', 'ajuda', 'para', 'escovar', 'os', 'dentes'],
    bancoOpcoes: ['preciso', 'de', 'ajuda', 'para', 'escovar', 'os', 'dentes', 'banho', 'não']
  },
  {
    modulo: "Regulação Sensorial",
    pergunta: "Como comunicar desconforto auditivo por barulho intenso?",
    alvo: ['está', 'com', 'muito', 'barulho'],
    bancoOpcoes: ['está', 'com', 'muito', 'barulho', 'calma', 'feliz', 'frio']
  },
  {
    modulo: "Regulação Sensorial",
    pergunta: "Como pedir para diminuir a luz?",
    alvo: ['a', 'luz', 'está', 'muito', 'forte'],
    bancoOpcoes: ['a', 'luz', 'está', 'muito', 'forte', 'barulho', 'calma']
  },
  {
    modulo: "Regulação Sensorial",
    pergunta: "Como pedir um momento de calma?",
    alvo: ['eu', 'preciso', 'de', 'calma'],
    bancoOpcoes: ['eu', 'preciso', 'de', 'calma', 'brincar', 'ajuda', 'barulho']
  },
  {
    modulo: "Convivência Inclusiva",
    pergunta: "Como solicitar suporte adequado em sala de aula?",
    alvo: ['professora', 'eu', 'preciso', 'de', 'ajuda'],
    bancoOpcoes: ['professora', 'eu', 'preciso', 'de', 'ajuda', 'colega', 'brincar']
  },
  {
    modulo: "Convivência Inclusiva",
    pergunta: "Como pedir para brincar com um colega?",
    alvo: ['eu', 'quero', 'brincar', 'contigo'],
    bancoOpcoes: ['eu', 'quero', 'brincar', 'contigo', 'não', 'ajuda', 'dormir']
  },
  {
    modulo: "Convivência Inclusiva",
    pergunta: "Como agradecer alguém que ajudou?",
    alvo: ['obrigado', 'pela', 'ajuda'],
    bancoOpcoes: ['obrigado', 'pela', 'ajuda', 'não', 'triste', 'bravo']
  },
  {
    modulo: "Inteligência Emocional",
    pergunta: "Como manifestar um estado de espírito feliz?",
    alvo: ['eu', 'estou', 'feliz'],
    bancoOpcoes: ['eu', 'estou', 'feliz', 'triste', 'bravo', 'cansado']
  },
  {
    modulo: "Inteligência Emocional",
    pergunta: "Como dizer que está triste?",
    alvo: ['eu', 'estou', 'triste'],
    bancoOpcoes: ['eu', 'estou', 'triste', 'feliz', 'bravo', 'cansado']
  },
  {
    modulo: "Inteligência Emocional",
    pergunta: "Como expressar que está com raiva?",
    alvo: ['eu', 'estou', 'bravo'],
    bancoOpcoes: ['eu', 'estou', 'bravo', 'feliz', 'triste', 'cansado']
  },
  {
    modulo: "Inteligência Emocional",
    pergunta: "Como dizer que está cansado?",
    alvo: ['eu', 'estou', 'cansado'],
    bancoOpcoes: ['eu', 'estou', 'cansado', 'feliz', 'triste', 'bravo']
  },
  {
    modulo: "Termorregulação",
    pergunta: "O que sinalizar quando estiver sentindo baixa temperatura?",
    alvo: ['eu', 'estou', 'com', 'frio'],
    bancoOpcoes: ['eu', 'estou', 'com', 'frio', 'calor', 'água', 'remédio']
  },
  {
    modulo: "Termorregulação",
    pergunta: "Como dizer que está com calor?",
    alvo: ['eu', 'estou', 'com', 'calor'],
    bancoOpcoes: ['eu', 'estou', 'com', 'calor', 'frio', 'água', 'ajuda']
  },
  {
    modulo: "Vida Diária",
    pergunta: "Como pedir para abrir a janela?",
    alvo: ['pode', 'abrir', 'a', 'janela'],
    bancoOpcoes: ['pode', 'abrir', 'a', 'janela', 'fechar', 'porta', 'ajuda']
  },
  {
    modulo: "Vida Diária",
    pergunta: "Como pedir para fechar a porta?",
    alvo: ['pode', 'fechar', 'a', 'porta'],
    bancoOpcoes: ['pode', 'fechar', 'a', 'porta', 'abrir', 'janela', 'ajuda']
  },
  {
    modulo: "Vida Diária",
    pergunta: "Como pedir um livro?",
    alvo: ['eu', 'quero', 'um', 'livro'],
    bancoOpcoes: ['eu', 'quero', 'um', 'livro', 'brincar', 'água', 'ajuda']
  },
  {
    modulo: "Vida Diária",
    pergunta: "Como dizer que precisa de remédio?",
    alvo: ['eu', 'preciso', 'de', 'remédio'],
    bancoOpcoes: ['eu', 'preciso', 'de', 'remédio', 'água', 'comida', 'ajuda']
  },
  {
    modulo: "Vida Diária",
    pergunta: "Como pedir para dormir?",
    alvo: ['eu', 'quero', 'dormir'],
    bancoOpcoes: ['eu', 'quero', 'dormir', 'brincar', 'comer', 'ajuda']
  },
  {
    modulo: "Vida Diária",
    pergunta: "Como pedir ajuda para vestir a roupa?",
    alvo: ['preciso', 'de', 'ajuda', 'para', 'vestir', 'a', 'roupa'],
    bancoOpcoes: ['preciso', 'de', 'ajuda', 'para', 'vestir', 'a', 'roupa', 'banho', 'comer']
  }
];

function embaralhar(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function engineCognitivaIA(indiceAtual) {
  const total = BASE_CONHECIMENTO_EDUCACIONAL.length;
  const moduloAtivo = BASE_CONHECIMENTO_EDUCACIONAL[indiceAtual % total];

  const opcoesCompletas = Array.from(new Set([
    ...moduloAtivo.alvo,
    ...moduloAtivo.bancoOpcoes
  ]));

  const opcoesEmbaralhadas = embaralhar(opcoesCompletas);

  return {
    id: indiceAtual + 1,
    axis: moduloAtivo.modulo,
    prompt: moduloAtivo.pergunta,
    target: moduloAtivo.alvo,
    options: opcoesEmbaralhadas
  };
}

export default function CognitiveChallenge({ onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [missaoIA, setMissaoIA] = useState(engineCognitivaIA(0));
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [pontuacao, setPontuacao] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  useEffect(() => {
    setMissaoIA(engineCognitivaIA(currentStep));
  }, [currentStep]);

  const handleTokenSelect = (tokenKey) => {
    if (selectedTokens.includes(tokenKey) || feedback || bloqueado) return;

    const atualizado = [...selectedTokens, tokenKey];
    setSelectedTokens(atualizado);

    const arquivoAudio = MAPA_AUDIO_TOKENS[tokenKey.toLowerCase()] || null;

    emitirVoz(arquivoAudio, tokenKey.replace(/-/g, ' '), () => {
      if (atualizado.length < missaoIA.target.length) return;

      setBloqueado(true);

      const isCorrect = atualizado.every(
        (val, index) => val === missaoIA.target[index]
      );

      setTimeout(() => {
        if (isCorrect) {
          setPontuacao(prev => prev + 100);
          setFeedback({
            success: true,
            message: 'Excelente! Frase montada com sucesso!'
          });

          emitirVoz('acerto_suave.m4a', 'Muito bem!');

          setTimeout(() => {
            if (currentStep < BASE_CONHECIMENTO_EDUCACIONAL.length - 1) {
              setCurrentStep(prev => prev + 1);
              setSelectedTokens([]);
              setFeedback(null);
              setBloqueado(false);
            } else {
              setFeedback({
                success: true,
                message: 'Parabéns! Você concluiu a trilha com sucesso!'
              });
              emitirVoz('parabens_final.m4a', 'Parabéns!');
              if (onComplete) onComplete();
            }
          }, 2400);
        } else {
          setFeedback({
            success: false,
            message: 'Quase! A ordem das palavras não está correta. Vamos tentar de novo com calma?'
          });

          setTimeout(() => {
            setSelectedTokens([]);
            setFeedback(null);
            setBloqueado(false);
          }, 2400);
        }
      }, 800);
    });
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-box"
        style={{
          maxWidth: '780px',
          textAlign: 'center',
          background: '#090d16',
          border: '2px solid #38bdf8'
        }}
      >
        <div
          className="modal-header"
          style={{
            borderBottom: '1px solid #1e293b',
            paddingBottom: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <span
              style={{
                color: '#38bdf8',
                fontSize: '0.78rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              IA Pedagógica TEA • {missaoIA.axis}
            </span>
            <h2 style={{ color: '#f8fafc', fontSize: '1.25rem', margin: '4px 0 0 0' }}>
              🧠 VozAtiva Pro – Alfabetização Guiada
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                background: '#0284c7',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 'bold'
              }}
            >
              ⭐ {pontuacao} pts
            </span>
            <button
              className="modal-close"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '1.6rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
          </div>
        </div>

        <div style={{ margin: '22px 0' }}>
          <span
            style={{
              background: '#1e293b',
              color: '#38bdf8',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 900,
              fontSize: '0.85rem'
            }}
          >
            Missão {currentStep + 1} de {BASE_CONHECIMENTO_EDUCACIONAL.length}
          </span>
          <h3
            style={{
              fontSize: '1.35rem',
              margin: '16px 0 8px 0',
              color: '#ffffff',
              fontWeight: 800
            }}
          >
            {missaoIA.prompt}
          </h3>
        </div>

        <div
          style={{
            background: '#0f172a',
            border: '2px dashed #334155',
            borderRadius: '16px',
            minHeight: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}
        >
          {selectedTokens.length === 0 ? (
            <span style={{ color: '#64748b', fontWeight: 700, fontSize: '0.95rem' }}>
              Toque nos cartões na ordem correta para formar a frase...
            </span>
          ) : (
            selectedTokens.map((t, idx) => (
              <div
                key={idx}
                style={{
                  background: '#38bdf8',
                  color: '#0f172a',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: 950,
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(56, 189, 248, 0.4)'
                }}
              >
                {t.toUpperCase().replace(/-/g, ' ')}
              </div>
            ))
          )}
        </div>

        {feedback && (
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              marginBottom: '18px',
              fontWeight: 900,
              fontSize: '0.95rem',
              background: feedback.success
                ? 'rgba(22, 163, 74, 0.2)'
                : 'rgba(239, 68, 68, 0.2)',
              color: feedback.success ? '#4ade80' : '#ef4444',
              border: `1px solid ${feedback.success ? '#16a34a' : '#ef4444'}`
            }}
          >
            {feedback.message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {missaoIA.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleTokenSelect(opt)}
              disabled={selectedTokens.includes(opt) || !!feedback || bloqueado}
              style={{
                background: selectedTokens.includes(opt) ? '#0f172a' : '#1e293b',
                color: selectedTokens.includes(opt) ? '#64748b' : '#ffffff',
                border: '2px solid #334155',
                padding: '16px 10px',
                borderRadius: '14px',
                fontWeight: 900,
                fontSize: '0.95rem',
                cursor: selectedTokens.includes(opt) || feedback || bloqueado ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease',
                opacity: selectedTokens.includes(opt) ? 0.5 : 1
              }}
            >
              {opt.replace(/-/g, ' ')}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setSelectedTokens([]);
            setFeedback(null);
            setBloqueado(false);
          }}
          style={{
            marginTop: '22px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontWeight: 800,
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          🔄 Limpar Tentativa Atual
        </button>
      </div>
    </div>
  );
}