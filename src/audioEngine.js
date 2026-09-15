// (c) 2026 Guillermo Roger Hernandez Chandia - ADS
export const emitirVoz = (nomeArquivo, texto, aoFinalizar = null) => {
  if (!texto && !nomeArquivo) {
    if (aoFinalizar) aoFinalizar();
    return;
  }

  if (nomeArquivo) {
    const audio = new Audio(`/audios/${nomeArquivo}`);
    audio.onended = () => { if (aoFinalizar) aoFinalizar(); };
    const p = audio.play();
    if (p !== undefined) {
      p.catch(() => {
        executarSintese(texto, aoFinalizar);
      });
      return;
    }
  }

  executarSintese(texto, aoFinalizar);
};

const executarSintese = (texto, callback) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = 'pt-BR';
    u.rate = 0.92;
    u.onend = () => { if (callback) callback(); };
    u.onerror = () => { if (callback) callback(); };
    window.speechSynthesis.speak(u);
  } else if (callback) {
    callback();
  }
};