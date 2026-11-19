import { useRevelar } from '../utils/revelar.js';

/**
 * Envolve um bloco para que ele apareça suavemente ao entrar na tela.
 * Uso: <Revelar as="article" className="ods-card" atraso={120}>…</Revelar>
 */
export default function Revelar({ as: Tag = 'div', atraso = 0, children, ...resto }) {
  const ref = useRevelar(atraso);

  return (
    <Tag ref={ref} {...resto}>
      {children}
    </Tag>
  );
}
