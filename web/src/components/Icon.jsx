/**
 * Biblioteca de ícones SVG (traço 1,8) — herdando a cor do texto via currentColor.
 * Uso: <Icon nome="mapa" /> — a classe `icone` dá o tamanho padrão (1.1em);
 * qualquer regra mais específica do CSS (ex.: .btn svg) continua vencendo.
 */
const CAMINHOS = {
  escudo: (
    <>
      <path d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  mapa: (
    <>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  voto: (
    <>
      <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19" />
      <circle cx="10" cy="7.5" r="3.5" />
      <path d="M20 19v-1.2a3.4 3.4 0 0 0-2.6-3.3" />
      <path d="M15.5 4.3a3.5 3.5 0 0 1 0 6.5" />
    </>
  ),
  orgao: (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V7l7-4 7 4v14" />
      <path d="M9.5 21v-5h5v5" />
      <path d="M9.5 11h.01M14.5 11h.01" />
    </>
  ),
  os: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2.2" />
      <path d="M9.5 4V3h5v1" />
      <path d="M9 10h6M9 14h6M9 18h3" />
    </>
  ),
  luz: (
    <>
      <path d="M9.5 18h5" />
      <path d="M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6h5.4c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z" />
    </>
  ),
  asfalto: (
    <>
      <path d="M4.5 21 8.5 3" />
      <path d="M19.5 21 15.5 3" />
      <path d="M12 4v3.5M12 11v3.5M12 18v3" />
    </>
  ),
  limpeza: (
    <>
      <path d="M4 7h16" />
      <path d="M9.5 7V4h5v3" />
      <path d="M6.5 7 7.5 21h9L17.5 7" />
      <path d="M10 11v6M14 11v6" />
    </>
  ),
  drenagem: (
    <>
      <path d="M12 3s5 5.4 5 9a5 5 0 1 1-10 0c0-3.6 5-9 5-9z" />
      <path d="M9.5 13.5a2.5 2.5 0 0 0 2.5 2.5" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  checkCirculo: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </>
  ),
  alerta: (
    <>
      <path d="M12 4.5 3.5 19h17z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </>
  ),
  seta: (
    <>
      <path d="M5 12h13" />
      <path d="m12.5 6 6 6-6 6" />
    </>
  ),
  relogio: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </>
  ),
  usuario: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  camera: (
    <>
      <path d="M12 16.5V5" />
      <path d="m7.5 9.5 4.5-4.5 4.5 4.5" />
      <path d="M4.5 16v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
    </>
  ),
  restaurar: (
    <>
      <path d="M20 12a8 8 0 1 1-2.4-5.7" />
      <path d="M20 4.5v5h-5" />
    </>
  ),
  busca: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </>
  ),
  documento: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </>
  ),
  enviar: <path d="M4 12l16-8-6 16-2.5-6.5z" />,
  mais: <path d="M12 5v14M5 12h14" />,
  lampada: (
    <>
      <path d="M9.5 18h5" />
      <path d="M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6h5.4c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z" />
    </>
  ),
};

/** Ícone por nome. */
export default function Icon({ nome, className = '' }) {
  const conteudo = CAMINHOS[nome];
  if (!conteudo) return null;

  return (
    <svg
      className={['icone', className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {conteudo}
    </svg>
  );
}

/** Ícone da especialidade/categoria do chamado. */
const POR_CATEGORIA = {
  Iluminacao: 'luz',
  Asfalto: 'asfalto',
  Limpeza: 'limpeza',
  Drenagem: 'drenagem',
};

export function IconeCategoria({ categoria }) {
  return <Icon nome={POR_CATEGORIA[categoria] ?? 'documento'} />;
}
