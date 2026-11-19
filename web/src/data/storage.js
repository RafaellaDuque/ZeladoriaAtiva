/**
 * Persistência no localStorage — a "camada de arquivo" do protótipo.
 *
 * O banco vive em memória no estado do React (AppProvider) e é espelhado aqui
 * a cada alteração. Se o navegador bloquear a escrita (modo privado ou cota
 * cheia), as funções devolvem `false` para a interface avisar o usuário.
 */
import { dadosOriginais } from './seed.js';

export const CHAVE_BD = 'zeladoria-ativa:bd:v1';
export const CHAVE_SESSAO = 'zeladoria-ativa:sessao:v1';

const VERSAO = 1;
const COLECOES = [
  'municipios',
  'bairros',
  'cidadaos',
  'chamadosZeladoria',
  'votosChamado',
  'orgaosResponsaveis',
  'ordensServico',
];

/** Atualiza a foto dos chamados de demonstração que ainda apontam para um arquivo em assets/img. */
function sincronizarFotosDemo(dados) {
  const fotos = new Map(
    dadosOriginais().chamadosZeladoria.map((chamado) => [chamado.protocolo, chamado.urlFoto])
  );

  return {
    ...dados,
    chamadosZeladoria: dados.chamadosZeladoria.map((chamado) => {
      const foto = fotos.get(chamado.protocolo);
      if (!foto || chamado.urlFoto === foto) return chamado;
      if (typeof chamado.urlFoto === 'string' && chamado.urlFoto.startsWith('assets/img/')) {
        return { ...chamado, urlFoto: foto };
      }
      return chamado;
    }),
  };
}

const temStorage = () => {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
};

/** Lê o "banco" salvo; se não existir ou estiver corrompido, devolve o seed do SQL. */
export function carregarBd() {
  if (!temStorage()) return dadosOriginais();
  try {
    const bruto = window.localStorage.getItem(CHAVE_BD);
    if (!bruto) return dadosOriginais();

    const salvo = JSON.parse(bruto);
    const valido =
      salvo && salvo._versao === VERSAO && COLECOES.every((chave) => Array.isArray(salvo[chave]));

    if (!valido) return dadosOriginais();

    return sincronizarFotosDemo(
      Object.fromEntries(COLECOES.map((chave) => [chave, salvo[chave]]))
    );
  } catch {
    return dadosOriginais();
  }
}

/** Grava o estado atual. Devolve false quando o localStorage recusa. */
export function salvarBd(dados) {
  if (!temStorage()) return false;
  try {
    window.localStorage.setItem(CHAVE_BD, JSON.stringify({ ...dados, _versao: VERSAO }));
    return true;
  } catch {
    return false;
  }
}

/** Apaga tudo e volta ao estado do script SQL. */
export function restaurarBd() {
  if (temStorage()) {
    try {
      window.localStorage.removeItem(CHAVE_BD);
      window.localStorage.removeItem(CHAVE_SESSAO);
    } catch {
      /* ignora */
    }
  }
  return dadosOriginais();
}

/** Identidade de votação deste navegador (regra: 1 voto por CPF por chamado). */
export function obterSessao() {
  if (!temStorage()) return null;
  try {
    const id = Number.parseInt(window.localStorage.getItem(CHAVE_SESSAO), 10);
    return Number.isNaN(id) ? null : id;
  } catch {
    return null;
  }
}

export function definirSessao(cidadaoId) {
  if (!temStorage()) return;
  try {
    window.localStorage.setItem(CHAVE_SESSAO, String(cidadaoId));
  } catch {
    /* ignora */
  }
}
