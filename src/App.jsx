// (c) 2026 Guillermo Roger Hernandez Chandia - ADS
import { useState, useEffect, useRef } from 'react';
import localforage from 'localforage';
import JogoEmocoes from './JogoEmocoes';
import JogoMemoria from './JogoMemoria';
import JogoRotina from './JogoRotina';
import JogoFrases from './JogoFrases';
import JogoFuncional from './JogoFuncional';
import JogoAlfabetizacao from './JogoAlfabetizacao';
import CognitiveChallenge from './CognitiveChallenge';
import './index.css';

const MAPA_IMAGENS = {
  "Água": "agua.png", "Comer": "comer.png", "Banheiro": "banheiro.png", "Dor": "dor.png",
  "Escovar os Dentes": "escovar-dentes.png", "Tomar Banho": "tomar-banho.png", "Lavar as Mãos": "lavar-maos.png",
  "Dor de Cabeça": "dor-cabeca.png", "Dor de Barriga": "dor-barriga.png",
  "Dor de Garganta": "dor-garganta.png", "Remédio": "remedio.png", "Ajuda": "ajuda.png",
  "Frio": "frio.png", "Calor": "calor.png", "Eu": "eu.png", "Sim": "sim.png", "Não": "nao.png",
  "Brincar": "brincar.png", "Parar": "parar.png", "Dormir": "dormir.png", "Passear": "passear.png",
  "Esperar": "esperar.png", "Feliz": "feliz.png", "Triste": "triste.png", "Bravo": "bravo.png",
  "Cansado": "cansado.png", "Barulho": "barulho.png", "Medo": "medo.png", "Calma": "calma.png",
  "Gostei Muito": "gostei-muito.png", "Professora": "professora.png", "Colega": "colega.png",
  "Mamãe": "mamae.png", "Papai": "papai.png", "Você": "voce.png", "Vovó": "vovo-f.png",
  "Vovô": "vovo-m.png", "Irmão": "irmao.png", "Irmã": "irma.png",
  "Terapeuta": "terapeuta.png", "Cuidador": "cuidador.png", "Cuidadora": "cuidadora.png", "Médico": "medico.png",
  "Leite": "leite.png", "Maçã": "maca.png", "Banana": "banana.png", "Bolacha": "bolacha.png",
  "Pão": "pao.png", "Arroz e Feijão": "arroz-feijao.png", "Carne": "carne.png", "Bolo": "bolo.png",
  "Suco": "suco.png", "Iogurte": "iogurte.png", "Chocolate": "chocolate.png", "Pizza": "pizza.png",
  "Desenhar": "desenhar.png", "Ver Livro": "livro.png"
};

const VARIACOES_DISPONIVEIS = {
  "Eu": [
    { label: "Menino Claro", img: "eu.png" },
    { label: "Menino Escuro", img: "eu_dark.png" },
    { label: "Menina Clara", img: "eu-menina.png" },
    { label: "Menina Escura", img: "eu-menina-dark.png" }
  ],
  "Escovar os Dentes": [
    { label: "Menino Claro", img: "escovar-dentes.png" },
    { label: "Menino Escuro", img: "escovar-dentes-dark.png" },
    { label: "Menina Clara", img: "escovar-dentes-menina.png" },
    { label: "Menina Escura", img: "escovar-dentes-menina-dark.png" }
  ],
  "Tomar Banho": [
    { label: "Menino Claro", img: "tomar-banho.png" },
    { label: "Menino Escuro", img: "tomar-banho-dark.png" },
    { label: "Menina Clara", img: "tomar-banho-menina.png" },
    { label: "Menina Escura", img: "tomar-banho-menina-dark.png" }
  ],
  "Lavar as Mãos": [
    { label: "Menino Claro", img: "lavar-maos.png" },
    { label: "Menino Escuro", img: "lavar-maos-dark.png" },
    { label: "Menina Clara", img: "lavar-maos-menina.png" },
    { label: "Menina Escura", img: "lavar-maos-menina-dark.png" }
  ],
  "Ajuda": [
    { label: "Menino Claro", img: "ajuda.png" },
    { label: "Menino Escuro", img: "ajuda-dark.png" },
    { label: "Menina Clara", img: "ajuda-menina.png" },
    { label: "Menina Escura", img: "ajuda-menina-dark.png" }
  ],
  "Dor de Cabeça": [
    { label: "Menino Claro", img: "dor-cabeca.png" },
    { label: "Menino Escuro", img: "dor-cabeca-dark.png" },
    { label: "Menina Clara", img: "dor-cabeca-menina.png" },
    { label: "Menina Escura", img: "dor-cabeca-menina-dark.png" }
  ],
  "Dor de Barriga": [
    { label: "Menino Claro", img: "dor-barriga.png" },
    { label: "Menino Escuro", img: "dor-barriga-dark.png" },
    { label: "Menina Clara", img: "dor-barriga-menina.png" },
    { label: "Menina Escura", img: "dor-barriga-menina-dark.png" }
  ],
  "Barulho": [
    { label: "Menino Claro", img: "barulho.png" },
    { label: "Menino Escuro", img: "barulho-dark.png" },
    { label: "Menina Clara", img: "barulho-menina.png" },
    { label: "Menina Escura", img: "barulho-menina-dark.png" }
  ],
  "Dor de Garganta": [
    { label: "Menino Claro", img: "dor-garganta.png" },
    { label: "Menino Escuro", img: "dor-garganta-dark.png" },
    { label: "Menina Clara", img: "dor-garganta-menina.png" },
    { label: "Menina Escura", img: "dor-garganta-menina-dark.png" }
  ],
  "Gostei Muito": [
    { label: "Menino Claro", img: "gostei-muito.png" },
    { label: "Menino Escuro", img: "gostei-muito-dark.png" },
    { label: "Menina Clara", img: "gostei-muito-menina.png" },
    { label: "Menina Escura", img: "gostei-muito-menina-dark.png" }
  ],
  "Frio": [
    { label: "Menino Claro", img: "frio.png" },
    { label: "Menino Escuro", img: "frio-dark.png" },
    { label: "Menina Clara", img: "frio-menina.png" },
    { label: "Menina Escura", img: "frio-menina-dark.png" }
  ],
  "Calor": [
    { label: "Menino Claro", img: "calor.png" },
    { label: "Menino Escuro", img: "calor-dark.png" },
    { label: "Menina Clara", img: "calor-menina.png" },
    { label: "Menina Escura", img: "calor-menina-dark.png" }
  ],
  "Cansado": [
    { label: "Menino Claro", img: "cansado.png" },
    { label: "Menino Escuro", img: "cansado-dark.png" },
    { label: "Menina Clara", img: "cansado-menina.png" },
    { label: "Menina Escura", img: "cansado-menina-dark.png" }
  ],
  "Medo": [
    { label: "Menino Claro", img: "medo.png" },
    { label: "Menino Escuro", img: "medo-dark.png" },
    { label: "Menina Clara", img: "medo-menina.png" },
    { label: "Menina Escura", img: "medo-menina-dark.png" }
  ],
  "Feliz": [
    { label: "Menino Claro", img: "feliz.png" },
    { label: "Menino Escuro", img: "feliz-dark.png" },
    { label: "Menina Clara", img: "feliz-menina.png" },
    { label: "Menina Escura", img: "feliz-menina-dark.png" }
  ],
  "Triste": [
    { label: "Menino Claro", img: "triste.png" },
    { label: "Menino Escuro", img: "triste-dark.png" },
    { label: "Menina Clara", img: "triste-menina.png" },
    { label: "Menina Escura", img: "triste-menina-dark.png" }
  ],
  "Bravo": [
    { label: "Menino Claro", img: "bravo.png" },
    { label: "Menino Escuro", img: "bravo-dark.png" },
    { label: "Menina Clara", img: "bravo-menina.png" },
    { label: "Menina Escura", img: "bravo-menina-dark.png" }
  ],
  "Comer": [
    { label: "Menino Claro", img: "comer.png" },
    { label: "Menino Escuro", img: "comer-dark.png" },
    { label: "Menina Clara", img: "comer-f.png" },
    { label: "Menina Escura", img: "comer-f-dark.png" }
  ],
  "Esperar": [
    { label: "Menino Claro", img: "esperar.png" },
    { label: "Menino Escuro", img: "esperar-dark.png" },
    { label: "Menina Clara", img: "esperar-menina.png" },
    { label: "Menina Escura", img: "esperar-menina-dark.png" }
  ],
  "Passear": [
    { label: "Menino Claro", img: "passear.png" },
    { label: "Menino Escuro", img: "passear-dark.png" },
    { label: "Meninas Claras", img: "passear-menina.png" },
    { label: "Meninas Escuras", img: "passear-menina-dark.png" }
  ],
  "Calma": [
    { label: "Menino Claro", img: "calma.png" },
    { label: "Menino Escuro", img: "calma-dark.png" },
    { label: "Menina Clara", img: "calma-menina.png" },
    { label: "Menina Escura", img: "calma-menina-dark.png" }
  ],
  "Colega": [
    { label: "Amigo Claro", img: "colega.png" },
    { label: "Amigo Escuro", img: "colega-dark.png" },
    { label: "Amigas Claras", img: "colega-menina.png" },
    { label: "Amigas Escuras", img: "colega-menina-dark.png" }
  ],
  "Mamãe": [
    { label: "Padrão", img: "mamae.png" },
    { label: "Representativo", img: "mamae-dark.png" }
  ],
  "Papai": [
    { label: "Padrão", img: "papai.png" },
    { label: "Representativo", img: "papai-dark.png" }
  ],
  "Irmão": [
    { label: "Padrão", img: "irmao.png" },
    { label: "Representativo", img: "irmao-dark.png" }
  ],
  "Irmã": [
    { label: "Padrão", img: "irma.png" },
    { label: "Representativo", img: "irma-dark.png" }
  ],
  "Vovô": [
    { label: "Padrão", img: "vovo-m.png" },
    { label: "Representativo", img: "vovo-m-dark.png" }
  ],
  "Vovó": [
    { label: "Padrão", img: "vovo-f.png" },
    { label: "Representativo", img: "vovo-f-dark.png" }
  ],
  "Professora": [
    { label: "Padrão", img: "professora.png" },
    { label: "Representativo", img: "professora-dark.png" }
  ],
  "Terapeuta": [
    { label: "Padrão", img: "terapeuta.png" },
    { label: "Representativo", img: "terapeuta-dark.png" },
    { label: "Terapeuta Homem", img: "terapeuta-homem.png" },
    { label: "Terapeuta H. Dark", img: "terapeuta-homem-dark.png" }
  ],
  "Médico": [
    { label: "Padrão", img: "medico.png" },
    { label: "Representativo", img: "medico-dark.png" },
    { label: "Médica", img: "medica.png" },
    { label: "Médica Dark", img: "medica-dark.png" }
  ],
  "Cuidador": [
    { label: "Padrão", img: "cuidador.png" },
    { label: "Representativo", img: "cuidador-dark.png" }
  ],
  "Cuidadora": [
    { label: "Padrão", img: "cuidadora.png" },
    { label: "Representativo", img: "cuidadora-dark.png" }
  ]
};

localforage.config({
  name: 'VozAtivaPro',
  storeName: 'aac_dados_v18'
});

const ICONES_BASE = {
  agua: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
    </svg>
  ),
  comer: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2v20M2 12h8a4 4 0 0 0 4-4V2H6a4 4 0 0 0-4 4v6z"/>
    </svg>
  ),
  banheiro: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 12h10M9 12v6a4 4 0 0 0 6 0v-6M5 7h14a2 2 0 0 1 2 2v3H3V9a2 2 0 0 1 2-2z"/>
    </svg>
  ),
  dor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2l6 6L8 20l-6-6L14 2zM10 6l8 8"/>
    </svg>
  ),
  remedio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="8" rx="4"/>
      <path d="M12 8v8"/>
    </svg>
  ),
  ajuda: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>
    </svg>
  ),
  frio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/>
    </svg>
  ),
  calor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  cross: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  stop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
    </svg>
  ),
  sleep: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>
    </svg>
  ),
  walk: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7 21l3-7 2 3v5M17 21l-2-8-3-2 3-4 4 3"/>
    </svg>
  ),
  wait: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  happy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
    </svg>
  ),
  sad: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/>
    </svg>
  ),
  bravo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M16 16s-1.5-2-4-2-4 2-4 2M7.5 8l3 2M16.5 8l-3 2"/>
    </svg>
  ),
  fear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <circle cx="9" cy="9" r="1.5"/>
      <circle cx="15" cy="9" r="1.5"/>
      <ellipse cx="12" cy="16" rx="3" ry="2"/>
    </svg>
  ),
  ear: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0"/>
      <path d="M15 8.5a2.5 2.5 0 0 0-5 0v2"/>
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  teacher: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  ),
  friend: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  mother: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M6 21v-2a6 6 0 0 1 12 0v2"/>
      <path d="M8 7c0-2 1.5-4 4-4s4 2 4 4"/>
    </svg>
  ),
  father: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M6 21v-2a6 6 0 0 1 12 0v2"/>
      <path d="M9 11h6"/>
    </svg>
  )
};

const DADOS_COMPLETOS = [
  // 1. Necessidades Fisiológicas
  { id: 'b1', texto: 'Água', chaveSvg: 'agua', cat: 'necessidades', cor: 'c-object', audio: 'agua.m4a' },
  { id: 'b2', texto: 'Comer', chaveSvg: 'comer', cat: 'necessidades', cor: 'c-action', audio: 'comer.m4a' },
  { id: 'b3', texto: 'Banheiro', chaveSvg: 'banheiro', cat: 'necessidades', cor: 'c-object', audio: 'banheiro.m4a' },
  { id: 'b12', texto: 'Escovar os Dentes', chaveSvg: 'agua', cat: 'necessidades', cor: 'c-action', audio: 'escovar_os_dentes.m4a' },
  { id: 'b13', texto: 'Tomar Banho', chaveSvg: 'agua', cat: 'necessidades', cor: 'c-action', audio: 'tomar_banho.m4a' },
  { id: 'b14', texto: 'Lavar as Mãos', chaveSvg: 'agua', cat: 'necessidades', cor: 'c-action', audio: 'lavar_as_maos.m4a' },
  { id: 'b4', texto: 'Dor', chaveSvg: 'dor', cat: 'necessidades', cor: 'c-feeling', audio: 'dor.m4a' },
  { id: 'b10', texto: 'Dor de Cabeça', chaveSvg: 'dor', cat: 'necessidades', cor: 'c-feeling', audio: 'dor_de_cabeca.m4a' },
  { id: 'b11', texto: 'Dor de Barriga', chaveSvg: 'dor', cat: 'necessidades', cor: 'c-feeling', audio: 'dor_de_barriga.m4a' },
  { id: 'b9', texto: 'Dor de Garganta', chaveSvg: 'dor', cat: 'necessidades', cor: 'c-feeling', audio: 'dor_de_garganta.m4a' },
  { id: 'b5', texto: 'Remédio', chaveSvg: 'remedio', cat: 'necessidades', cor: 'c-object', audio: 'remedio.m4a' },
  { id: 'b6', texto: 'Ajuda', chaveSvg: 'ajuda', cat: 'necessidades', cor: 'c-social', audio: 'ajuda.m4a' },
  { id: 'b7', texto: 'Frio', chaveSvg: 'frio', cat: 'necessidades', cor: 'c-feeling', audio: 'estou_com_frio.m4a' },
  { id: 'b8', texto: 'Calor', chaveSvg: 'calor', cat: 'necessidades', cor: 'c-feeling', audio: 'estou_com_calor.m4a' },
  { id: 'b15', texto: 'Desenhar', chaveSvg: 'play', cat: 'necessidades', cor: 'c-action', audio: 'desenhar.m4a' },
  { id: 'b16', texto: 'Ver Livro', chaveSvg: 'play', cat: 'necessidades', cor: 'c-action', audio: 'ver_livro.m4a' },

  // 2. Categoria: Alimentação
  { id: 'al_leite', texto: 'Leite', chaveSvg: 'agua', cat: 'alimentacao', cor: 'c-object', audio: 'leite.m4a' },
  { id: 'al_maca', texto: 'Maçã', chaveSvg: 'comer', cat: 'alimentacao', cor: 'c-object', audio: 'maca.m4a' },
  { id: 'al_banana', texto: 'Banana', chaveSvg: 'comer', cat: 'alimentacao', cor: 'c-object', audio: 'banana.m4a' },
  { id: 'al_bolacha', texto: 'Bolacha', chaveSvg: 'comer', cat: 'alimentacao', cor: 'c-object', audio: 'bolacha.m4a' },
  { id: 'al_pao', texto: 'Pão', chaveSvg: 'comer', cat: 'alimentacao', cor: 'c-object', audio: 'pao.m4a' },
  { id: 'al_arroz_feijao', texto: 'Arroz e Feijão', chaveSvg: 'comer', cat: 'alimentacao', cor: 'c-object', audio: 'arroz-feijao.m4a' },
  { id: 'al_carne', texto: 'Carne', chaveSvg: 'comer', cat: 'alimentacao', cor: 'c-object', audio: 'carne.m4a' },
  { id: 'al_bolo', texto: 'Bolo', chaveSvg: 'comer', cat: 'alimentacao', cor: 'c-object', audio: 'bolo.m4a' },
  { id: 'al_suco', texto: 'Suco', chaveSvg: 'agua', cat: 'alimentacao', cor: 'c-object', audio: 'suco.m4a' },
  { id: 'al_iogurte', texto: 'Iogurte', chaveSvg: 'comer', cat: 'alimentacao', cor: 'c-object', audio: 'iogurte.m4a' },
  { id: 'al_chocolate', texto: 'Chocolate', chaveSvg: 'comer', cat: 'alimentacao', cor: 'c-object', audio: 'chocolate.m4a' },
  { id: 'al_pizza', texto: 'Pizza', chaveSvg: 'comer', cat: 'alimentacao', cor: 'c-object', audio: 'pizza.m4a' },

  // 3. Ações
  { id: 'a1', texto: 'Eu', chaveSvg: 'user', cat: 'acoes', cor: 'c-people', audio: 'Eu.m4a' },
  { id: 'a2', texto: 'Sim', chaveSvg: 'check', cat: 'acoes', cor: 'c-social', audio: 'sim.m4a' },
  { id: 'a3', texto: 'Não', chaveSvg: 'cross', cat: 'acoes', cor: 'c-social', audio: 'nao.m4a' },
  { id: 'a4', texto: 'Brincar', chaveSvg: 'play', cat: 'acoes', cor: 'c-action', audio: 'brincar.m4a' },
  { id: 'a5', texto: 'Parar', chaveSvg: 'stop', cat: 'acoes', cor: 'c-action', audio: 'parar.m4a' },
  { id: 'a6', texto: 'Dormir', chaveSvg: 'sleep', cat: 'acoes', cor: 'c-action', audio: 'quero_dormir.m4a' },
  { id: 'a7', texto: 'Passear', chaveSvg: 'walk', cat: 'acoes', cor: 'c-action', audio: 'quero_passear.m4a' },
  { id: 'a8', texto: 'Esperar', chaveSvg: 'wait', cat: 'acoes', cor: 'c-action', audio: 'esperar_um_pouco.m4a' },

  // 4. Sentimentos
  { id: 's1', texto: 'Feliz', chaveSvg: 'happy', cat: 'sentimentos', cor: 'c-feeling', audio: 'feliz.m4a' },
  { id: 's2', texto: 'Triste', chaveSvg: 'sad', cat: 'sentimentos', cor: 'c-feeling', audio: 'triste.m4a' },
  { id: 's3', texto: 'Bravo', chaveSvg: 'bravo', cat: 'sentimentos', cor: 'c-feeling', audio: 'bravo.m4a' },
  { id: 's4', texto: 'Cansado', chaveSvg: 'sleep', cat: 'sentimentos', cor: 'c-feeling', audio: 'cansado.m4a' },
  { id: 's5', texto: 'Barulho', chaveSvg: 'ear', cat: 'sentimentos', cor: 'c-feeling', audio: 'barulho.m4a' },
  { id: 's6', texto: 'Medo', chaveSvg: 'fear', cat: 'sentimentos', cor: 'c-feeling', audio: 'estou_com_medo.m4a' },
  { id: 's7', texto: 'Calma', chaveSvg: 'happy', cat: 'sentimentos', cor: 'c-feeling', audio: 'calma.m4a' },
  { id: 's8', texto: 'Gostei Muito', chaveSvg: 'heart', cat: 'sentimentos', cor: 'c-social', audio: 'gostei_muito.m4a' },

  // 5. Pessoas
  { id: 'p1', texto: 'Professora', chaveSvg: 'teacher', cat: 'pessoas', cor: 'c-people', audio: 'Professora.m4a' },
  { id: 'p2', texto: 'Colega', chaveSvg: 'friend', cat: 'pessoas', cor: 'c-people', audio: 'Colega.m4a' },
  { id: 'p3', texto: 'Mamãe', chaveSvg: 'mother', cat: 'pessoas', cor: 'c-people', audio: 'Mamãe.m4a' },
  { id: 'p4', texto: 'Papai', chaveSvg: 'father', cat: 'pessoas', cor: 'c-people', audio: 'Papai.m4a' },
  { id: 'p5', texto: 'Você', chaveSvg: 'user', cat: 'pessoas', cor: 'c-people', audio: 'Você.m4a' },
  { id: 'p6', texto: 'Vovó', chaveSvg: 'mother', cat: 'pessoas', cor: 'c-people', audio: 'vovo.m4a' },
  { id: 'p7', texto: 'Vovô', chaveSvg: 'father', cat: 'pessoas', cor: 'c-people', audio: 'vovo_m.m4a' },
  { id: 'p8', texto: 'Irmão', chaveSvg: 'user', cat: 'pessoas', cor: 'c-people', audio: 'irmao.m4a' },
  { id: 'p9', texto: 'Irmã', chaveSvg: 'user', cat: 'pessoas', cor: 'c-people', audio: 'irma.m4a' },
  { id: 'p10', texto: 'Terapeuta', chaveSvg: 'teacher', cat: 'pessoas', cor: 'c-people', audio: 'terapeuta.m4a' },
  { id: 'p11', texto: 'Cuidador', chaveSvg: 'user', cat: 'pessoas', cor: 'c-people', audio: 'cuidador.m4a' },
  { id: 'p13', texto: 'Cuidadora', chaveSvg: 'user', cat: 'pessoas', cor: 'c-people', audio: 'cuidador.m4a' },
  { id: 'p12', texto: 'Médico', chaveSvg: 'user', cat: 'pessoas', cor: 'c-people', audio: 'medico.m4a' }
];

export default function App() {
  const [frase, setFrase] = useState([]);
  const [indiceFalando, setIndiceFalando] = useState(null);
  const [catAtiva, setCatAtiva] = useState('necessidades');
  const [cards, setCards] = useState(DADOS_COMPLETOS);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [nomeCrianca, setNomeCrianca] = useState('Criança');
  const [modalAberto, setModalAberto] = useState(false);
  const [hubJogosAberto, setHubJogosAberto] = useState(false);
  const [jogoSelecionado, setJogoSelecionado] = useState(null);

  const [modoCalmo, setModoCalmo] = useState(false);
  const [menuEmergenciaAberto, setMenuEmergenciaAberto] = useState(false);

  const [preferenciasVisuais, setPreferenciasVisuais] = useState({});

  const [novoTexto, setNovoTexto] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('necessidades');
  const [novaCor, setNovaCor] = useState('c-object');
  const [fotoCartaoCustom, setFotoCartaoCustom] = useState(null);
  const [gravando, setGravando] = useState(false);
  const [audioGravadoBlob, setAudioGravadoBlob] = useState(null);

  const timerToqueLongoRef = useRef(null);
  const [segurandoFab, setSegurandoFab] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    async function carregarPersistencia() {
      try {
        const prefsSalvas = await localforage.getItem('custom_visual_skins');
        if (prefsSalvas) setPreferenciasVisuais(prefsSalvas);

        const cardsSalvos = await localforage.getItem('custom_cards_v18');
        if (cardsSalvos && cardsSalvos.length > 0) {
          setCards(cardsSalvos);
        } else {
          setCards(DADOS_COMPLETOS);
          await localforage.setItem('custom_cards_v18', DADOS_COMPLETOS);
        }

        const fotoSalva = await localforage.getItem('child_photo');
        if (fotoSalva) setFotoPerfil(fotoSalva);

        const nomeSalvo = await localforage.getItem('child_name');
        if (nomeSalvo) setNomeCrianca(nomeSalvo);

        const calmoSalvo = await localforage.getItem('sensory_calm_mode');
        if (calmoSalvo !== null) setModoCalmo(calmoSalvo);
      } catch (err) {
        console.error('Falha ao restaurar banco IndexedDB:', err);
      }
    }
    carregarPersistencia();
  }, []);

  const alternarModoCalmo = async () => {
    const novoValor = !modoCalmo;
    setModoCalmo(novoValor);
    await localforage.setItem('sensory_calm_mode', novoValor);
  };

  const selecionarVariacao = async (textoCartao, arquivoEscolhido) => {
    const novoMapa = { ...preferenciasVisuais, [textoCartao]: arquivoEscolhido };
    setPreferenciasVisuais(novoMapa);
    await localforage.setItem('custom_visual_skins', novoMapa);
  };

  const iniciarToqueLongo = () => {
    setSegurandoFab(true);
    timerToqueLongoRef.current = setTimeout(() => {
      setSegurandoFab(false);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
      setModalAberto(true);
    }, 2500);
  };

  const cancelarToqueLongo = () => {
    setSegurandoFab(false);
    if (timerToqueLongoRef.current) {
      clearTimeout(timerToqueLongoRef.current);
      timerToqueLongoRef.current = null;
    }
  };

  const reproduzirItemVoz = (item, aoFinalizar = null) => {
    if (!item) {
      if (aoFinalizar) aoFinalizar();
      return;
    }

    const texto = item.texto || '';

    if (item.audioBlobUrl) {
      const audioBlob = new Audio(item.audioBlobUrl);
      if (aoFinalizar) audioBlob.onended = aoFinalizar;
      audioBlob.play().catch(() => emitirFalaNativa(texto, aoFinalizar));
      return;
    }

    const textoTratado = texto.trim().toLowerCase();
    let nomeArquivo = item.audio;
    if (textoTratado === 'escovar os dentes') nomeArquivo = 'escovar_os_dentes.m4a';
    if (textoTratado === 'tomar banho') nomeArquivo = 'tomar_banho.m4a';
    if (textoTratado === 'lavar as mãos' || textoTratado === 'lavar as maos') nomeArquivo = 'lavar_as_maos.m4a';

    if (nomeArquivo) {
      const som = new Audio(`/audios/${nomeArquivo}`);
      if (aoFinalizar) som.onended = aoFinalizar;

      const promessa = som.play();
      if (promessa !== undefined) {
        promessa.catch(() => {
          emitirFalaNativa(texto, aoFinalizar);
        });
        return;
      }
    }

    emitirFalaNativa(texto, aoFinalizar);
  };

  const emitirFalaNativa = (texto, callback = null) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const locucao = new SpeechSynthesisUtterance(texto);
      locucao.lang = 'pt-BR';
      locucao.rate = 0.92;

      locucao.onend = () => { if (callback) callback(); };
      locucao.onerror = () => { if (callback) callback(); };

      window.speechSynthesis.speak(locucao);
    } else if (callback) {
      callback();
    }
  };

  const clicarCartao = (item) => {
    reproduzirItemVoz(item);
    setFrase((antiga) => [...antiga, item]);
  };

  const falarFrase = () => {
    if (frase.length === 0 || indiceFalando !== null) return;

    let i = 0;
    const playNext = () => {
      if (i >= frase.length) {
        setIndiceFalando(null);
        return;
      }

      setIndiceFalando(i);
      const item = frase[i];

      reproduzirItemVoz(item, () => {
        i++;
        playNext();
      });
    };

    playNext();
  };

  const limparFrase = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIndiceFalando(null);
    setFrase([]);
  };

  const dispararEmergencia = (texto, audio) => {
    reproduzirItemVoz({ texto, audio });
    setMenuEmergenciaAberto(false);
  };

  const handleUploadPerfil = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        setFotoPerfil(base64);
        await localforage.setItem('child_photo', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadFotoCartao = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoCartaoCustom(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const iniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioGravadoBlob(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current.start();
      setGravando(true);
    } catch {
      alert('Microfone não autorizado ou indisponível.');
    }
  };

  const pararGravacao = () => {
    if (mediaRecorderRef.current && gravando) {
      mediaRecorderRef.current.stop();
      setGravando(false);
    }
  };

  const salvarNovoCartao = async () => {
    if (!novoTexto.trim()) {
      alert('Digite o nome do cartão!');
      return;
    }

    let urlTemporaria = null;
    let base64Audio = null;

    if (audioGravadoBlob) {
      urlTemporaria = URL.createObjectURL(audioGravadoBlob);
      const reader = new FileReader();
      reader.onloadend = async () => {
        base64Audio = reader.result;
        concluirCriacao(urlTemporaria, base64Audio);
      };
      reader.readAsDataURL(audioGravadoBlob);
    } else {
      concluirCriacao(null, null);
    }
  };

  const concluirCriacao = async (blobUrl, base64Audio) => {
    const novoCard = {
      id: `custom_${Date.now()}`,
      texto: novoTexto.trim(),
      chaveSvg: 'dor',
      imagemCustom: fotoCartaoCustom,
      cat: novaCategoria,
      cor: novaCor,
      audioBlobUrl: blobUrl,
      audioBase64: base64Audio
    };

    const listaAtualizada = [...cards, novoCard];
    setCards(listaAtualizada);
    await localforage.setItem('custom_cards_v18', listaAtualizada);

    setNovoTexto('');
    setFotoCartaoCustom(null);
    setAudioGravadoBlob(null);
    setModalAberto(false);
  };

  const cartoesVisiveis = cards.filter((item) => item.cat === catAtiva);

  return (
    <div className={`aac-app ${modoCalmo ? 'sensory-calm-mode' : ''}`}>
      {/* 1. Barra de Sentença Acessível */}
      <header className="sentence-bar">
        <div className="profile-pill" onClick={() => setModalAberto(true)} title="Configurações">
          {fotoPerfil ? (
            <img src={fotoPerfil} alt="Perfil" className="profile-img" loading="lazy" decoding="async" />
          ) : (
            <div className="profile-avatar-fallback">👤</div>
          )}
          <span className="profile-name">{nomeCrianca}</span>
          <span className="gear-icon">⚙️</span>
        </div>

        <div className="sentence-slot">
          {frase.length === 0 ? (
            <span className="sentence-empty">Toque nos símbolos para comunicar...</span>
          ) : (
            frase.map((tok, idx) => (
              <div
                key={`${tok.id}-${idx}`}
                className={`token ${tok.cor} ${indiceFalando === idx ? 'token-ativo-fala' : ''}`}
                onClick={() => setFrase(frase.filter((_, i) => i !== idx))}
              >
                {tok.imagemCustom ? (
                  <img src={tok.imagemCustom} alt={tok.texto} className="token-img" loading="lazy" decoding="async" />
                ) : (
                  <img 
                    src={`/img/${preferenciasVisuais[tok.texto] || MAPA_IMAGENS[tok.texto] || tok.id + ".png"}`} 
                    alt={tok.texto} 
                    className="token-img"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = "block";
                    }}
                  />
                )}
                <div style={{ display: "none" }}>
                  {ICONES_BASE[tok.chaveSvg] || ICONES_BASE.user}
                </div>
                <span>{tok.texto}</span>
              </div>
            ))
          )}
        </div>
        <button type="button" className="sentence-btn btn-speak" onClick={falarFrase}>
          FALAR
        </button>
        <button type="button" className="sentence-btn btn-clear" onClick={limparFrase}>
          LIMPAR
        </button>
      </header>

      {/* 2. Categorias */}
      <nav className="categories-tabs" style={{ display: 'flex', overflowX: 'auto', gap: '8px', padding: '8px 12px' }}>
        <button
          type="button"
          className={`tab-item ${catAtiva === 'necessidades' ? 'active' : ''}`}
          onClick={() => setCatAtiva('necessidades')}
        >
          Necessidades
        </button>
        <button
          type="button"
          className={`tab-item ${catAtiva === 'alimentacao' ? 'active' : ''}`}
          onClick={() => setCatAtiva('alimentacao')}
        >
          Alimentação
        </button>
        <button
          type="button"
          className={`tab-item ${catAtiva === 'acoes' ? 'active' : ''}`}
          onClick={() => setCatAtiva('acoes')}
        >
          Ações
        </button>
        <button
          type="button"
          className={`tab-item ${catAtiva === 'sentimentos' ? 'active' : ''}`}
          onClick={() => setCatAtiva('sentimentos')}
        >
          Sentimentos
        </button>
        <button
          type="button"
          className={`tab-item ${catAtiva === 'pessoas' ? 'active' : ''}`}
          onClick={() => setCatAtiva('pessoas')}
        >
          Pessoas
        </button>
        <button
          type="button"
          onClick={() => setHubJogosAberto(true)}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            color: '#ffffff',
            fontWeight: 'bold',
            border: '2px solid #a78bfa',
            borderRadius: '14px',
            padding: '8px 16px',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.4)'
          }}
        >
          🎮 BRINCAR & APRENDER
        </button>
        <button
          type="button"
          onClick={alternarModoCalmo}
          style={{
            background: modoCalmo ? '#334155' : '#1e293b',
            color: modoCalmo ? '#38bdf8' : '#94a3b8',
            border: '1.5px solid #475569',
            borderRadius: '14px',
            padding: '8px 14px',
            cursor: 'pointer',
            flexShrink: 0,
            fontWeight: '600'
          }}
          title="Modo Calmo Sensorial"
        >
          {modoCalmo ? '🌙 Modo Calmo: ATIVO' : '☀️ Modo Padrão'}
        </button>
        <button
          type="button"
          onClick={() => setMenuEmergenciaAberto(true)}
          style={{
            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
            color: '#ffffff',
            fontWeight: 'bold',
            border: '2px solid #f87171',
            borderRadius: '14px',
            padding: '8px 16px',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.4)'
          }}
          title="Ajuda Rápida e Emergência Imediata"
        >
          🆘 AJUDA RÁPIDA
        </button>
      </nav>

      {/* 3. Grade Principal */}
      <main className="board-container">
        <div className="board-grid">
          {cartoesVisiveis.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`board-card ${c.cor}`}
              onClick={() => clicarCartao(c)}
            >
              <div className="card-visual-box">
                {c.imagemCustom ? (
                  <img src={c.imagemCustom} alt={c.texto} className="card-custom-img" loading="lazy" decoding="async" />
                ) : (
                  <img 
                    src={`/img/${preferenciasVisuais[c.texto] || MAPA_IMAGENS[c.texto] || c.id + ".png"}`} 
                    alt={c.texto} 
                    className="card-custom-img"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = "block";
                    }}
                  />
                )}
                <div style={{ display: "none" }}>
                  {ICONES_BASE[c.chaveSvg] || ICONES_BASE.user}
                </div>
              </div>
              <span className="card-title">{c.texto}</span>
            </button>
          ))}
        </div>
      </main>

      {/* 4. Modal de Emergência */}
      {menuEmergenciaAberto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9995
          }}
          onClick={() => setMenuEmergenciaAberto(false)}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
              background: '#0f172a',
              padding: '24px',
              borderRadius: '24px',
              border: '3px solid #ef4444',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)',
              maxWidth: '440px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ color: '#f87171', fontSize: '1.35rem', margin: 0, fontWeight: 'bold' }}>
                🆘 Ajuda Imediata
              </h3>
              <button
                type="button"
                onClick={() => setMenuEmergenciaAberto(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '1.4rem',
                  cursor: 'pointer'
                }}
              >
                ✖
              </button>
            </div>
            <button
              type="button"
              onClick={() => dispararEmergencia('Banheiro', 'banheiro.m4a')}
              style={{
                background: '#0284c7',
                color: '#ffffff',
                border: '2px solid #38bdf8',
                borderRadius: '16px',
                padding: '18px 12px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '2.4rem' }}>🚽</span> Banheiro
            </button>
            <button
              type="button"
              onClick={() => dispararEmergencia('Água', 'agua.m4a')}
              style={{
                background: '#0ea5e9',
                color: '#ffffff',
                border: '2px solid #7dd3fc',
                borderRadius: '16px',
                padding: '18px 12px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '2.4rem' }}>💧</span> Água
            </button>
            <button
              type="button"
              onClick={() => dispararEmergencia('Dor', 'dor.m4a')}
              style={{
                background: '#ef4444',
                color: '#ffffff',
                border: '2px solid #fca5a5',
                borderRadius: '16px',
                padding: '18px 12px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '2.4rem' }}>🩹</span> Dor
            </button>
            <button
              type="button"
              onClick={() => dispararEmergencia('Parar', 'parar.m4a')}
              style={{
                background: '#f59e0b',
                color: '#ffffff',
                border: '2px solid #fcd34d',
                borderRadius: '16px',
                padding: '18px 12px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '2.4rem' }}>🛑</span> Parar
            </button>
          </div>
        </div>
      )}

      {/* 5. Modal de Configurações e Inclusão */}
      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal-box">
            <header className="modal-header">
              <h2>Configurações da Prancha</h2>
              <button type="button" className="modal-close" onClick={() => setModalAberto(false)}>✖</button>
            </header>

            <div className="modal-content">
              <section className="form-group">
                <h3>Perfil do Usuário</h3>
                <div className="profile-edit-row">
                  <label className="photo-upload-label">
                    {fotoPerfil ? (
                      <img src={fotoPerfil} alt="Perfil" className="photo-preview" loading="lazy" decoding="async" />
                    ) : (
                      <div className="photo-placeholder">+ Foto</div>
                    )}
                    <input type="file" accept="image/*" onChange={handleUploadPerfil} hidden />
                  </label>
                  <input
                    type="text"
                    className="cfg-input"
                    value={nomeCrianca}
                    onChange={(e) => {
                      setNomeCrianca(e.target.value);
                      localforage.setItem('child_name', e.target.value);
                    }}
                    placeholder="Nome da criança"
                  />
                </div>
              </section>

              {/* Galeria de Inclusão e Representatividade */}
              <section className="form-group">
                <h3 style={{ fontSize: '1.2rem', color: '#38bdf8', marginBottom: '4px' }}>
                  Galeria de Personalização e Inclusão
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: '0 0 16px 0' }}>
                  Toque na versão que melhor representa você e sua família:
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  maxHeight: '480px',
                  overflowY: 'auto',
                  padding: '12px',
                  background: '#0b1329',
                  borderRadius: '16px',
                  border: '1px solid #1e293b'
                }}>
                  {Object.entries(VARIACOES_DISPONIVEIS).map(([itemNome, opcoes]) => {
                    const ativa = preferenciasVisuais[itemNome] || opcoes[0].img;
                    return (
                      <div key={itemNome} style={{
                        background: '#1e293b',
                        borderRadius: '14px',
                        padding: '14px',
                        border: '1px solid #334155',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                      }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '12px',
                          borderBottom: '1px solid #334155',
                          paddingBottom: '6px'
                        }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#f8fafc' }}>
                            {itemNome}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Opções disponíveis
                          </span>
                        </div>

                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'flex-start', 
                          alignItems: 'center', 
                          gap: '16px', 
                          overflowX: 'auto', 
                          padding: '4px 2px' 
                        }}>
                          {opcoes.map((op) => {
                            const estaAtivo = ativa === op.img;
                            return (
                              <div 
                                key={op.img} 
                                onClick={() => selecionarVariacao(itemNome, op.img)}
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  cursor: 'pointer',
                                  flexShrink: 0
                                }}
                              >
                                <img
                                  src={`/img/${op.img}`}
                                  alt={op.label}
                                  loading="lazy"
                                  decoding="async"
                                  style={{
                                    width: '68px',
                                    height: '68px',
                                    borderRadius: '12px',
                                    objectFit: 'cover',
                                    background: '#020617',
                                    border: estaAtivo ? '3.5px solid #22c55e' : '2px solid #475569',
                                    padding: '2px',
                                    boxShadow: estaAtivo ? '0 0 12px rgba(34, 197, 94, 0.6)' : 'none',
                                    transition: 'transform 0.15s ease'
                                  }}
                                />
                                <span style={{
                                  fontSize: '0.78rem',
                                  color: estaAtivo ? '#4ade80' : '#94a3b8',
                                  fontWeight: estaAtivo ? 'bold' : 'normal',
                                  marginTop: '6px',
                                  textAlign: 'center',
                                  maxWidth: '80px'
                                }}>
                                  {op.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Seção Novo Cartão */}
              <section className="form-group">
                <h3>Adicionar Novo Cartão com Foto e Voz</h3>
                <input
                  type="text"
                  className="cfg-input"
                  placeholder="Nome do cartão (Ex: Brigadeiro, Bola)"
                  value={novoTexto}
                  onChange={(e) => setNovoTexto(e.target.value)}
                />

                <div className="card-photo-selector">
                  {fotoCartaoCustom ? (
                    <img src={fotoCartaoCustom} alt="Prévia" className="card-img-preview" loading="lazy" decoding="async" />
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Nenhuma imagem anexada</span>
                  )}
                  <label className="btn-choose-img">
                    📷 Escolher Imagem
                    <input type="file" accept="image/*" onChange={handleUploadFotoCartao} hidden />
                  </label>
                </div>

                <div className="cfg-row">
                  <select
                    className="cfg-select"
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                  >
                    <option value="necessidades">Necessidades</option>
                    <option value="alimentacao">Alimentação</option>
                    <option value="acoes">Ações</option>
                    <option value="sentimentos">Sentimentos</option>
                    <option value="pessoas">Pessoas</option>
                  </select>

                  <select
                    className="cfg-select"
                    value={novaCor}
                    onChange={(e) => setNovaCor(e.target.value)}
                  >
                    <option value="c-object">Laranja (Substantivo)</option>
                    <option value="c-action">Verde (Ação)</option>
                    <option value="c-feeling">Azul (Sentimento)</option>
                    <option value="c-people">Amarelo (Pessoa)</option>
                    <option value="c-social">Rosa (Social)</option>
                  </select>
                </div>

                <div className="recorder-zone">
                  {!gravando ? (
                    <button type="button" className="rec-btn btn-start-rec" onClick={iniciarGravacao}>
                      🎙️ Gravar Voz Humana
                    </button>
                  ) : (
                    <button type="button" className="rec-btn btn-stop-rec" onClick={pararGravacao}>
                      ⏹️ Parar Gravação
                    </button>
                  )}
                  {audioGravadoBlob && <span className="audio-ok-badge">✓ Áudio Pronto</span>}
                </div>

                <button type="button" className="btn-save-card" onClick={salvarNovoCartao}>
                  ＋ Salvar Cartão no Painel
                </button>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* 6. Menu Seletor Central */}
      {hubJogosAberto && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.96)',
          zIndex: 9998,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '24px 16px 48px 16px',
          boxSizing: 'border-box'
        }}>
          <button
            type="button"
            onClick={() => setHubJogosAberto(false)}
            style={{
              position: 'fixed',
              top: '16px',
              right: '16px',
              background: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✖
          </button>

          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100%',
            justifyContent: 'flex-start'
          }}>
            <h2 style={{ color: '#38bdf8', fontSize: '2rem', margin: '16px 0 8px 0', textAlign: 'center' }}>
              🎮 Brincar & Aprender
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem', marginBottom: '24px', textAlign: 'center', maxWidth: '480px' }}>
              Escolha uma atividade interativa pedagógica:
            </p>

            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              width: '100%',
              paddingBottom: '32px'
            }}>
              <div
                onClick={() => { setHubJogosAberto(false); setJogoSelecionado('emocoes'); }}
                style={{
                  background: '#0f172a',
                  border: '2px solid #38bdf8',
                  borderRadius: '20px',
                  padding: '20px',
                  width: '100%',
                  maxWidth: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
                }}
              >
                <span style={{ fontSize: '2.8rem', marginBottom: '8px' }}>🎭</span>
                <h3 style={{ color: '#f8fafc', fontSize: '1.15rem', margin: '0 0 6px 0', textAlign: 'center' }}>Detetive das Emoções</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', margin: 0 }}>Narração e apoio visual das emoções</p>
              </div>

              <div
                onClick={() => { setHubJogosAberto(false); setJogoSelecionado('memoria'); }}
                style={{
                  background: '#0f172a',
                  border: '2px solid #22c55e',
                  borderRadius: '20px',
                  padding: '20px',
                  width: '100%',
                  maxWidth: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
                }}
              >
                <span style={{ fontSize: '2.8rem', marginBottom: '8px' }}>🃏</span>
                <h3 style={{ color: '#f8fafc', fontSize: '1.15rem', margin: '0 0 6px 0', textAlign: 'center' }}>Cadê o Par?</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', margin: 0 }}>Memória sensorial sem estresse de tempo</p>
              </div>

              <div
                onClick={() => { setHubJogosAberto(false); setJogoSelecionado('rotina'); }}
                style={{
                  background: '#0f172a',
                  border: '2px solid #f59e0b',
                  borderRadius: '20px',
                  padding: '20px',
                  width: '100%',
                  maxWidth: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
                }}
              >
                <span style={{ fontSize: '2.8rem', marginBottom: '8px' }}>📋</span>
                <h3 style={{ color: '#f8fafc', fontSize: '1.15rem', margin: '0 0 6px 0', textAlign: 'center' }}>Minha Rotina</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', margin: 0 }}>Sequenciamento lógico de passos diários</p>
              </div>

              <div
                onClick={() => { setHubJogosAberto(false); setJogoSelecionado('frases'); }}
                style={{
                  background: '#0f172a',
                  border: '2px solid #a855f7',
                  borderRadius: '20px',
                  padding: '20px',
                  width: '100%',
                  maxWidth: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
                }}
              >
                <span style={{ fontSize: '2.8rem', marginBottom: '8px' }}>💬</span>
                <h3 style={{ color: '#f8fafc', fontSize: '1.15rem', margin: '0 0 6px 0', textAlign: 'center' }}>Fábrica de Frases</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', margin: 0 }}>Aprenda a juntar cartões e formar frases</p>
              </div>

              <div
                onClick={() => { setHubJogosAberto(false); setJogoSelecionado('funcional'); }}
                style={{
                  background: '#0f172a',
                  border: '2px solid #06b6d4',
                  borderRadius: '20px',
                  padding: '20px',
                  width: '100%',
                  maxWidth: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
                }}
              >
                <span style={{ fontSize: '2.8rem', marginBottom: '8px' }}>🎯</span>
                <h3 style={{ color: '#22d3ee', fontSize: '1.15rem', margin: '0 0 6px 0', textAlign: 'center' }}>Para Que Serve?</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', margin: 0 }}>Raciocínio prático de causas, necessidades e cuidados</p>
              </div>

              <div
                onClick={() => { setHubJogosAberto(false); setJogoSelecionado('alfabetizacao'); }}
                style={{
                  background: '#0f172a',
                  border: '2px solid #38bdf8',
                  borderRadius: '20px',
                  padding: '20px',
                  width: '100%',
                  maxWidth: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
                }}
              >
                <span style={{ fontSize: '2.8rem', marginBottom: '8px' }}>🔤</span>
                <h3 style={{ color: '#38bdf8', fontSize: '1.15rem', margin: '0 0 6px 0', textAlign: 'center' }}>Letras e Números</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', margin: 0 }}>Alfabetização e numerais assistivos</p>
              </div>

              <div
                onClick={() => { setHubJogosAberto(false); setJogoSelecionado('cognitive'); }}
                style={{
                  background: '#0f172a',
                  border: '2px solid #ec4899',
                  borderRadius: '20px',
                  padding: '20px',
                  width: '100%',
                  maxWidth: '240px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
                }}
              >
                <span style={{ fontSize: '2.8rem', marginBottom: '8px' }}>🧠</span>
                <h3 style={{ color: '#f472b6', fontSize: '1.15rem', margin: '0 0 6px 0', textAlign: 'center' }}>Engine Cognitiva</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', textAlign: 'center', margin: 0 }}>Validação lógica e estruturação de pensamento</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Modais de Jogos */}
      {jogoSelecionado === 'emocoes' && <JogoEmocoes preferenciasVisuais={preferenciasVisuais} onClose={() => setJogoSelecionado(null)} />}
      {jogoSelecionado === 'memoria' && <JogoMemoria preferenciasVisuais={preferenciasVisuais} onClose={() => setJogoSelecionado(null)} />}
      {jogoSelecionado === 'rotina' && <JogoRotina preferenciasVisuais={preferenciasVisuais} onClose={() => setJogoSelecionado(null)} />}
      {jogoSelecionado === 'frases' && <JogoFrases preferenciasVisuais={preferenciasVisuais} onClose={() => setJogoSelecionado(null)} />}
      {jogoSelecionado === 'funcional' && <JogoFuncional preferenciasVisuais={preferenciasVisuais} onClose={() => setJogoSelecionado(null)} />}
      {jogoSelecionado === 'alfabetizacao' && <JogoAlfabetizacao preferenciasVisuais={preferenciasVisuais} onClose={() => setJogoSelecionado(null)} />}
      {jogoSelecionado === 'cognitive' && <CognitiveChallenge onClose={() => setJogoSelecionado(null)} onComplete={() => setJogoSelecionado(null)} />}

      {/* 8. Botão Flutuante (FAB) */}
      <div className="fab-lock-container">
        {segurandoFab && <div className="fab-tooltip">Segure para abrir...</div>}
        <button
          type="button"
          className="fab-button"
          title="Segure por 2.5 segundos para cadastrar cartão"
          onMouseDown={iniciarToqueLongo}
          onMouseUp={cancelarToqueLongo}
          onMouseLeave={cancelarToqueLongo}
          onTouchStart={iniciarToqueLongo}
          onTouchEnd={cancelarToqueLongo}
        >
          <div className={`fab-progress-ring ${segurandoFab ? 'holding' : ''}`} />
          ＋
        </button>
      </div>
    </div>
  );
}