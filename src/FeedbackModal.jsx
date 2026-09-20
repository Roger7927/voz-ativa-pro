import React from 'react';

export const FeedbackModal = ({ isOpen, onClose, formUrl }) => {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>Avaliação da Aplicação</h3>
          <button onClick={onClose} style={closeButtonStyle}>
            &times;
          </button>
        </div>
        <div style={bodyStyle}>
          <iframe
            src={formUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Feedback"
          >
            A carregar...
          </iframe>
        </div>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10000,
  padding: '16px',
};

const modalStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '600px',
  height: '80vh',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
  overflow: 'hidden',
};

const headerStyle = {
  padding: '12px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #e2e8f0',
};

const closeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '22px',
  cursor: 'pointer',
  color: '#64748b',
};

const bodyStyle = {
  flex: 1,
  width: '100%',
  height: '100%',
};