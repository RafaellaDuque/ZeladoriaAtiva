import { useCallback, useEffect, useRef, useState } from 'react';
import Marca from './Marca.jsx';

/** Páginas do menu — mesma ordem e rótulos nas 3 telas. */
export const PAGINAS = [
  { chave: 'chamados', href: 'chamados.html', rotulo: 'Explorar e votar' },
  { chave: 'novo', href: 'novo-chamado.html', rotulo: 'Abrir chamado', cta: true },
];

/**
 * Cabeçalho fixo com navegação idêntica nas 3 páginas.
 * A página atual vem de `<body data-pagina="...">` e vira `aria-current="page"`.
 */
export default function Header() {
  const [aberto, setAberto] = useState(false);
  const referencia = useRef(null);
  const paginaAtual = typeof document !== 'undefined' ? document.body.dataset.pagina : 'home';

  const fechar = useCallback(() => setAberto(false), []);

  useEffect(() => {
    const aoTeclar = (evento) => {
      if (evento.key === 'Escape') fechar();
    };
    const aoClicarFora = (evento) => {
      if (referencia.current && !referencia.current.contains(evento.target)) fechar();
    };
    const aoRedimensionar = () => {
      if (window.innerWidth > 760) fechar();
    };

    document.addEventListener('keydown', aoTeclar);
    document.addEventListener('click', aoClicarFora);
    window.addEventListener('resize', aoRedimensionar);
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.removeEventListener('click', aoClicarFora);
      window.removeEventListener('resize', aoRedimensionar);
    };
  }, [fechar]);

  return (
    <header className={['topo', aberto ? 'topo--aberto' : ''].filter(Boolean).join(' ')} ref={referencia}>
      <div className="container topo__inner">
        <Marca />

        <button
          className="menu-btn"
          type="button"
          aria-expanded={aberto}
          aria-controls="menuPrincipal"
          onClick={(evento) => {
            evento.stopPropagation();
            setAberto((valor) => !valor);
          }}
        >
          <span className="menu-btn__barras" aria-hidden="true" />
          <span>Menu</span>
        </button>

        <nav className="topo__nav" id="menuPrincipal" aria-label="Navegação principal">
          <ul className="nav-links">
            {PAGINAS.map((pagina) => (
              <li key={pagina.chave}>
                <a
                  href={pagina.href}
                  className={pagina.cta ? 'btn btn--primario nav-cta' : undefined}
                  aria-current={pagina.chave === paginaAtual ? 'page' : undefined}
                  onClick={fechar}
                >
                  {pagina.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
