// (c) 2026 Guillermo Roger Hernandez Chandia - ADS
import { useState } from 'react';
import { emitirVoz } from './audioEngine';

const ITENS_EMERGENCIA = [
  { texto: 'Banheiro', audio: 'banheiro.m4a', icone: '🚽', cor: '#0284c7' },
  { texto: 'Água', audio: 'agua.m4a', icone: '💧', cor: '#0ea5e9' },
  { texto: 'Dor', audio: 'dor.m4a', icone: '🩹', cor: '#ef4444' },
  { texto: 'Parar', audio: 'parar.m4a', icone: '🛑', cor: '#f59e0b' }
];

export default function BarraEmergencia() {
  const [aberto, setAberto] = useState(false);

  const acionarItem = (item) => {
    emitirVoz(item.audio, item.texto);
    setAberto(false);
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', left: '20px', zIndex: 10000 }}>
      {aberto && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '14px',
          background: '#0f172a',
          padding: '14px',
          borderRadius: '20px',
          border: '2px solid #38bdf8',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7)'
        }}>
          {ITENS_EMERGENCIA.map((item) => (
            <button
              key={item.texto}
              type="button"
              onClick={() => acionarItem(item)}
              style={{
                background: item.cor,
                color: '#ffffff',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 18px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                touchAction: 'manipulation'
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{item.icone}</span>
              {item.texto}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: aberto ? '#ef4444' : '#0284c7',
          color: '#ffffff',
          border: '3px solid #ffffff',
          fontSize: '1.8rem',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Ajuda Rápida e Necessidades Urgentes"
      >
        {aberto ? '✖' : '🆘'}
      </button>
    </div>
  );
}
