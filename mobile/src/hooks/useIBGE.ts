import { useState, useEffect } from 'react';
import { listarEstados, listarMunicipios, Estado, Municipio } from '../services/ibgeService';

export function useIBGE(ufSelecionada?: string) {
  const [estados,    setEstados]    = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loadingUF,  setLoadingUF]  = useState(false);
  const [loadingMun, setLoadingMun] = useState(false);

  // Carrega estados na inicialização
  useEffect(() => {
    setLoadingUF(true);
    listarEstados()
      .then(setEstados)
      .catch(console.error)
      .finally(() => setLoadingUF(false));
  }, []);

  // Carrega municípios quando a UF muda
  useEffect(() => {
    if (!ufSelecionada) { setMunicipios([]); return; }

    setLoadingMun(true);
    listarMunicipios(ufSelecionada)
      .then(setMunicipios)
      .catch(console.error)
      .finally(() => setLoadingMun(false));
  }, [ufSelecionada]);

  return { estados, municipios, loadingUF, loadingMun };
}
