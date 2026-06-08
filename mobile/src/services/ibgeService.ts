import axios from 'axios';

const IBGE_BASE = 'https://servicodados.ibge.gov.br/api/v1/localidades';

export interface Estado {
  id:     number;
  sigla:  string;
  nome:   string;
  regiao: { id: number; sigla: string; nome: string };
}

export interface Municipio {
  id:   number;
  nome: string;
}

/** Retorna todos os 27 estados (UFs) ordenados alfabeticamente. */
export async function listarEstados(): Promise<Estado[]> {
  const { data } = await axios.get<Estado[]>(`${IBGE_BASE}/estados?orderBy=nome`);
  return data;
}

/** Retorna os municípios de um estado pela sigla (ex: 'SP'). */
export async function listarMunicipios(uf: string): Promise<Municipio[]> {
  const { data } = await axios.get<Municipio[]>(
    `${IBGE_BASE}/estados/${uf}/municipios?orderBy=nome`
  );
  return data;
}
