/**
 * Regras de negócio do domínio — funções puras.
 *
 * Equivalem, no front-end, à camada `service` do projeto Java (ZeladoriaService).
 * Nenhuma delas toca no React nem no localStorage: recebem o estado atual
 * (`dados` = os 7 arrays) e devolvem um NOVO estado + o resultado da operação.
 * Isso mantém o estado imutável e o React sabe exatamente quando re-renderizar.
 *
 *   scorePrioridade = (totalVotos * 10) + (indiceVulnerabilidade * 5)
 *   mediaUrgencia   = média aritmética dos nivelUrgencia daquele chamado (1 a 5)
 */
import { diasEntre, hojeISO } from './format.js';

const porId = (lista, campo, id) => lista.find((item) => item[campo] === Number(id)) ?? null;

const maiorId = (lista, campo) => lista.reduce((maior, item) => Math.max(maior, Number(item[campo]) || 0), 0) + 1;

/* ------------------------------------------------------------ consultas */

export const obterBairro = (dados, bairroId) => porId(dados.bairros, 'bairroId', bairroId);
export const obterCidadao = (dados, cidadaoId) => porId(dados.cidadaos, 'cidadaoId', cidadaoId);
export const obterOrgao = (dados, orgaoId) => porId(dados.orgaosResponsaveis, 'orgaoId', orgaoId);
export const obterChamado = (dados, chamadoId) => porId(dados.chamadosZeladoria, 'chamadoId', chamadoId);

/** OS ligada ao chamado (relação 1:1 no banco). */
export const obterOrdemDoChamado = (dados, chamadoId) =>
  dados.ordensServico.find((os) => os.chamadoId === Number(chamadoId)) ?? null;

/** Votos de um chamado, do mais recente para o mais antigo. */
export const obterVotosDoChamado = (dados, chamadoId) =>
  dados.votosChamado
    .filter((voto) => voto.chamadoId === Number(chamadoId))
    .sort((a, b) => (a.dataVoto < b.dataVoto ? 1 : a.dataVoto > b.dataVoto ? -1 : b.votoId - a.votoId));

/* ------------------------------------------------------ regras numéricas */

/** Score de Prioridade Comunitária. */
export function calcularScore(dados, chamado) {
  const bairro = obterBairro(dados, chamado.bairroId);
  const vulnerabilidade = bairro ? bairro.indiceVulnerabilidade : 0;
  return (Number(chamado.totalVotos) || 0) * 10 + vulnerabilidade * 5;
}

/** Média aritmética de nivelUrgencia (1 a 5). `null` quando ainda não há votos. */
export function calcularMediaUrgencia(dados, chamadoId) {
  const votos = dados.votosChamado.filter((voto) => voto.chamadoId === Number(chamadoId));
  if (!votos.length) return null;
  return votos.reduce((total, voto) => total + Number(voto.nivelUrgencia), 0) / votos.length;
}

/** O cidadão já votou neste chamado? (constraint UK_VOTO_UNICO_POR_CIDADAO) */
export function jaVotou(dados, chamadoId, cidadaoId) {
  return dados.votosChamado.some(
    (voto) => voto.chamadoId === Number(chamadoId) && voto.cidadaoId === Number(cidadaoId)
  );
}

/** Chamado + entidades relacionadas + métricas calculadas. */
export function detalhar(dados, chamado) {
  const bairro = obterBairro(dados, chamado.bairroId);
  const ordem = obterOrdemDoChamado(dados, chamado.chamadoId);
  const votos = obterVotosDoChamado(dados, chamado.chamadoId);
  const fim = chamado.status === 'Resolvido' && ordem?.dataConclusao ? ordem.dataConclusao : hojeISO();

  return {
    chamado,
    bairro,
    autor: obterCidadao(dados, chamado.cidadaoAutorId),
    votos,
    media: calcularMediaUrgencia(dados, chamado.chamadoId),
    score: calcularScore(dados, chamado),
    ordem,
    orgao: ordem ? obterOrgao(dados, ordem.orgaoId) : null,
    diasAberto: diasEntre(chamado.dataAbertura, fim),
  };
}

export const listarDetalhados = (dados) => dados.chamadosZeladoria.map((chamado) => detalhar(dados, chamado));

/** Fila de prioridade: não resolvidos, maior score primeiro. */
export function listarTopPrioridade(dados, quantidade = 3) {
  return listarDetalhados(dados)
    .filter((item) => item.chamado.status !== 'Resolvido')
    .sort((a, b) => b.score - a.score || (b.media ?? 0) - (a.media ?? 0))
    .slice(0, quantidade);
}

const ORDENACOES = {
  score: (a, b) => b.score - a.score || (b.media ?? 0) - (a.media ?? 0),
  votos: (a, b) => b.chamado.totalVotos - a.chamado.totalVotos || b.score - a.score,
  urgencia: (a, b) => (b.media ?? 0) - (a.media ?? 0) || b.chamado.totalVotos - a.chamado.totalVotos,
  recentes: (a, b) => (a.chamado.dataAbertura < b.chamado.dataAbertura ? 1 : -1),
};

/**
 * Filtros combinados: texto (protocolo, título, logradouro, ponto de referência,
 * bairro), zona, bairro, categoria, status + ordenação.
 */
export function filtrarChamados(dados, opcoes = {}) {
  const { texto = '', regiao = '', bairroId = '', categoria = '', status = '', ordenacao = 'score' } = opcoes;

  const resultado = listarDetalhados(dados).filter((item) => {
    const { chamado, bairro } = item;

    if (regiao && bairro?.regiao !== regiao) return false;
    if (bairroId && chamado.bairroId !== Number(bairroId)) return false;
    if (categoria && chamado.categoria !== categoria) return false;
    if (status && chamado.status !== status) return false;

    if (texto.trim()) {
      const alvo = [chamado.protocolo, chamado.titulo, chamado.logradouro, chamado.pontoReferencia, bairro?.nome ?? '', bairro?.regiao ?? '']
        .join(' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      const termo = texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

      if (!alvo.includes(termo)) return false;
    }

    return true;
  });

  return resultado.sort(ORDENACOES[ordenacao] ?? ORDENACOES.score);
}

/** Indicadores da home — tudo derivado dos arrays. */
export function calcularIndicadores(dados) {
  const chamados = dados.chamadosZeladoria;
  const bairrosAlta = dados.bairros.filter((bairro) => bairro.indiceVulnerabilidade >= 4);
  const idsAlta = new Set(bairrosAlta.map((bairro) => bairro.bairroId));
  const emAlta = chamados.filter((chamado) => idsAlta.has(chamado.bairroId));

  return {
    totalChamados: chamados.length,
    chamadosAbertos: chamados.filter((c) => c.status === 'Aberto').length,
    chamadosEmAndamento: chamados.filter((c) => c.status === 'Em_Andamento').length,
    chamadosResolvidos: chamados.filter((c) => c.status === 'Resolvido').length,
    totalVotos: dados.votosChamado.length,
    chamadosAltaVulnerabilidade: emAlta.length,
    bairrosAltaComChamado: new Set(emAlta.map((c) => c.bairroId)).size,
    bairrosAltaTotal: bairrosAlta.length,
    ordensEmitidas: dados.ordensServico.length,
    ordensConcluidas: dados.ordensServico.filter((os) => os.statusExecucao === 'Concluida').length,
  };
}

/* ------------------------------------------------------------- mutações */

/** Protocolo ZEL-2026-0006 — cresce a partir do maior existente. */
export function gerarProtocolo(dados) {
  const ano = new Date().getFullYear();
  const maior = dados.chamadosZeladoria.reduce((max, chamado) => {
    const sequencia = Number.parseInt(String(chamado.protocolo ?? '').split('-')[2], 10);
    return Number.isNaN(sequencia) ? max : Math.max(max, sequencia);
  }, 0);
  return `ZEL-${ano}-${String(maior + 1).padStart(4, '0')}`;
}

/** Reaproveita o cidadão pelo CPF (UK_CIDADAO_CPF) ou cadastra um novo. */
function garantirCidadao(dados, { nome, cpf, email, telefone }) {
  const cpfLimpo = String(cpf ?? '').replace(/\D/g, '');
  const existente = dados.cidadaos.find((c) => String(c.cpf).replace(/\D/g, '') === cpfLimpo);

  if (existente) {
    const atualizado = !existente.telefone && telefone ? { ...existente, telefone } : existente;
    return {
      cidadao: atualizado,
      cidadaos: dados.cidadaos.map((c) => (c.cidadaoId === atualizado.cidadaoId ? atualizado : c)),
      novo: false,
    };
  }

  const cidadao = {
    cidadaoId: maiorId(dados.cidadaos, 'cidadaoId'),
    nome: String(nome).trim(),
    cpf: String(cpf).trim(),
    email: String(email).trim(),
    telefone: String(telefone ?? '').trim() || null,
    dataCadastro: hojeISO(),
  };

  return { cidadao, cidadaos: [...dados.cidadaos, cidadao], novo: true };
}

/**
 * Registra o voto de urgência: valida nota 1..5, entidades e voto único por CPF,
 * soma +1 em totalVotos e devolve o novo estado + as métricas recalculadas.
 */
export function registrarVoto(dados, { chamadoId, cidadaoId, nivelUrgencia, comentario }) {
  const chamado = obterChamado(dados, chamadoId);
  const cidadao = obterCidadao(dados, cidadaoId);
  const nota = Number(nivelUrgencia);

  if (!chamado) return { ok: false, mensagem: 'Chamado não encontrado.' };
  if (!cidadao) return { ok: false, mensagem: 'Selecione quem está votando.' };
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    return { ok: false, mensagem: 'Escolha um nível de urgência entre 1 e 5.' };
  }
  if (jaVotou(dados, chamadoId, cidadaoId)) {
    return { ok: false, mensagem: `${cidadao.nome} já votou neste chamado (1 voto por CPF).` };
  }

  const voto = {
    votoId: maiorId(dados.votosChamado, 'votoId'),
    dataVoto: hojeISO(),
    nivelUrgencia: nota,
    comentario: String(comentario ?? '').trim() || null,
    chamadoId: Number(chamadoId),
    cidadaoId: Number(cidadaoId),
  };

  const chamadoAtualizado = { ...chamado, totalVotos: Number(chamado.totalVotos) + 1 };
  const novosDados = {
    ...dados,
    chamadosZeladoria: dados.chamadosZeladoria.map((c) =>
      c.chamadoId === chamadoAtualizado.chamadoId ? chamadoAtualizado : c
    ),
    votosChamado: [...dados.votosChamado, voto],
  };

  return {
    ok: true,
    dados: novosDados,
    voto,
    chamado: chamadoAtualizado,
    totalVotos: chamadoAtualizado.totalVotos,
    score: calcularScore(novosDados, chamadoAtualizado),
    media: calcularMediaUrgencia(novosDados, chamadoAtualizado.chamadoId),
  };
}

/**
 * Cria o chamado + o voto inicial do autor.
 * `totalVotos` começa em 1 porque esse voto já entra em VOTO_CHAMADO.
 */
export function criarChamado(dados, payload) {
  const { cidadao, cidadaos } = garantirCidadao(dados, payload);

  const chamado = {
    chamadoId: maiorId(dados.chamadosZeladoria, 'chamadoId'),
    protocolo: gerarProtocolo(dados),
    titulo: String(payload.titulo).trim(),
    descricao: String(payload.descricao).trim(),
    categoria: payload.categoria,
    logradouro: String(payload.logradouro).trim(),
    numeroEndereco: String(payload.numeroEndereco).trim(),
    pontoReferencia: String(payload.pontoReferencia).trim(),
    urlFoto: payload.urlFoto || 'assets/img/sem-foto.svg',
    status: 'Aberto',
    dataAbertura: hojeISO(),
    totalVotos: 1,
    cidadaoAutorId: cidadao.cidadaoId,
    bairroId: Number(payload.bairroId),
  };

  const voto = {
    votoId: maiorId(dados.votosChamado, 'votoId'),
    dataVoto: hojeISO(),
    nivelUrgencia: Number(payload.nivelUrgencia),
    comentario: 'Voto inicial registrado na abertura do chamado.',
    chamadoId: chamado.chamadoId,
    cidadaoId: cidadao.cidadaoId,
  };

  const novosDados = {
    ...dados,
    cidadaos,
    chamadosZeladoria: [...dados.chamadosZeladoria, chamado],
    votosChamado: [...dados.votosChamado, voto],
  };

  return { ok: true, dados: novosDados, chamado, cidadao, voto, protocolo: chamado.protocolo };
}

/** Bairros agrupados por região (para os <optgroup> dos selects). */
export function bairrosPorRegiao(dados) {
  const regioes = ['Zona Sul', 'Zona Leste', 'Zona Norte', 'Zona Oeste', 'Centro'];
  return regioes
    .map((regiao) => ({ regiao, bairros: dados.bairros.filter((bairro) => bairro.regiao === regiao) }))
    .filter((grupo) => grupo.bairros.length > 0);
}

/** Cidadão que menos votou — vira a identidade padrão do painel de votação. */
export function cidadaoComMenosVotos(dados) {
  const ranking = dados.cidadaos
    .map((cidadao) => ({
      cidadaoId: cidadao.cidadaoId,
      votos: dados.votosChamado.filter((voto) => voto.cidadaoId === cidadao.cidadaoId).length,
    }))
    .sort((a, b) => a.votos - b.votos || a.cidadaoId - b.cidadaoId);

  return ranking[0]?.cidadaoId ?? null;
}
