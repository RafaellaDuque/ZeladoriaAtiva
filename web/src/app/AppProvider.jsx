import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  carregarBd,
  definirSessao as persistirSessao,
  obterSessao,
  restaurarBd,
  salvarBd,
} from '../data/storage.js';
import {
  cidadaoComMenosVotos,
  criarChamado as criarChamadoNoDominio,
  registrarVoto as registrarVotoNoDominio,
} from '../domain/zeladoria.js';

const ZeladoriaContext = createContext(null);

/** Acesso ao "banco" (os 7 arrays) e às ações de escrita. */
export function useZeladoria() {
  const contexto = useContext(ZeladoriaContext);
  if (!contexto) throw new Error('useZeladoria precisa ser usado dentro de <AppProvider>');
  return contexto;
}

/**
 * Estado global da aplicação.
 *
 * - `dados`   : os 7 arrays (municipios, bairros, cidadaos, chamadosZeladoria,
 *               votosChamado, orgaosResponsaveis, ordensServico) em memória;
 * - `votanteId`: quem está votando neste navegador (1 voto por CPF por chamado);
 * - qualquer escrita passa por uma função pura do domínio e substitui o estado,
 *   e um efeito espelha tudo no localStorage.
 */
export default function AppProvider({ children }) {
  const [dados, setDados] = useState(carregarBd);
  const [sessao, setSessao] = useState(obterSessao);
  const [avisoArmazenamento, setAvisoArmazenamento] = useState(null);
  const primeiroRender = useRef(true);

  /* Espelha o estado no localStorage (uma escrita por alteração) */
  useEffect(() => {
    if (primeiroRender.current) {
      primeiroRender.current = false;
      return;
    }
    const gravou = salvarBd(dados);
    setAvisoArmazenamento(
      gravou ? null : 'O navegador não aceitou gravar no localStorage (cota cheia ou modo privado).'
    );
  }, [dados]);

  /** Identidade de votação: a salva na sessão ou, na primeira visita,
   *  o cidadão que menos votou (o painel já abre com chamados votáveis). */
  const votanteId = useMemo(() => sessao ?? cidadaoComMenosVotos(dados), [sessao, dados]);

  const definirVotante = useCallback((cidadaoId) => {
    const id = Number(cidadaoId);
    setSessao(id);
    persistirSessao(id);
  }, []);

  const registrarVoto = useCallback(
    (payload) => {
      const resultado = registrarVotoNoDominio(dados, payload);
      if (resultado.ok) setDados(resultado.dados);
      return resultado;
    },
    [dados]
  );

  const criarChamado = useCallback(
    (payload) => {
      const resultado = criarChamadoNoDominio(dados, payload);
      if (resultado.ok) {
        setDados(resultado.dados);
        definirVotante(resultado.cidadao.cidadaoId);
      }
      return resultado;
    },
    [dados, definirVotante]
  );

  const restaurar = useCallback(() => {
    setDados(restaurarBd());
    setSessao(null);
  }, []);

  const valor = useMemo(
    () => ({
      dados,
      votanteId,
      definirVotante,
      registrarVoto,
      criarChamado,
      restaurar,
      avisoArmazenamento,
    }),
    [dados, votanteId, definirVotante, registrarVoto, criarChamado, restaurar, avisoArmazenamento]
  );

  return <ZeladoriaContext.Provider value={valor}>{children}</ZeladoriaContext.Provider>;
}
