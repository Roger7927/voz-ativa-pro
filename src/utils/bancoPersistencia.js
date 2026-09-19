// (c) 2026 Guillermo Roger Hernandez Chandia - ADS

const NOME_BANCO = 'VozAtivaCAA_DB';
const VERSAO_BANCO = 1;
const STORE_PALAVRAS = 'palavras_customizadas';

export const abrirBanco = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(NOME_BANCO, VERSAO_BANCO);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_PALAVRAS)) {
        db.createObjectStore(STORE_PALAVRAS, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const salvarPalavraComAudio = async (item) => {
  const db = await abrirBanco();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PALAVRAS, 'readwrite');
    const store = tx.objectStore(STORE_PALAVRAS);
    store.put(item);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
};

export const listarPalavrasComAudio = async () => {
  const db = await abrirBanco();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_PALAVRAS, 'readonly');
    const store = tx.objectStore(STORE_PALAVRAS);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
};
