// ==========================================================
//  CONFIGURAÇÃO DO AMBIENTE — App Scholar
//  Escolha o ambiente descomentando a linha correta
// ==========================================================

const AMBIENTES = {
  // Emulador Android (AVD) — 10.0.2.2 aponta para sua máquina
  android_emulador: 'http://10.0.2.2:3000/api',

  // Celular físico Android ou iOS — troque pelo IP da sua máquina
  // Descubra seu IP rodando "ipconfig" no Windows ou "ifconfig" no Mac
  celular_fisico: 'http://192.168.1.100:3000/api',

  // Emulador iOS (apenas Mac com Xcode)
  ios_emulador: 'http://localhost:3000/api',

  // Expo Go no celular físico — mesmo IP da rede Wi-Fi
  expo_go: 'http://192.168.1.100:3000/api',

  // Web (Expo Web / browser)
  web: 'http://localhost:3000/api',
};

// ==========================================================
//  ✏️  MUDE AQUI — escolha seu ambiente:
// ==========================================================
const AMBIENTE_ATIVO = 'android_emulador';

// ==========================================================
//  ✏️  SE usar celular_fisico ou expo_go, troque o IP abaixo:
//  Rode "ipconfig" no terminal e copie o "Endereço IPv4"
// ==========================================================
const MEU_IP = '192.168.1.100';

// Substitui o IP nos ambientes que precisam
const BASE_URL = AMBIENTES[AMBIENTE_ATIVO].replace('192.168.1.100', MEU_IP);

export default {
  BASE_URL,
  AMBIENTE_ATIVO,
  API_TIMEOUT: 10000, // 10 segundos
};
