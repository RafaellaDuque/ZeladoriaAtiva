import { useEffect, useState } from 'react';
import { numero } from '../domain/format.js';
import { useRevelar } from '../utils/revelar.js';

/** Contagem animada do número (respeita prefers-reduced-motion). */
export function useContagem(destino, duracao = 900) {
  const [valor, setValor] = useState(destino);

  useEffect(() => {
    const reduzirMovimento =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduzirMovimento || !destino) {
      setValor(destino);
      return undefined;
    }

    let quadro;
    const inicio = performance.now();
    setValor(0);

    const passo = (agora) => {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const suavizado = 1 - (1 - progresso) ** 3;
      setValor(Math.round(destino * suavizado));
      if (progresso < 1) quadro = requestAnimationFrame(passo);
    };

    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [destino, duracao]);

  return valor;
}

/** Card de indicador do painel da home. */
export default function KpiCard({ valor, rotulo, atraso = 0 }) {
  const valorExibido = useContagem(valor);
  const ref = useRevelar(atraso);

  return (
    <article className="kpi" ref={ref}>
      <strong className="kpi__valor">{numero(valorExibido)}</strong>
      <span className="kpi__rotulo">{rotulo}</span>
    </article>
  );
}
