/**
 * Formatação e normalização de texto — usadas em toda a interface.
 */

/** '2026-11-01' -> '01/11/2026' */
export function formatarData(iso, fallback = '—') {
  if (!iso) return fallback;
  const partes = String(iso).slice(0, 10).split('-');
  if (partes.length !== 3) return iso;
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

/** Data de hoje no formato do banco (YYYY-MM-DD). */
export function hojeISO() {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

/** Dias inteiros entre duas datas ISO (fim ausente = hoje). */
export function diasEntre(isoInicio, isoFim) {
  const inicio = new Date(`${isoInicio}T00:00:00`);
  const fim = new Date(`${isoFim || hojeISO()}T00:00:00`);
  if (Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime())) return null;
  return Math.round((fim - inicio) / 86400000);
}

/** Minúsculas e sem acento — para a busca textual funcionar nos dois sentidos. */
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** '123.456.789-01' -> '12345678901' */
export function somenteDigitos(texto) {
  return String(texto ?? '').replace(/\D/g, '');
}

const formatadorNumero = new Intl.NumberFormat('pt-BR');

/** 1543 -> '1.543' */
export function numero(valor) {
  return formatadorNumero.format(valor ?? 0);
}

/** 4.75 -> '4,8' */
export function decimal(valor) {
  if (valor === null || valor === undefined || Number.isNaN(valor)) return '—';
  return valor.toFixed(1).replace('.', ',');
}

const ROTULOS = {
  Aberto: 'Aberto',
  Em_Andamento: 'Em andamento',
  Resolvido: 'Resolvido',
  Pendente: 'Pendente',
  Equipe_Em_Campo: 'Equipe em campo',
  Concluida: 'Concluída',
  Cancelada: 'Cancelada',
  Iluminacao: 'Iluminação',
  Asfalto: 'Asfalto',
  Limpeza: 'Limpeza',
  Drenagem: 'Drenagem',
};

/** 'Em_Andamento' -> 'Em andamento' */
export function humanizar(valor) {
  return ROTULOS[valor] ?? String(valor ?? '').replace(/_/g, ' ');
}

/** plural(1,'dia','dias') -> '1 dia' */
export function plural(quantidade, singular, pluralPalavra) {
  return `${quantidade} ${quantidade === 1 ? singular : pluralPalavra}`;
}

/* ---- classes CSS reutilizadas por chips e badges ---- */

export const classeStatus = (status) => `chip chip--${status}`;

export function classeVulnerabilidade(valor) {
  if (valor >= 4) return 'chip chip--vuln-alta';
  if (valor === 3) return 'chip chip--vuln-media';
  return 'chip chip--vuln-baixa';
}

export function textoVulnerabilidade(valor) {
  if (valor >= 5) return 'Muito alta';
  if (valor === 4) return 'Alta';
  if (valor === 3) return 'Média';
  if (valor === 2) return 'Baixa';
  return 'Muito baixa';
}
