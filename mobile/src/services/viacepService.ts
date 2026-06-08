import axios from 'axios';

export interface EnderecoViaCEP {
  cep:         string;
  logradouro:  string;
  complemento: string;
  bairro:      string;
  localidade:  string;  // cidade
  uf:          string;  // estado
  erro?:       boolean;
}

/**
 * Consulta endereço pelo CEP usando a API pública ViaCEP.
 * Endpoint: https://viacep.com.br/ws/{cep}/json/
 */
export async function buscarCEP(cep: string): Promise<EnderecoViaCEP | null> {
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) return null;

  try {
    const { data } = await axios.get<EnderecoViaCEP>(
      `https://viacep.com.br/ws/${cepLimpo}/json/`
    );
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}

/** Formata CEP: 12245000 → 12245-000 */
export function formatarCEP(valor: string): string {
  const num = valor.replace(/\D/g, '').slice(0, 8);
  if (num.length <= 5) return num;
  return `${num.slice(0, 5)}-${num.slice(5)}`;
}
