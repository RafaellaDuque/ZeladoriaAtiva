/** Marca (logo + assinatura) — usada no cabeçalho e no rodapé. */
export default function Marca({ href = "index.html" }) {
  return (
    <a
      className="marca"
      href={href}
      aria-label="Zeladoria Ativa — página inicial"
    >
      <span className="marca__icone" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.6 20 6v5.1c0 5-3.4 8.8-8 10.3C7.4 19.9 4 16.1 4 11.1V6z"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M12 8.2v3.2"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="14.4" r="1.7" fill="#ff6a2c" />
        </svg>
      </span>
      <span className="marca__texto">
        <strong>Zeladoria Ativa</strong>
        <small>Priorização comunitária · São Paulo</small>
      </span>
    </a>
  );
}
